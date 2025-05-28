// components/post/post-form.tsx
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForums } from '@/hooks/use-forums'
import { usePosts } from '@/hooks/use-posts'
import { useToast } from '@/components/ui/toast'
import { RetroButton } from '@/components/ui/retro-button'
import { RetroInput } from '@/components/ui/retro-input'
import { CategorySelector } from './category-selector'
import { PostTypeSelector } from './post-type-selector'
import { TemplateForm } from './template-form'
import { TMDBSearcher } from './tmdb-searcher'
import { getTemplateByType } from '@/lib/post-templates'
import { Save, Eye, Loader2 } from 'lucide-react'

interface PostFormData {
  title: string
  content: string
  forum_id: string
  post_type: string
  template_data: Record<string, any>
}

export function PostForm() {
  const router = useRouter()
  const { categories, isLoading: loadingCategories } = useForums()
  const { createPost, isLoading: isCreating } = usePosts()
  const { success, error } = useToast()

  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    forum_id: '',
    post_type: 'general',
    template_data: {}
  })

  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedForum, setSelectedForum] = useState('')
  const [tmdbData, setTmdbData] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      error('Erro de validação', 'Título é obrigatório')
      return
    }

    if (!formData.forum_id) {
      error('Erro de validação', 'Selecione um fórum')
      return
    }

    try {
      // Preparar dados para envio
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim() || undefined,
        forum_id: formData.forum_id,
        post_type: formData.post_type,
        template_data: {} as Record<string, any>
      }

      // Combinar template_data com dados do TMDB
      if (Object.keys(formData.template_data).length > 0) {
        postData.template_data = { ...formData.template_data }
      }

      // Adicionar dados do TMDB se disponível
      if (tmdbData) {
        // Para filmes e séries, adicionar dados específicos do TMDB
        if (formData.post_type === 'filme' || formData.post_type === 'série') {
          postData.template_data = {
            ...postData.template_data,
            tmdb_id: tmdbData.id?.toString(),
            titulo_personalizado: tmdbData.title || postData.title,
            // Outros campos serão preenchidos pelo TemplateForm
          }
        }
      }

      // Debug: mostrar dados que serão enviados
      console.log('Dados do post a serem enviados:', postData)

      const newPost = await createPost(postData)
      success('Post criado com sucesso!', 'Redirecionando...')
      
      setTimeout(() => {
        router.push(`/forum/${formData.forum_id}`)
      }, 1500)
    } catch (err) {
      console.error('Erro no submit:', err)
      // Erro já tratado no hook
    }
  }

  const handleTmdbDataReceived = (data: any) => {
    setTmdbData(data)
    // Auto-preencher título se estiver vazio
    if (!formData.title && data?.title) {
      setFormData(prev => ({
        ...prev,
        title: data.title
      }))
    }
  }

  const selectedTemplate = getTemplateByType(formData.post_type)
  const requiresTmdb = formData.post_type === 'filme' || formData.post_type === 'série'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="retro-panel p-6">
            <h3 className="text-lg font-bold text-retro-text mb-4">Informações Básicas</h3>
            
            <div className="space-y-4">
              <RetroInput
                label="Título do Post *"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Digite o título do seu post"
                required
              />

              <div>
                <label className="block text-sm font-medium text-retro-text mb-2">
                  Descrição/Conteúdo
                </label>
                <textarea
                  className="retro-input w-full h-32 resize-none"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Adicione uma descrição ou conteúdo adicional (opcional)"
                />
              </div>
            </div>
          </div>

          {/* Category and Forum Selection */}
          <div className="retro-panel p-6">
            <h3 className="text-lg font-bold text-retro-text mb-4">Localização do Post</h3>
            
            <CategorySelector
              categories={categories}
              isLoading={loadingCategories}
              selectedCategory={selectedCategory}
              selectedForum={selectedForum}
              onCategoryChange={setSelectedCategory}
              onForumChange={(forumId) => {
                setSelectedForum(forumId)
                setFormData(prev => ({ ...prev, forum_id: forumId }))
              }}
            />
          </div>

          {/* Post Type Selection */}
          <div className="retro-panel p-6">
            <h3 className="text-lg font-bold text-retro-text mb-4">Tipo de Conteúdo</h3>
            
            <PostTypeSelector
              selectedType={formData.post_type}
              selectedCategory={selectedCategory}
              onTypeChange={(type) => {
                setFormData(prev => ({ 
                  ...prev, 
                  post_type: type,
                  template_data: {} // Reset template data quando muda o tipo
                }))
                setTmdbData(null) // Reset TMDB data
              }}
            />
          </div>

          {/* TMDB Search (apenas para filmes e séries) */}
          {requiresTmdb && (
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">
                Buscar no TMDB
              </h3>
              
              <TMDBSearcher
                mediaType={formData.post_type === 'filme' ? 'movie' : 'tv'}
                onDataReceived={handleTmdbDataReceived}
                currentData={tmdbData}
              />
            </div>
          )}

          {/* Template Form */}
          {selectedTemplate && (
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">
                Detalhes do {selectedTemplate.tipo}
              </h3>
              
              <TemplateForm
                template={selectedTemplate}
                data={formData.template_data}
                onChange={(data) => setFormData(prev => ({ ...prev, template_data: data }))}
                tmdbData={tmdbData}
              />
            </div>
          )}

          {/* Submit Buttons */}
          <div className="retro-panel p-6">
            <div className="flex items-center justify-between">
              <RetroButton
                type="button"
                variant="secondary"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Ocultar' : 'Visualizar'} Preview
              </RetroButton>

              <RetroButton
                type="submit"
                disabled={isCreating || !formData.title.trim() || !formData.forum_id}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando Post...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Criar Post
                  </>
                )}
              </RetroButton>
            </div>
          </div>
        </div>

        {/* Sidebar - Preview e Dicas */}
        <div className="space-y-6">
          {/* Preview */}
          {showPreview && (
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Preview</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-retro-blue mb-1">Título:</h4>
                  <p className="text-sm text-retro-text">{formData.title || 'Sem título'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-retro-blue mb-1">Tipo:</h4>
                  <p className="text-sm text-slate-400">{formData.post_type}</p>
                </div>

                {formData.content && (
                  <div>
                    <h4 className="font-medium text-retro-blue mb-1">Conteúdo:</h4>
                    <p className="text-sm text-slate-400">{formData.content.substring(0, 200)}{formData.content.length > 200 && '...'}</p>
                  </div>
                )}
                
                {tmdbData && (
                  <div>
                    <h4 className="font-medium text-retro-blue mb-1">TMDB:</h4>
                    <div className="text-xs text-slate-400">
                      <p>ID: {tmdbData.id}</p>
                      <p>Ano: {tmdbData.ano_lancamento}</p>
                      <p>Gêneros: {tmdbData.generos?.join(', ')}</p>
                    </div>
                  </div>
                )}

                {Object.keys(formData.template_data).length > 0 && (
                  <div>
                    <h4 className="font-medium text-retro-blue mb-1">Dados do Template:</h4>
                    <div className="text-xs text-slate-400 space-y-1">
                      {Object.entries(formData.template_data).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {String(value).substring(0, 50)}
                          {String(value).length > 50 && '...'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="retro-panel p-6">
            <h3 className="text-lg font-bold text-retro-text mb-4">Dicas</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p>• Use títulos descritivos e claros</p>
              <p>• Para filmes/séries, use o ID do TMDB</p>
              <p>• Preencha todos os campos obrigatórios</p>
              <p>• Verifique a categoria e fórum corretos</p>
              <p>• Use o preview para revisar antes de postar</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
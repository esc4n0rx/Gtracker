
"use client"

import { POST_TEMPLATES, validateTemplate } from '@/lib/post-templates'
import { Film, Tv, Gamepad2, Monitor, BookOpen, FileText, Users, HelpCircle, Settings, MessageSquare } from 'lucide-react'

interface PostTypeSelectorProps {
  selectedType: string
  selectedCategory: string
  onTypeChange: (type: string) => void
}

const POST_TYPE_ICONS = {
  filme: Film,
  série: Tv,
  jogo: Gamepad2,
  software: Monitor,
  curso: BookOpen,
  ebook: FileText,
  pedido_arquivo: HelpCircle,
  candidatura: Users,
  regras: Settings,
  anuncio_oficial: Settings,
  sugestao: MessageSquare,
  fale_conosco: MessageSquare,
  apresentacao: Users,
  duvida_suporte: HelpCircle,
  general: FileText
}

const POST_TYPE_LABELS = {
  filme: 'Filme',
  série: 'Série/TV',
  jogo: 'Jogo',
  software: 'Software',
  curso: 'Curso',
  ebook: 'E-book',
  pedido_arquivo: 'Pedido de Arquivo',
  candidatura: 'Candidatura',
  regras: 'Regras',
  anuncio_oficial: 'Anúncio Oficial',
  sugestao: 'Sugestão',
  fale_conosco: 'Fale Conosco',
  apresentacao: 'Apresentação',
  duvida_suporte: 'Dúvida/Suporte',
  general: 'Geral'
}

export function PostTypeSelector({ selectedType, selectedCategory, onTypeChange }: PostTypeSelectorProps) {
  // Filtrar tipos baseado na categoria selecionada
  const availableTypes = POST_TEMPLATES.filter(template => {
    if (!selectedCategory) return true
    
    // Se não temos informação da categoria, mostrar todos
    const categoryName = selectedCategory // Idealmente, precisaríamos mapear ID para nome
    return template.categorias_aplicaveis.some(cat => 
      cat.toLowerCase().includes('http') || 
      cat.toLowerCase().includes('torrent') || 
      cat.toLowerCase().includes('social') ||
      cat.toLowerCase().includes('comunidade')
    )
  })

  // Adicionar tipo "general" sempre
  const allTypes = [
    { tipo: 'general', categorias_aplicaveis: ['*'] },
    ...availableTypes
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        Selecione o tipo de conteúdo que você está postando *
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {allTypes.map(template => {
          const Icon = POST_TYPE_ICONS[template.tipo as keyof typeof POST_TYPE_ICONS] || FileText
          const label = POST_TYPE_LABELS[template.tipo as keyof typeof POST_TYPE_LABELS] || template.tipo
          const isSelected = selectedType === template.tipo

          return (
            <button
              key={template.tipo}
              type="button"
              onClick={() => onTypeChange(template.tipo)}
              className={`
                p-4 rounded-lg border-2 transition-all
                flex flex-col items-center text-center space-y-2
                hover:scale-105 hover:shadow-lg
                ${isSelected 
                  ? 'border-retro-blue bg-retro-blue/10 text-retro-neon' 
                  : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-retro-blue/50'
                }
              `}
            >
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                ${isSelected 
                  ? 'bg-gradient-to-br from-retro-blue to-retro-purple' 
                  : 'bg-gradient-to-br from-slate-600 to-slate-700'
                }
              `}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <div className="font-medium text-sm">{label}</div>
                {template.tipo !== 'general' && (
                  <div className="text-xs text-slate-400 mt-1">
                    {'campos' in template && Array.isArray((template as any).campos) ? (template as any).campos.length : 0} campos
                  </div>
                )}
              </div>

              {isSelected && (
                <div className="w-2 h-2 bg-retro-neon rounded-full"></div>
              )}
            </button>
          )
        })}
      </div>

      {selectedType && selectedType !== 'general' && (
        <div className="retro-panel p-4 bg-blue-900/20 border-blue-500/30">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h4 className="font-medium text-blue-400 mb-1">
                Template: {POST_TYPE_LABELS[selectedType as keyof typeof POST_TYPE_LABELS]}
              </h4>
              <p className="text-sm text-slate-300">
                Este tipo de post possui campos específicos que serão apresentados abaixo.
                {(selectedType === 'filme' || selectedType === 'série') && (
                  ' Você poderá buscar informações automáticas no TMDB.'
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
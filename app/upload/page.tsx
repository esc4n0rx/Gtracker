"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { RetroButton } from "@/components/ui/retro-button"
import { RetroInput } from "@/components/ui/retro-input"
import { Upload, File, ImageIcon, Music, Archive, X, Plus, AlertCircle, CheckCircle, Info } from "lucide-react"

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    password: "",
  })
  const [isUploading, setIsUploading] = useState(false)

  const categories = [
    { value: "filmes", label: "Filmes", icon: File },
    { value: "series", label: "Séries", icon: File },
    { value: "jogos", label: "Jogos", icon: Archive },
    { value: "software", label: "Software", icon: Archive },
    { value: "musica", label: "Música", icon: Music },
    { value: "documentarios", label: "Documentários", icon: File },
    { value: "animes", label: "Animes", icon: ImageIcon },
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (!uploadData.title || !uploadData.category || selectedFiles.length === 0) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsUploading(true)

    // Simular upload
    setTimeout(() => {
      setIsUploading(false)
      alert("Upload realizado com sucesso!")
      // Reset form
      setSelectedFiles([])
      setUploadData({
        title: "",
        description: "",
        category: "",
        tags: "",
        password: "",
      })
    }, 3000)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return ImageIcon
      case "mp4":
      case "avi":
      case "mkv":
        return File
      case "mp3":
      case "wav":
      case "flac":
        return Music
      default:
        return File
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Page Header */}
        <div className="retro-panel p-6">
          <h1 className="text-3xl font-bold text-retro-text mb-2">Central de Upload</h1>
          <p className="text-slate-400">Compartilhe seus arquivos com a comunidade GTracker</p>
        </div>

        {/* Upload Rules */}
        <div className="retro-panel p-6 border-l-4 border-yellow-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-1" />
            <div>
              <h3 className="font-bold text-retro-text mb-2">Regras de Upload</h3>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Máximo de 5GB por arquivo</li>
                <li>• Conteúdo deve ser legal e seguir as diretrizes</li>
                <li>• Use títulos descritivos e categorias corretas</li>
                <li>• Não faça upload de conteúdo duplicado</li>
                <li>• Arquivos com vírus serão removidos automaticamente</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Selection */}
            <div className="retro-panel p-6">
              <h2 className="text-xl font-bold text-retro-text mb-4">Selecionar Arquivos</h2>

              <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-retro-blue transition-colors">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">Arraste e solte seus arquivos aqui ou clique para selecionar</p>
                <input type="file" multiple onChange={handleFileSelect} className="hidden" id="file-upload" />
                <label htmlFor="file-upload">
                  <RetroButton>
                    <Plus className="w-4 h-4 mr-2" />
                    Escolher Arquivos
                  </RetroButton>
                </label>
              </div>

              {/* Selected Files */}
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-bold text-retro-text mb-3">Arquivos Selecionados</h3>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => {
                      const FileIcon = getFileIcon(file.name)
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-800 rounded">
                          <div className="flex items-center gap-3">
                            <FileIcon className="w-5 h-5 text-retro-blue" />
                            <div>
                              <div className="text-retro-text font-medium">{file.name}</div>
                              <div className="text-xs text-slate-400">{formatFileSize(file.size)}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Upload Details */}
            <div className="retro-panel p-6">
              <h2 className="text-xl font-bold text-retro-text mb-4">Detalhes do Upload</h2>

              <div className="space-y-4">
                <RetroInput
                  label="Título *"
                  placeholder="Digite um título descritivo"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                />

                <div>
                  <label className="block text-sm font-medium text-retro-text mb-2">Categoria *</label>
                  <select
                    className="retro-input w-full"
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-retro-text mb-2">Descrição</label>
                  <textarea
                    className="retro-input w-full h-32 resize-none"
                    placeholder="Descreva o conteúdo, qualidade, idioma, etc..."
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  />
                </div>

                <RetroInput
                  label="Tags"
                  placeholder="Ex: ação, 2024, dublado (separadas por vírgula)"
                  value={uploadData.tags}
                  onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
                />

                <RetroInput
                  label="Senha do Arquivo (opcional)"
                  placeholder="Deixe em branco se não houver senha"
                  value={uploadData.password}
                  onChange={(e) => setUploadData({ ...uploadData, password: e.target.value })}
                />
              </div>
            </div>

            {/* Upload Button */}
            <div className="retro-panel p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">{selectedFiles.length} arquivo(s) selecionado(s)</div>
                <RetroButton
                  onClick={handleUpload}
                  disabled={isUploading || selectedFiles.length === 0}
                  className={isUploading ? "opacity-50 cursor-not-allowed" : ""}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Fazer Upload
                    </>
                  )}
                </RetroButton>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upload Stats */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Suas Estatísticas</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total de Uploads:</span>
                  <span className="text-retro-text font-bold">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Downloads Gerados:</span>
                  <span className="text-green-400 font-bold">2,341</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pontos Ganhos:</span>
                  <span className="text-retro-neon font-bold">15,678</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ranking:</span>
                  <span className="text-yellow-500 font-bold">#12</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-retro-blue" />
                Dicas de Upload
              </h3>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Use títulos claros e descritivos</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Adicione screenshots para filmes/jogos</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Inclua informações de qualidade</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Use tags relevantes para facilitar busca</span>
                </div>
              </div>
            </div>

            {/* Recent Uploads */}
            <div className="retro-panel p-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Uploads Recentes</h3>
              <div className="space-y-2 text-sm">
                {[
                  { title: "Filme Ação 2024", downloads: 234 },
                  { title: "Software Design", downloads: 156 },
                  { title: "Série Drama", downloads: 89 },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-retro-blue truncate">{item.title}</span>
                    <span className="text-slate-400">{item.downloads} DLs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// components/profile/image-upload.tsx
"use client"

import { useState, useRef } from 'react'
import { RetroButton } from '@/components/ui/retro-button'
import { useToast } from '@/components/ui/toast'
import { 
  Upload, 
  X, 
  Loader2, 
  Camera, 
  Image as ImageIcon,
  AlertCircle 
} from 'lucide-react'

interface ImageUploadProps {
  currentImage?: string
  onUpload: (file: File) => Promise<string>
  onRemove?: () => Promise<void>
  isLoading: boolean
  type: 'avatar' | 'cover'
  className?: string
}

export function ImageUpload({
  currentImage,
  onUpload,
  onRemove,
  isLoading,
  type,
  className = ''
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { success, error } = useToast()

  const isAvatar = type === 'avatar'
  const maxSize = 20 * 1024 * 1024 // 20MB
  const acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return 'Formato não suportado. Use JPEG, PNG, WebP ou GIF.'
    }
    if (file.size > maxSize) {
      return 'Arquivo muito grande. Máximo 20MB.'
    }
    return null
  }

  const handleFileSelect = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      error('Arquivo inválido', validationError)
      return
    }

    // Preview local
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    try {
      await onUpload(file)
      success(
        `${isAvatar ? 'Avatar' : 'Capa'} atualizado!`,
        'Imagem processada e otimizada com sucesso'
      )
      setPreview(null)
    } catch (err) {
      setPreview(null)
      // Error já tratado no hook
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemove = async () => {
    if (!onRemove) return

    try {
      await onRemove()
      success(
        `${isAvatar ? 'Avatar' : 'Capa'} removido!`,
        ''
      )
    } catch (err) {
      // Error já tratado no hook
    }
  }

  const displayImage = preview || currentImage

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`
          relative rounded-lg border-2 border-dashed transition-all
          ${isDragging 
            ? 'border-retro-blue bg-retro-blue/10' 
            : 'border-slate-600 hover:border-slate-500'
          }
          ${isAvatar ? 'aspect-square max-w-xs mx-auto' : 'aspect-[3/1] max-w-2xl'}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        {displayImage ? (
          <>
            <img
              src={displayImage}
              alt={isAvatar ? 'Avatar' : 'Capa'}
              className={`
                w-full h-full object-cover rounded-lg
                ${isLoading ? 'opacity-50' : ''}
              `}
            />
            
            {/* Overlay com ações */}
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
              <RetroButton 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Camera className="w-4 h-4 mr-2" />
                Alterar
              </RetroButton>
              
              {onRemove && (
                <RetroButton 
                  size="sm" 
                  variant="danger"
                  onClick={handleRemove}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remover
                </RetroButton>
              )}
            </div>

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                <div className="flex items-center gap-2 text-white">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Processando...</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div 
            className="h-full flex flex-col items-center justify-center p-8 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-400" />
              )}
            </div>
            
            <h3 className="text-lg font-medium text-retro-text mb-2">
              {isAvatar ? 'Adicionar Avatar' : 'Adicionar Capa'}
            </h3>
            
            <p className="text-sm text-slate-400 text-center mb-4">
              Arraste uma imagem ou clique para selecionar
            </p>
            
            <div className="text-xs text-slate-500 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertCircle className="w-3 h-3" />
                Formatos: JPEG, PNG, WebP, GIF
              </div>
              <div>Tamanho máximo: 20MB</div>
              <div className="mt-1 text-slate-600">
                {isAvatar 
                  ? 'Será redimensionado para 500x500px' 
                  : 'Será redimensionado para 1200x400px'
                }
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Botões de ação para quando não há imagem */}
      {!displayImage && (
        <div className="text-center">
          <RetroButton 
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Selecionar {isAvatar ? 'Avatar' : 'Capa'}
          </RetroButton>
        </div>
      )}

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isLoading}
      />
    </div>
  )
}
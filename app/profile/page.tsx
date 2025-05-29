// app/profile/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { RetroButton } from '@/components/ui/retro-button'
import { RetroInput } from '@/components/ui/retro-input'
import { ImageUpload } from '@/components/profile/image-upload'
import { ProfileCard } from '@/components/profile/profile-card'
import { useProfileCustomization, UpdateProfileData } from '@/hooks/use-profile-customization'
import { useToast } from '@/components/ui/toast'
import { useAuth } from '@/contexts/auth-context'
import {
  User,
  Settings,
  Palette,
  Globe,
  Save,
  ArrowLeft,
  Loader2,
  RefreshCw,
  AlertCircle,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  Calendar,
  MapPin,
  Link as LinkIcon
} from 'lucide-react'
import Link from 'next/link'

function ProfileContent() {
  const { user } = useAuth()
  const { 
    profile, 
    isLoading, 
    error, 
    fetchProfile, 
    updateProfile, 
    uploadAvatar, 
    uploadCover, 
    removeAvatar, 
    removeCover 
  } = useProfileCustomization()
  const { success, error: showError } = useToast()

  const [formData, setFormData] = useState<UpdateProfileData>({})
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'social'>('profile')

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  useEffect(() => {
    if (profile) {
      setFormData({
        theme_color: profile.theme_color,
        custom_title: profile.custom_title || '',
        signature: profile.signature || '',
        social_links: profile.social_links,
        birthday: profile.birthday || '',
        timezone: profile.timezone,
        status: profile.status,
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || ''
      })
    }
  }, [profile])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateProfile(formData)
      success('Perfil atualizado!', 'Suas alterações foram salvas com sucesso')
    } catch (err) {
    } finally {
      setIsSaving(false)
    }
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => {
      const updatedLinks = {
        ...prev.social_links,
        [platform]: value
      }
      Object.keys(updatedLinks).forEach(key => {
        if (!updatedLinks[key]) {
          delete updatedLinks[key]
        }
      })
      return {
        ...prev,
        social_links: updatedLinks
      }
    })
  }

  const statusOptions = [
    { value: 'online', label: 'Online', color: 'bg-green-500' },
    { value: 'away', label: 'Ausente', color: 'bg-yellow-500' },
    { value: 'busy', label: 'Ocupado', color: 'bg-red-500' },
    { value: 'invisible', label: 'Invisível', color: 'bg-gray-500' },
    { value: 'offline', label: 'Offline', color: 'bg-gray-500' }
  ]

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'social', label: 'Social', icon: Globe }
  ]

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="retro-panel p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-retro-text mb-2">Erro ao carregar perfil</h2>
            <p className="text-slate-400 mb-4">{error}</p>
            <RetroButton onClick={fetchProfile}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </RetroButton>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-retro-dark via-retro-metal to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="retro-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-retro-text mb-2">Meu Perfil</h1>
              <p className="text-slate-400">
                Personalize seu perfil e configure suas preferências
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard">
                <RetroButton variant="secondary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </RetroButton>
              </Link>
              <RetroButton 
                onClick={handleSave}
                disabled={isSaving || isLoading}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Alterações
              </RetroButton>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h3 className="text-lg font-bold text-retro-text mb-4">Preview</h3>
              <ProfileCard showStats={true} />
            </div>
          </div>

          {/* Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="retro-panel p-2">
              <div className="flex gap-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-colors
                      ${activeTab === tab.id 
                        ? 'bg-retro-blue text-white' 
                        : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                      }
                    `}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
               {/* Cover Image */}
               <div className="retro-panel p-6">
                 <h3 className="text-lg font-bold text-retro-text mb-4 flex items-center gap-2">
                   <Settings className="w-5 h-5" />
                   Imagem de Capa
                 </h3>
                 <ImageUpload
                   currentImage={profile?.cover_image_url}
                   onUpload={uploadCover}
                   onRemove={removeCover}
                   isLoading={isLoading}
                   type="cover"
                 />
               </div>

               {/* Avatar */}
               <div className="retro-panel p-6">
                 <h3 className="text-lg font-bold text-retro-text mb-4 flex items-center gap-2">
                   <User className="w-5 h-5" />
                   Avatar
                 </h3>
                 <ImageUpload
                   currentImage={profile?.avatar_url}
                   onUpload={uploadAvatar}
                   onRemove={removeAvatar}
                   isLoading={isLoading}
                   type="avatar"
                 />
               </div>

               {/* Basic Info */}
               <div className="retro-panel p-6">
                 <h3 className="text-lg font-bold text-retro-text mb-4">Informações Básicas</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <RetroInput
                     label="Título Personalizado"
                     placeholder="ex: Desenvolvedor Full Stack"
                     value={formData.custom_title || ''}
                     onChange={(e) => setFormData(prev => ({ ...prev, custom_title: e.target.value }))}
                     maxLength={100}
                   />

                   <div>
                     <label className="block text-sm font-medium text-retro-text mb-2">
                       Status
                     </label>
                     <select
                       className="retro-input w-full"
                       value={formData.status || 'online'}
                       onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                     >
                       {statusOptions.map(option => (
                         <option key={option.value} value={option.value}>
                           {option.label}
                         </option>
                       ))}
                     </select>
                   </div>

                   <RetroInput
                     label="Localização"
                     placeholder="ex: São Paulo, Brasil"
                     value={formData.location || ''}
                     onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                     maxLength={100}
                   />

                   <RetroInput
                     label="Data de Nascimento"
                     type="date"
                     value={formData.birthday || ''}
                     onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
                   />

                   <div className="md:col-span-2">
                     <RetroInput
                       label="Website Pessoal"
                       type="url"
                       placeholder="https://meusite.com"
                       value={formData.website || ''}
                       onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                     />
                   </div>
                 </div>

                 <div className="mt-4">
                   <label className="block text-sm font-medium text-retro-text mb-2">
                     Biografia
                   </label>
                   <textarea
                     className="retro-input w-full h-24 resize-none"
                     placeholder="Conte um pouco sobre você..."
                     value={formData.bio || ''}
                     onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                     maxLength={1000}
                   />
                   <div className="text-xs text-slate-500 mt-1">
                     {(formData.bio || '').length}/1000 caracteres
                   </div>
                 </div>

                 <div className="mt-4">
                   <label className="block text-sm font-medium text-retro-text mb-2">
                     Assinatura
                   </label>
                   <textarea
                     className="retro-input w-full h-20 resize-none"
                     placeholder="Assinatura que aparece nos seus posts..."
                     value={formData.signature || ''}
                     onChange={(e) => setFormData(prev => ({ ...prev, signature: e.target.value }))}
                     maxLength={500}
                   />
                   <div className="text-xs text-slate-500 mt-1">
                     {(formData.signature || '').length}/500 caracteres
                   </div>
                 </div>
               </div>
             </div>
           )}

           {/* Appearance Tab */}
           {activeTab === 'appearance' && (
             <div className="space-y-6">
               <div className="retro-panel p-6">
                 <h3 className="text-lg font-bold text-retro-text mb-4 flex items-center gap-2">
                   <Palette className="w-5 h-5" />
                   Personalização Visual
                 </h3>

                 <div className="space-y-6">
                   {/* Theme Color */}
                   <div>
                     <label className="block text-sm font-medium text-retro-text mb-3">
                       Cor do Tema
                     </label>
                     <div className="flex items-center gap-4">
                       <input
                         type="color"
                         value={formData.theme_color || '#4A5568'}
                         onChange={(e) => setFormData(prev => ({ ...prev, theme_color: e.target.value }))}
                         className="w-16 h-16 rounded-lg border-2 border-slate-600 cursor-pointer"
                       />
                       <div className="flex-1">
                         <RetroInput
                           placeholder="#4A5568"
                           value={formData.theme_color || ''}
                           onChange={(e) => setFormData(prev => ({ ...prev, theme_color: e.target.value }))}
                           pattern="^#[0-9A-Fa-f]{6}$"
                         />
                         <div className="text-xs text-slate-500 mt-1">
                           Cor em formato hexadecimal (ex: #ff6b35)
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Color Presets */}
                   <div>
                     <label className="block text-sm font-medium text-retro-text mb-3">
                       Cores Predefinidas
                     </label>
                     <div className="grid grid-cols-8 gap-2">
                       {[
                         '#4A5568', '#3182CE', '#805AD5', '#D53F8C',
                         '#E53E3E', '#DD6B20', '#38A169', '#00A3C4',
                         '#6B46C1', '#F56565', '#ED8936', '#48BB78',
                         '#0BC5EA', '#9F7AEA', '#EC4899', '#EF4444'
                       ].map(color => (
                         <button
                           key={color}
                           onClick={() => setFormData(prev => ({ ...prev, theme_color: color }))}
                           className={`
                             w-10 h-10 rounded-lg border-2 transition-all hover:scale-110
                             ${formData.theme_color === color ? 'border-white shadow-lg' : 'border-slate-600'}
                           `}
                           style={{ backgroundColor: color }}
                         />
                       ))}
                     </div>
                   </div>

                   {/* Preview */}
                   <div className="border border-slate-600 rounded-lg p-4">
                     <div className="text-sm font-medium text-retro-text mb-3">Preview da Cor</div>
                     <div className="flex items-center gap-3">
                       <div
                         className="w-12 h-12 rounded-full border-4 flex items-center justify-center"
                         style={{ borderColor: formData.theme_color || '#4A5568' }}
                       >
                         <User className="w-6 h-6 text-slate-400" />
                       </div>
                       <div>
                         <div 
                           className="font-medium"
                           style={{ color: formData.theme_color || '#4A5568' }}
                         >
                           {user?.nickname}
                         </div>
                         <div className="text-sm text-slate-400">
                           {formData.custom_title || 'Membro'}
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {/* Social Tab */}
           {activeTab === 'social' && (
             <div className="space-y-6">
               <div className="retro-panel p-6">
                 <h3 className="text-lg font-bold text-retro-text mb-4 flex items-center gap-2">
                   <Globe className="w-5 h-5" />
                   Redes Sociais
                 </h3>

                 <div className="space-y-4">
                   {[
                     { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/usuario' },
                     { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/usuario' },
                     { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/usuario' },
                     { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/usuario' },
                     { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/c/canal' },
                     { key: 'discord', label: 'Discord', icon: MessageCircle, placeholder: 'Usuario#1234' }
                   ].map(social => (
                     <div key={social.key} className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                         <social.icon className="w-5 h-5 text-slate-400" />
                       </div>
                       <div className="flex-1">
                         <RetroInput
                           label={social.label}
                           placeholder={social.placeholder}
                           value={formData.social_links?.[social.key] || ''}
                           onChange={(e) => handleSocialLinkChange(social.key, e.target.value)}
                         />
                       </div>
                     </div>
                   ))}
                 </div>

                 <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                   <div className="flex items-start gap-3">
                     <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                     <div>
                       <h4 className="font-medium text-blue-400 mb-1">Dica</h4>
                       <p className="text-sm text-slate-400">
                         Adicione suas redes sociais para que outros membros possam te encontrar. 
                         Os links aparecerão no seu perfil e nos seus posts.
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}
         </div>
       </div>
     </main>
   </div>
 )
}

export default function ProfilePage() {
 return (
   <ProtectedRoute>
     <ProfileContent />
   </ProtectedRoute>
 )
}
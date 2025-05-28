// components/post/template-form.tsx
"use client"

import { PostTemplate, getFieldConfig } from '@/lib/post-templates'
import { RetroInput } from '@/components/ui/retro-input'

interface TemplateFormProps {
  template: PostTemplate
  data: Record<string, any>
  onChange: (data: Record<string, any>) => void
  tmdbData?: any
}

export function TemplateForm({ template, data, onChange, tmdbData }: TemplateFormProps) {
  const handleFieldChange = (fieldName: string, value: any) => {
    onChange({
      ...data,
      [fieldName]: value
      })
 }

 // Auto-preencher campos com dados do TMDB quando disponível
 const getFieldValue = (fieldName: string) => {
   // Se já tem valor no formulário, usar ele
   if (data[fieldName] !== undefined && data[fieldName] !== '') {
     return data[fieldName]
   }

   // Se tem dados do TMDB, tentar preencher automaticamente
   if (tmdbData) {
     switch (fieldName) {
       case 'tmdb_id':
         return tmdbData.id?.toString() || ''
       case 'titulo_personalizado':
         return tmdbData.title || ''
       case 'duração':
         return tmdbData.runtime ? `${tmdbData.runtime} min` : ''
       case 'informações_extra':
         if (tmdbData.sinopse) {
           return `Sinopse: ${tmdbData.sinopse}\n\nElenco: ${tmdbData.elenco?.join(', ') || 'N/A'}\n\nGêneros: ${tmdbData.generos?.join(', ') || 'N/A'}`
         }
         break
       default:
         break
     }
   }

   return data[fieldName] || ''
 }

 return (
   <div className="space-y-4">
     {template.campos.map(fieldName => {
       const fieldConfig = getFieldConfig(fieldName)
       const fieldValue = getFieldValue(fieldName)

       return (
         <div key={fieldName}>
           {fieldConfig.type === 'textarea' ? (
             <div>
               <label className="block text-sm font-medium text-retro-text mb-2">
                 {fieldConfig.label}
                 {fieldConfig.required && <span className="text-red-400 ml-1">*</span>}
               </label>
               <textarea
                 className="retro-input w-full h-32 resize-none"
                 value={fieldValue}
                 onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                 placeholder={fieldConfig.placeholder}
                 required={fieldConfig.required}
               />
             </div>
           ) : fieldConfig.type === 'select' ? (
             <div>
               <label className="block text-sm font-medium text-retro-text mb-2">
                 {fieldConfig.label}
                 {fieldConfig.required && <span className="text-red-400 ml-1">*</span>}
               </label>
               <select
                 className="retro-input w-full"
                 value={fieldValue}
                 onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                 required={fieldConfig.required}
               >
                 <option value="">Selecione...</option>
                 {fieldConfig.options?.map(option => (
                   <option key={option.value} value={option.value}>
                     {option.label}
                   </option>
                 ))}
               </select>
             </div>
           ) : fieldConfig.type === 'number' ? (
             <RetroInput
               type="number"
               label={fieldConfig.label}
               value={fieldValue}
               onChange={(e) => handleFieldChange(fieldName, e.target.value)}
               placeholder={fieldConfig.placeholder}
               required={fieldConfig.required}
               min={fieldConfig.validation?.min}
               max={fieldConfig.validation?.max}
             />
           ) : (
             <RetroInput
               type={fieldConfig.type}
               label={fieldConfig.label}
               value={fieldValue}
               onChange={(e) => handleFieldChange(fieldName, e.target.value)}
               placeholder={fieldConfig.placeholder}
               required={fieldConfig.required}
             />
           )}

           {/* Mostrar informação do TMDB se disponível */}
           {tmdbData && fieldName === 'tmdb_id' && (
             <div className="mt-2 p-2 bg-blue-900/20 rounded text-xs text-blue-400">
               ✓ Dados carregados automaticamente do TMDB
             </div>
           )}
         </div>
       )
     })}

     {/* Campos da API (apenas para mostrar, não editáveis) */}
     {tmdbData && template.campos_api && (
       <div className="border-t border-slate-600 pt-4 mt-6">
         <h4 className="font-medium text-retro-text mb-3">Dados Automáticos (TMDB)</h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {template.campos_api.map(apiField => {
             let value = ''
             switch (apiField) {
               case 'poster':
                 if (tmdbData.poster) {
                   return (
                     <div key={apiField} className="col-span-full">
                       <label className="block text-sm font-medium text-slate-400 mb-2">
                         Poster
                       </label>
                       <img
                         src={tmdbData.poster}
                         alt="Poster"
                         className="w-32 h-48 object-cover rounded border border-slate-600"
                       />
                     </div>
                   )
                 }
                 break
               case 'sinopse':
                 value = tmdbData.sinopse || ''
                 break
               case 'elenco':
                 value = tmdbData.elenco?.join(', ') || ''
                 break
               case 'diretor':
                 value = tmdbData.diretor || ''
                 break
               case 'criadores':
                 value = tmdbData.criadores?.join(', ') || ''
                 break
               case 'generos':
                 value = tmdbData.generos?.join(', ') || ''
                 break
               case 'ano_lancamento':
                 value = tmdbData.ano_lancamento || ''
                 break
               default:
                 value = tmdbData[apiField] || ''
             }

             if (!value) return null

             return (
               <div key={apiField}>
                 <label className="block text-sm font-medium text-slate-400 mb-1">
                   {apiField.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                 </label>
                 <div className="text-sm text-slate-300 bg-slate-800/50 p-2 rounded">
                   {apiField === 'sinopse' ? (
                     <p className="line-clamp-3">{value}</p>
                   ) : (
                     value
                   )}
                 </div>
               </div>
             )
           })}
         </div>
       </div>
     )}
   </div>
 )
}
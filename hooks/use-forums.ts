// hooks/use-forums.ts
"use client"

import { useState, useEffect } from 'react'
import { categoriesApi, Category, ApiError } from '@/lib/api'

export function useForums() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await categoriesApi.getAll(false) // Apenas categorias ativas
      
      // Console log para analisar estrutura dos dados
      console.log('=== DADOS RECEBIDOS DO BACKEND ===')
      console.log('Número de categorias:', data.length)
      console.log('Estrutura completa:', JSON.stringify(data, null, 2))
      
      // Log específico de cada categoria
      data.forEach((category, index) => {
        console.log(`\n--- Categoria ${index + 1}: ${category.name} ---`)
        console.log('ID da categoria:', category.id)
        console.log('Número de fóruns:', category.forums?.length || 0)
        
        if (category.forums) {
          category.forums.forEach((forum, forumIndex) => {
            console.log(`  Fórum ${forumIndex + 1}: ${forum.name}`)
            console.log(`    ID: ${forum.id}`)
            console.log(`    parent_forum_id: ${forum.parent_forum_id || 'null'}`)
            console.log(`    display_order: ${forum.display_order}`)
            console.log(`    Tem subforums propriedade: ${forum.subforums ? 'SIM' : 'NÃO'}`)
            if (forum.subforums) {
              console.log(`    Subforums count: ${forum.subforums.length}`)
            }
          })
        }
      })
      
      // Análise específica de relacionamentos parent/child
      console.log('\n=== ANÁLISE DE RELACIONAMENTOS ===')
      data.forEach(category => {
        const mainForums = category.forums?.filter(f => !f.parent_forum_id) || []
        const subforums = category.forums?.filter(f => f.parent_forum_id) || []
        
        console.log(`Categoria ${category.name}:`)
        console.log(`  - Fóruns principais: ${mainForums.length}`)
        console.log(`  - Subfóruns: ${subforums.length}`)
        
        if (subforums.length > 0) {
          console.log('  - Mapeamento de subfóruns:')
          subforums.forEach(sub => {
            const parent = mainForums.find(p => p.id === sub.parent_forum_id)
            console.log(`    "${sub.name}" pertence a "${parent?.name || 'PARENT NOT FOUND'}"`)
          })
        }
      })
      
      setCategories(data)
    } catch (err) {
      console.error('Erro ao carregar categorias:', err)
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Erro ao carregar fóruns')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const refetch = () => {
    fetchCategories()
  }

  return {
    categories,
    isLoading,
    error,
    refetch,
  }
}
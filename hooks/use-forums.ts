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
      setCategories(data)
    } catch (err) {
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
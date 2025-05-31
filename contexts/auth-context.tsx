"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, authApi, getStoredToken, setStoredToken, removeStoredToken, ApiError } from '@/lib/api'
import { RegisterFormData } from '@/lib/validations'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterFormData) => Promise<void>
  logout: () => void
}



const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    const verifyToken = async () => {
      const token = getStoredToken()
      
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const userData = await authApi.verify()
        setUser(userData)
      } catch (error) {
        console.error('Token inválido:', error)
        removeStoredToken()
      } finally {
        setIsLoading(false)
      }
    }

    verifyToken()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { token, user: userData } = await authApi.login({ email, password })
      
      setStoredToken(token)
      setUser(userData)
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message)
      }
      throw new Error('Erro ao fazer login')
    }
  }

  const register = async (userData: RegisterFormData) => {
    try {
      const { nickname, email, password, nome, codigo_convite } = userData
      
      const newUser = await authApi.register({
        nickname,
        email,
        password,
        nome,
        codigo_convite,
      })

      await login(email, password)
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message)
      }
      throw new Error('Erro ao criar conta')
    }
  }

  const logout = () => {
    removeStoredToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
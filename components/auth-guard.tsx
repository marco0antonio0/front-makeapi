"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative mx-auto w-12 h-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary"></div>
          </div>
          <p className="text-muted-foreground animate-pulse">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

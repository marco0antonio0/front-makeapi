"use client"

import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Code2, Zap, Shield } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push("/home")
      } else {
        router.push("/login")
      }
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="flex flex-col items-center space-y-8 animate-fade-in relative z-10">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-muted"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary border-t-transparent absolute top-0 left-0"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Code2 className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>

          <div className="text-center space-y-4 max-w-md">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="gradient-bg rounded-xl p-3 shadow-lg">
                <Code2 className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Make API
              </h2>
            </div>

            <p className="text-lg text-muted-foreground animate-pulse">
              Carregando sua experiência de desenvolvimento...
            </p>

            <div className="flex items-center justify-center space-x-6 mt-8 opacity-60">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Rápido</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Seguro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Code2 className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Simples</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

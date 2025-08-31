"use client"

import { useState, useEffect, useCallback } from "react"
import { auth, type Session } from "@/lib/auth"

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/me", { credentials: "include", cache: "no-store" })

        if (!response.ok) {
          setSession(null)
          return
        }

        const data = await response.json()

        if (data?.success && data?.user) {
          const sessao: Session = {
            user: {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
            },
          }
          setSession(sessao)
        } else {
          setSession(null)
        }
      } catch (err) {
        console.error("[v1] Auth check error:", err)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const ok = await auth.login(email, password)  
    if (!ok) {
      setSession(null)
      return null
    }

    try {
      const meRes = await fetch("/api/me", { credentials: "include", cache: "no-store" })
      if (!meRes.ok) {
        setSession(null)
        return null
      }
      const data = await meRes.json()
      if (data?.success && data?.user) {
        const novaSessao: Session = {
          user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
          },
        }
        setSession(novaSessao)
        return novaSessao
      }
    } catch (e) {
      console.error("[v1] login -> /api/me error:", e)
    }

    setSession(null)
    return null
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const ok = await auth.register(name, email, password)
    if (!ok) return null
    // Após registrar, confirme com /api/me também
    const meRes = await fetch("/api/me", { credentials: "include", cache: "no-store" })
    if (!meRes.ok) return null
    const data = await meRes.json()
    if (data?.success && data?.user) {
      const novaSessao: Session = {
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
        },
      }
      setSession(novaSessao)
      return novaSessao
    }
    return null
  }, [])

  const logout = useCallback(() => {
    auth.logout()  
    setSession(null)
  }, [])

  return {
    session,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!session,
  }
}

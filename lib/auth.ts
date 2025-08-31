export interface User {
  id: string
  email: string
  name: string
}

export interface Session {
  user: User
}

export const auth = {
  login: async (email: string, password: string): Promise<Session | null> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "*/*" },
        credentials: "include", 
        cache: "no-store",
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        return null
      }

      return await auth.getSessionAsync()
    } catch (err) {
      console.error("[auth] Login error:", err)
      return null
    }
  },

  register: async (name: string, email: string, password: string): Promise<Session | null> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        return null
      }

      return await auth.getSessionAsync()
    } catch (err) {
      console.error("[auth] Register error:", err)
      return null
    }
  },

  logout: async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (err) {
      console.error("[auth] Logout error:", err)
    }
  },

  getSessionAsync: async (): Promise<Session | null> => {
    try {
      const res = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      })
      if (!res.ok) return null

      const data = await res.json()
      if (data?.success && data?.user) {
        return { user: data.user }
      }
      return null
    } catch (err) {
      console.error("[auth] getSessionAsync error:", err)
      return null
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    const sess = await auth.getSessionAsync()
    return !!sess
  },
}

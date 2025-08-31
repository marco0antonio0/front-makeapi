"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function LoginPage() {
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const session = await login(loginData.email, loginData.password)
      if (session) {
        router.push("/home")
      } else {
        setError("Credenciais inválidas")
      }
    } catch (err) {
      setError("Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const session = await register(registerData.name, registerData.email, registerData.password)
      if (session) {
        router.push("/home")
      } else {
        setError("Erro ao criar conta")
      }
    } catch (err) {
      setError("Erro ao criar conta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl p-4 shadow-lg border">
              <Image src="/logo-makeapi.png" alt="Make API Logo" width={64} height={64} className="h-16 w-16" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Make API</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
              Crie e gerencie suas APIs de forma simples
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-white">Bem-vindo</CardTitle>
            <CardDescription className="text-center text-slate-600 dark:text-slate-400">
              Entre na sua conta ou crie uma nova
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                <TabsTrigger value="login" className="font-medium text-base h-10">
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="register" className="font-medium text-base h-10">
                  Criar Conta
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="login-email" className="font-medium text-base">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="login-password" className="font-medium text-base">
                      Senha
                    </Label>
                    <PasswordInput
                      id="login-password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                      className="h-12 text-base"
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 font-medium text-base" disabled={loading}>
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>

                <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">Contas de demonstração:</p>
                  <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                    <div className="flex justify-between items-center">
                      <span>
                        <strong>Admin:</strong>
                      </span>
                      <span className="font-mono">admin@makeapi.com / admin123</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        <strong>Dev:</strong>
                      </span>
                      <span className="font-mono">dev@makeapi.com / dev123</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="register" className="space-y-6">
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="register-name" className="font-medium text-base">
                      Nome
                    </Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Seu nome completo"
                      value={registerData.name}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="register-email" className="font-medium text-base">
                      Email
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                      required
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="register-password" className="font-medium text-base">
                      Senha
                    </Label>
                    <PasswordInput
                      id="register-password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                      required
                      className="h-12 text-base"
                    />
                  </div>

                  <Button type="submit" className="w-full h-12 font-medium text-base" disabled={loading}>
                    {loading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertDescription className="text-base">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

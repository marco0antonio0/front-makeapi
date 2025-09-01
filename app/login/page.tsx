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
import { Code2, Zap, Shield, Database, ArrowRight } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 pattern-grid"></div>
      <div className="absolute top-10 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-10 right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/5 rounded-full blur-2xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        <div className="hidden lg:block space-y-8 animate-slide-up">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="gradient-bg rounded-2xl p-4 shadow-xl">
                <Code2 className="h-12 w-12 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Make API
                </h1>
                <p className="text-xl text-muted-foreground font-medium">Gerador de APIs Inteligente</p>
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Crie, gerencie e monitore suas APIs de forma simples e eficiente. Uma plataforma completa para
              desenvolvedores modernos.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-4 rounded-xl bg-card/50 border border-border/50 hover-lift">
              <div className="bg-primary/10 rounded-lg p-2">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Desenvolvimento Rápido</h3>
                <p className="text-sm text-muted-foreground">Crie APIs funcionais em minutos, não em horas</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-xl bg-card/50 border border-border/50 hover-lift">
              <div className="bg-accent/10 rounded-lg p-2">
                <Database className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Gerenciamento Intuitivo</h3>
                <p className="text-sm text-muted-foreground">
                  Interface limpa e organizada para todos os seus endpoints
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-xl bg-card/50 border border-border/50 hover-lift">
              <div className="bg-secondary/10 rounded-lg p-2">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Segurança Avançada</h3>
                <p className="text-sm text-muted-foreground">Autenticação robusta e controle de acesso integrado</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto space-y-8 animate-slide-up">
          <div className="text-center space-y-6 lg:hidden">
            <div className="flex justify-center">
              <div className="gradient-bg rounded-2xl p-4 shadow-xl hover-lift animate-bounce-subtle">
                <Code2 className="h-16 w-16 text-primary-foreground" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Make API
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg font-medium">
                Crie e gerencie suas APIs de forma simples
              </p>
            </div>
          </div>

          <Card className="border-0 shadow-2xl glass-effect hover-lift animate-scale-in gradient-border">
            <CardHeader className="space-y-3 pb-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-center text-foreground">
                Bem-vindo de volta
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Entre na sua conta para continuar desenvolvendo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-muted/50 p-1">
                  <TabsTrigger
                    value="login"
                    className="font-medium text-sm sm:text-base h-10 transition-all duration-200 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="font-medium text-sm sm:text-base h-10 transition-all duration-200 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                    disabled={true}
                  >
                    Criar Conta
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-6 animate-fade-in">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="login-email"
                        className="font-medium text-sm sm:text-base flex items-center space-x-2"
                      >
                        <span>Email</span>
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                        required
                        className="h-12 text-sm sm:text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border/50"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="login-password" className="font-medium text-sm sm:text-base">
                        Senha
                      </Label>
                      <PasswordInput
                        id="login-password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                        required
                        className="h-12 text-sm sm:text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border/50"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 font-medium text-sm sm:text-base gradient-bg hover:opacity-90 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl group"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                          <span>Entrando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Entrar</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-6 animate-fade-in">
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="register-name" className="font-medium text-sm sm:text-base">
                        Nome
                      </Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={registerData.name}
                        onChange={(e) => setRegisterData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        className="h-12 text-sm sm:text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border/50"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="register-email" className="font-medium text-sm sm:text-base">
                        Email
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                        required
                        className="h-12 text-sm sm:text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border/50"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="register-password" className="font-medium text-sm sm:text-base">
                        Senha
                      </Label>
                      <PasswordInput
                        id="register-password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => setRegisterData((prev) => ({ ...prev, password: e.target.value }))}
                        required
                        className="h-12 text-sm sm:text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 border-border/50"
                      />
                    </div>

                    <Button type="submit" className="w-full h-12 font-medium text-sm sm:text-base" disabled={loading}>
                      {loading ? "Criando conta..." : "Criar Conta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {error && (
                <Alert variant="destructive" className="mt-6 animate-slide-up border-destructive/20 bg-destructive/5">
                  <AlertDescription className="text-sm sm:text-base">{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

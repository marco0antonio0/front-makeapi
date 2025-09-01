"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Trash2,
  Eye,
  Database,
  FileText,
  Hash,
  ImageIcon,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Copy,
  LinkIcon,
} from "lucide-react"
import Link from "next/link"
import type { Endpoint } from "@/types/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { API_CONFIG } from "@/config/api.config"

export function EndpointsList() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEndpoints()
  }, [])

  const fetchEndpoints = async () => {
    try {
      const response = await fetch("/api/endpoints")
      const result = await response.json()
      if (result.success) {
        setEndpoints(result.data)
      }
    } catch (error) {
      console.error("Error fetching endpoints:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/endpoints/${id}`, {
        method: "DELETE",
      })
      const result = await response.json()
      if (result.success) {
        setEndpoints(endpoints.filter((endpoint) => endpoint.id !== id))
      }
    } catch (error) {
      console.error("Error deleting endpoint:", error)
    }
  }

  const getFieldTypeInfo = (type: string) => {
    switch (type) {
      case "string":
        return {
          color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
          icon: <FileText className="h-3 w-3" />,
          label: "Texto",
        }
      case "number":
        return {
          color:
            "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
          icon: <Hash className="h-3 w-3" />,
          label: "Número",
        }
      case "image":
        return {
          color:
            "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
          icon: <ImageIcon className="h-3 w-3" />,
          label: "Imagem",
        }
      default:
        return {
          color: "bg-muted text-muted-foreground border-border",
          icon: <FileText className="h-3 w-3" />,
          label: "Texto",
        }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("URL copiada para a área de transferência!")
  }

  const getApiDemoUrl = (endpointId: string) => {
    const baseUrl = API_CONFIG.BASE_URL
    return `${baseUrl}/api/endpoint/${endpointId}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative mx-auto w-12 h-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-muted border-t-primary"></div>
          </div>
          <p className="text-muted-foreground animate-pulse">Carregando endpoints...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              Meus Endpoints
            </h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-transparent">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    Como usar sua API
                  </DialogTitle>
                  <DialogDescription>Guia completo para acessar e filtrar dados da sua API</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">📡 Acessando seus dados</h3>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p className="text-sm">
                        <strong>URL Base:</strong>{" "}
                        <code className="bg-background px-2 py-1 rounded text-primary">
                          GET /api/endpointsss/[endpoint-id]
                        </code>
                      </p>
                      <p className="text-sm text-muted-foreground">Substitua [endpoint-id] pelo ID do seu endpoint</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">🔍 Filtros disponíveis</h3>
                    <div className="grid gap-3">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="font-medium text-sm">Filtro por campo:</p>
                        <code className="text-xs bg-background px-2 py-1 rounded text-primary">?campo=valor</code>
                        <p className="text-xs text-muted-foreground mt-1">Ex: ?nome=João&idade=25</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="font-medium text-sm">Limite de resultados:</p>
                        <code className="text-xs bg-background px-2 py-1 rounded text-primary">?limit=10</code>
                        <p className="text-xs text-muted-foreground mt-1">Limita quantos itens retornar</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="font-medium text-sm">Ordenação:</p>
                        <code className="text-xs bg-background px-2 py-1 rounded text-primary">
                          ?sort=campo&order=asc
                        </code>
                        <p className="text-xs text-muted-foreground mt-1">order pode ser 'asc' ou 'desc'</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">💡 Exemplos práticos</h3>
                    <div className="space-y-2 text-sm">
                      <div className="bg-background p-3 rounded border">
                        <p className="font-medium">Buscar todos os dados:</p>
                        <code className="text-primary">GET /api/endpoint/abc123</code>
                      </div>
                      <div className="bg-background p-3 rounded border">
                        <p className="font-medium">Filtrar por nome:</p>
                        <code className="text-primary">GET /api/endpoint/abc123?nome=João</code>
                      </div>
                      <div className="bg-background p-3 rounded border">
                        <p className="font-medium">Limitar e ordenar:</p>
                        <code className="text-primary">GET /api/endpoint/abc123?limit=5&sort=createdAt&order=desc</code>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            {endpoints.length === 0
              ? "Nenhum endpoint criado ainda"
              : `${endpoints.length} endpoint${endpoints.length > 1 ? "s" : ""} criado${endpoints.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="gradient-bg hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg h-11 sm:h-12 text-sm sm:text-base"
        >
          <Link href="/create">
            <Plus className="mr-2 h-4 w-4" />
            Criar Endpoint
          </Link>
        </Button>
      </div>

      {endpoints.length === 0 ? (
        <Card className="border-dashed border-2 border-border hover-lift animate-scale-in">
          <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="bg-muted/50 rounded-full p-6 mb-6 animate-bounce-subtle">
              <Database className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">Nenhum endpoint encontrado</h3>
            <p className="text-muted-foreground text-center mb-8 max-w-md text-sm sm:text-base">
              Comece criando seu primeiro endpoint para gerenciar dados da sua API. É rápido e fácil de configurar!
            </p>
            <Button
              asChild
              size="lg"
              className="gradient-bg hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Link href="/create">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Endpoint
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {endpoints.map((endpoint, index) => (
            <Card
              key={endpoint.id}
              className="group hover-lift transition-all duration-300 border-border hover:border-primary/20 hover:shadow-xl animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg sm:text-xl group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {endpoint.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Layers className="h-3 w-3" />
                        <span>
                          {endpoint.campos.length} campo{endpoint.campos.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span className="hidden sm:inline">
                          {new Date(endpoint.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="sm:hidden">
                          {new Date(endpoint.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 p-3 rounded-lg border border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-1">
                      <LinkIcon className="h-3 w-3" />
                      URL da API
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(getApiDemoUrl(endpoint.id))}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-background px-2 py-1 rounded flex-1 truncate text-primary">
                      GET /api/endpoint/{endpoint.id}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs bg-transparent"
                      onClick={() => window.open(getApiDemoUrl(endpoint.id), "_blank")}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground flex items-center space-x-1">
                    <Layers className="h-4 w-4" />
                    <span>Estrutura dos Campos</span>
                  </h4>
                  <div className="space-y-2">
                    {endpoint.campos.slice(0, 3).map((campo, index) => {
                      const fieldInfo = getFieldTypeInfo(campo.tipo)
                      return (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${fieldInfo.color}`}
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {fieldInfo.icon}
                            <span className="text-sm font-medium truncate">{campo.title}</span>
                          </div>
                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <span className="text-xs">{fieldInfo.label}</span>
                            {campo.mult && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                ML
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    {endpoint.campos.length > 3 && (
                      <div className="text-center py-2">
                        <Badge variant="outline" className="bg-muted/50 text-xs">
                          +{endpoint.campos.length - 3} campo{endpoint.campos.length - 3 > 1 ? "s" : ""} adiciona
                          {endpoint.campos.length - 3 > 1 ? "is" : "l"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="flex-1 h-10 sm:h-12 text-xs sm:text-sm gradient-bg hover:opacity-90 transition-all duration-200"
                  >
                    <Link href={`/home/${endpoint.id}`}>
                      <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Gerenciar Itens</span>
                      <span className="sm:hidden">Gerenciar</span>
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 bg-transparent h-10 sm:h-12 w-10 sm:w-12 p-0 transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="animate-scale-in">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deletar Endpoint</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja deletar o endpoint "{endpoint.title}"? Esta ação não pode ser desfeita
                          e todos os itens relacionados serão removidos permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="h-10 sm:h-12">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(endpoint.id)}
                          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-10 sm:h-12"
                        >
                          Deletar Endpoint
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

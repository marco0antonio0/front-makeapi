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
import { Plus, Trash2, Eye, Database, FileText, Hash, ImageIcon, Calendar, Layers } from "lucide-react"
import Link from "next/link"
import type { Endpoint } from "@/types/api"

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
          color: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <FileText className="h-3 w-3" />,
          label: "Texto",
        }
      case "number":
        return {
          color: "bg-green-50 text-green-700 border-green-200",
          icon: <Hash className="h-3 w-3" />,
          label: "Número",
        }
      case "image":
        return {
          color: "bg-purple-50 text-purple-700 border-purple-200",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando endpoints...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Meus Endpoints</h1>
          <p className="text-muted-foreground">
            {endpoints.length === 0
              ? "Nenhum endpoint criado ainda"
              : `${endpoints.length} endpoint${endpoints.length > 1 ? "s" : ""} criado${endpoints.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <Button asChild size="lg" className="shadow-sm h-12">
          <Link href="/create">
            <Plus className="mr-2 h-4 w-4" />
            Criar Endpoint
          </Link>
        </Button>
      </div>

      {/* Endpoints Grid */}
      {endpoints.length === 0 ? (
        <Card className="border-dashed border-2 border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="bg-muted rounded-full p-6 mb-6">
              <Database className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">Nenhum endpoint encontrado</h3>
            <p className="text-muted-foreground text-center mb-8 max-w-md">
              Comece criando seu primeiro endpoint para gerenciar dados da sua API. É rápido e fácil de configurar!
            </p>
            <Button asChild size="lg" className="shadow-sm">
              <Link href="/create">
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeiro Endpoint
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {endpoints.map((endpoint) => (
            <Card
              key={endpoint.id}
              className="group hover:shadow-lg transition-all duration-200 border-border hover:border-primary/20"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {endpoint.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Layers className="h-3 w-3" />
                        <span>
                          {endpoint.campos.length} campo{endpoint.campos.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(endpoint.createdAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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
                          className={`flex items-center justify-between p-2 rounded-lg border ${fieldInfo.color}`}
                        >
                          <div className="flex items-center space-x-2">
                            {fieldInfo.icon}
                            <span className="text-sm font-medium">{campo.title}</span>
                          </div>
                          <div className="flex items-center space-x-1">
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
                        <Badge variant="outline" className="bg-muted">
                          +{endpoint.campos.length - 3} campo{endpoint.campos.length - 3 > 1 ? "s" : ""} adiciona
                          {endpoint.campos.length - 3 > 1 ? "is" : "l"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <Button variant="default" size="sm" asChild className="flex-1 mr-2 h-12">
                    <Link href={`/home/${endpoint.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Gerenciar Itens
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 bg-transparent h-12 w-12"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deletar Endpoint</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja deletar o endpoint "{endpoint.title}"? Esta ação não pode ser desfeita
                          e todos os itens relacionados serão removidos permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="h-12">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(endpoint.id)}
                          className="bg-destructive hover:bg-destructive/90 text-white h-12"
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

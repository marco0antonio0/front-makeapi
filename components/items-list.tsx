"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Edit, Trash2, ArrowLeft, Database } from "lucide-react"
import Link from "next/link"
import type { Endpoint, EndpointItem } from "@/types/api"

interface ItemsListProps {
  endpoint: Endpoint
}

export function ItemsList({ endpoint }: ItemsListProps) {
  const [items, setItems] = useState<EndpointItem[]>([])
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    fetchItems()
  }, [params.id])

  const fetchItems = async () => {
    try {
      const response = await fetch(`/api/endpoints/${params.id}/items`)
      const result = await response.json()
      if (result.success) {
        setItems(result.data)
      }
    } catch (error) {
      console.error("Error fetching items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (itemId: string) => {
    try {
      const response = await fetch(`/api/endpoints/${params.id}/items/${itemId}`, {
        method: "DELETE",
      })
      const result = await response.json()
      if (result.success) {
        setItems(items.filter((item) => item.id !== itemId))
      }
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  const handleCreateClick = () => {
    router.push(`/home/${params.id}/create`)
  }

  const renderFieldValue = (value: any, field: any) => {
    if (field.tipo === "image" && value) {
      return <img src={value || "/placeholder.svg"} alt="Item image" className="w-16 h-16 object-cover rounded-md" />
    }

    if (typeof value === "string" && value.length > 50) {
      return value.substring(0, 50) + "..."
    }

    return String(value || "")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-10">
      {/* Header Actions */}
      <div className="flex items-center justify-between px-10">
        <Button variant="outline" onClick={() => router.push("/home")} className="h-12">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar aos Endpoints
        </Button>
        <Button onClick={handleCreateClick} className="h-12">
          <Plus className="mr-2 h-4 w-4" />
          Criar Item
        </Button>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center">
            <Database className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum item encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">Comece criando o primeiro item para este endpoint.</p>
            <Button onClick={handleCreateClick}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-10">
          {items.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Item #{item.id}</CardTitle>
                  <Badge variant="secondary">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</Badge>
                </div>
                <CardDescription>Atualizado em {new Date(item.updatedAt).toLocaleDateString("pt-BR")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Fields Preview */}
                <div className="space-y-3">
                  {endpoint.campos.slice(0, 3).map((campo) => (
                    <div key={campo.title} className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground">{campo.title}:</div>
                      <div className="text-sm">{renderFieldValue(item.data[campo.title], campo)}</div>
                    </div>
                  ))}
                  {endpoint.campos.length > 3 && (
                    <div className="text-sm text-muted-foreground">+{endpoint.campos.length - 3} campos adicionais</div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <Button variant="outline" size="sm" asChild className="h-12">
                    <Link href={`/home/${params.id}/${item.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive bg-transparent h-12 w-12"
                        onClick={() => console.log("[v0] Delete button clicked for item:", item.id)}  
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deletar Item</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja deletar este item? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="h-12">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-destructive hover:bg-destructive/90 h-12 text-white"
                        >
                          Deletar
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

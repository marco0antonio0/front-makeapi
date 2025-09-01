"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ImageUpload } from "@/components/image-upload"
import { Loader2, Save, ArrowLeft, FileText, Hash, ImageIcon } from "lucide-react"
import type { Endpoint, EndpointItem } from "@/types/api"

interface ItemFormProps {
  endpoint: Endpoint
  item?: EndpointItem | Record<string, any> // <- aceita ambos
  mode: "create" | "edit"
}

export function ItemForm({ endpoint, item, mode }: ItemFormProps) {
  const params = useParams()
  const router = useRouter()

  // 1) extrai itemData: se item.data existir usa, senão usa o próprio item
  const itemData = useMemo<Record<string, any>>(() => {
    const candidate = item && typeof item === "object" && "data" in item ? (item as any).data : item
    const obj = candidate && typeof candidate === "object" ? candidate : {}
    return obj as Record<string, any>
  }, [item])

  // normalizador pra casar nomes de campos
  const norm = (s: string) =>
    String(s ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .toLowerCase()
      .trim()

  const valueForTitle = (data: Record<string, any> | undefined, title: string) => {
    if (!data) return undefined
    if (title in data) return data[title]
    const want = norm(title)
    for (const k of Object.keys(data)) if (norm(k) === want) return data[k]
    return undefined
  }

  const emptyValueFor = (tipo: string) => (tipo === "number" ? "" : "")

  // 2) monta estado inicial com base no schema do endpoint + itemData
  const initialFormData = useMemo(() => {
    const base: Record<string, any> = {}
    for (const c of endpoint.campos) {
      const v = valueForTitle(itemData, c.title)
      base[c.title] = v ?? emptyValueFor(c.tipo)
    }
    return base
  }, [endpoint.campos, itemData])

  const [formData, setFormData] = useState<Record<string, any>>(() => initialFormData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const hydratedOnce = useRef(false)

  useEffect(() => {
    setFormData(initialFormData)
  }, [initialFormData])

  // fallback extra (opcional): se itemData vier vazio em modo edit, tenta refetch local
  useEffect(() => {
    if (mode !== "edit" || Object.keys(itemData).length > 0 || hydratedOnce.current) return
    const endpointId = String(params.id)
    const itemId = String((params as any).itemId || (item as any)?.id || "")
    if (!itemId) return

    ;(async () => {
      try {
        hydratedOnce.current = true
        const res = await fetch(`/api/endpoints/${endpointId}/items/${itemId}`, { cache: "no-store" })
        const j = await res.json().catch(() => null)
        if (res.ok && j?.success && j?.data) {
          const remote = j.data
          const remoteData = remote && typeof remote === "object" && "data" in remote ? remote.data : remote
          const fresh: Record<string, any> = {}
          for (const c of endpoint.campos) fresh[c.title] = valueForTitle(remoteData, c.title) ?? emptyValueFor(c.tipo)
          setFormData(fresh)
        }
      } catch (e) {
        // noop
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, endpoint.campos, params, itemData, item])

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const endpointId = String(params.id)
      const itemId = (params as any).itemId ? String((params as any).itemId) : undefined
      const url =
        mode === "create"
          ? `/api/endpoints/${endpointId}/items`
          : `/api/endpoints/${endpointId}/items/${itemId}`
      const method = mode === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      })
      const result = await response.json().catch(() => null)

      if (result?.success) router.push(`/home/${endpointId}`)
      else setError(result?.error || `Erro ao ${mode === "create" ? "criar" : "atualizar"} item`)
    } catch (err) {
      setError(`Erro ao ${mode === "create" ? "criar" : "atualizar"} item`)
    } finally {
      setLoading(false)
    }
  }

  const renderField = (campo: any) => {
  const value = formData[campo.title] ?? emptyValueFor(campo.tipo)

  switch (campo.tipo) {
    case "string":
      if (campo.mult) {
        return (
          <Textarea
            id={campo.title}
            placeholder={`Digite ${campo.title}...`}
            value={String(value ?? "")}
            onChange={(e) => handleInputChange(campo.title, e.target.value)}
            rows={4}
            className="min-h-[100px] resize-y"
          />
        )
      }
      return (
        <Input
          id={campo.title}
          type="text"
          placeholder={`Digite ${campo.title}...`}
          value={String(value ?? "")}
          onChange={(e) => handleInputChange(campo.title, e.target.value)}
          className="h-11"
        />
      )

    case "number":
      return (
        <Input
          id={campo.title}
          type="number"
          placeholder={`Digite ${campo.title}...`}
          value={String(value ?? "")}
          onChange={(e) => {
            const v = e.target.value
            handleInputChange(campo.title, v === "" ? "" : Number.parseFloat(v))
          }}
          className="h-11"
        />
      )

    case "image":
      return (
        <ImageUpload
          value={value}
          onChange={(base64) => handleInputChange(campo.title, base64)}
        />
      )

    default:
      return null
  }
}


  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">{mode === "create" ? "Criar Novo Item" : "Editar Item"}</h1>
        <p className="text-muted-foreground">
          {mode === "create" ? "Adicione um novo item ao endpoint" : "Modifique os dados do item"} "{endpoint.title}"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="shadow-sm">
          <CardHeader className="bg-muted/30 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <div className="bg-primary/10 text-primary rounded-lg p-2">
                <FileText className="h-5 w-5" />
              </div>
              <span>Dados do Item</span>
            </CardTitle>
            <CardDescription>Preencha os campos conforme definido no endpoint "{endpoint.title}"</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-1">
              {endpoint.campos.map((campo) => (
                <div key={campo.title} className="space-y-3">
                  <Label htmlFor={campo.title} className="flex items-center space-x-2 text-sm font-medium">
                    <div className="bg-muted rounded-md p-1">
                      {campo.tipo === "string" && <FileText className="h-3 w-3" />}
                      {campo.tipo === "number" && <Hash className="h-3 w-3" />}
                      {campo.tipo === "image" && <ImageIcon className="h-3 w-3" />}
                    </div>
                    <span>{campo.title}</span>
                    <div className="flex items-center space-x-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                        {campo.tipo}
                      </span>
                      {campo.mult && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-medium">
                          múltiplas linhas
                        </span>
                      )}
                    </div>
                  </Label>
                  {renderField(campo)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="shadow-sm">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={() => router.push(`/home/${String(params.id)}`)} className="px-6 h-12">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button type="submit" disabled={loading} className="px-6 shadow-sm h-12">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Criando..." : "Salvando..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {mode === "create" ? "Criar Item" : "Salvar Alterações"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

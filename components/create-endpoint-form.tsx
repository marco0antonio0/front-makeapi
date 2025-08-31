"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2, Loader2, Save, GripVertical, Database } from "lucide-react"
import type { EndpointField } from "@/types/api"

interface FormField extends EndpointField {
  id: string
}

export function CreateEndpointForm() {
  const [title, setTitle] = useState("")
  const [fields, setFields] = useState<FormField[]>([{ id: "1", title: "", tipo: "string", mult: false }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      title: "",
      tipo: "string",
      mult: false,
    }
    setFields([...fields, newField])
  }

  const removeField = (id: string) => {
    if (fields.length > 1) {
      setFields(fields.filter((field) => field.id !== id))
    }
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Título do endpoint é obrigatório")
      return
    }

    const validFields = fields.filter((field) => field.title.trim())
    if (validFields.length === 0) {
      setError("Pelo menos um campo é obrigatório")
      return
    }

    const fieldNames = validFields.map((field) => field.title.toLowerCase())
    const duplicates = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index)
    if (duplicates.length > 0) {
      setError("Nomes de campos não podem ser duplicados")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/endpoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          campos: validFields.map(({ id, ...field }) => field),
        }),
      })

      const result = await response.json()

      if (result.success) {
        router.push("/home")
      } else {
        setError(result.error || "Erro ao criar endpoint")
      }
    } catch (err) {
      setError("Erro ao criar endpoint")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Criar Novo Endpoint</h1>
        <p className="text-muted-foreground">Configure os campos e estrutura do seu endpoint de API</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="shadow-sm">
          <CardHeader className="bg-muted/30 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <span>Informações do Endpoint</span>
            </CardTitle>
            <CardDescription>Defina o nome e identificação do seu endpoint</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Título do Endpoint
              </Label>
              <Input
                id="title"
                placeholder="Ex: Produtos, Usuários, Posts..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 text-base"
                required
              />
              <p className="text-xs text-muted-foreground">Este será o nome do seu endpoint na API</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/30 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <GripVertical className="h-5 w-5 text-primary" />
                  <span>Campos do Endpoint</span>
                </CardTitle>
                <CardDescription>Configure os campos que cada item deste endpoint terá</CardDescription>
              </div>
              <Button type="button" onClick={addField} className="shadow-sm h-12">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Campo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="group relative p-6 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors bg-card"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-foreground">Campo {index + 1}</h4>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeField(field.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Nome do Campo */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Nome do Campo</Label>
                      <Input
                        placeholder="Ex: nome, email, preco..."
                        value={field.title}
                        onChange={(e) => updateField(field.id, { title: e.target.value })}
                        className="h-11"
                      />
                    </div>

                    {/* Tipo do Campo */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Tipo de Dados</Label>
                      <Select
                        value={field.tipo}
                        onValueChange={(value: "string" | "number" | "image") => updateField(field.id, { tipo: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">📝 Texto (String)</SelectItem>
                          <SelectItem value="number">🔢 Número</SelectItem>
                          <SelectItem value="image">🖼️ Imagem</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Múltiplas Linhas */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Formato do Campo</Label>
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{field.mult ? "Múltiplas Linhas" : "Linha Única"}</span>
                          <span className="text-xs text-muted-foreground">
                            {field.mult ? "Textarea para textos longos" : "Input simples"}
                          </span>
                        </div>
                        <Switch
                          checked={field.mult}
                          onCheckedChange={(checked) => updateField(field.id, { mult: checked })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Preview:</strong> {field.title || "nome_do_campo"}
                      <span className="inline-flex items-center ml-2 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                        {field.tipo}
                      </span>
                      {field.mult && (
                        <span className="inline-flex items-center ml-1 px-2 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-medium">
                          múltiplas linhas
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="shadow-sm">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={() => router.push("/home")} className="px-6 h-12">
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="px-6 shadow-sm h-12">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Criar Endpoint
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

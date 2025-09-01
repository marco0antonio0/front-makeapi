"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ItemForm } from "@/components/item-form"
import type { Endpoint, EndpointItem } from "@/types/api"

function pickObject<T = any>(raw: any): T | null {
  if (!raw) return null
  if (raw?.data && typeof raw.data === "object") return raw.data as T
  if (typeof raw === "object") return raw as T
  return null
}

export default function EditItemPage() {
  const params = useParams()
  const [endpoint, setEndpoint] = useState<Endpoint | null>(null)
  const [item, setItem] = useState<EndpointItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // evita rodar sem ids
    if (!params?.id || !params?.itemId) return
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id, params?.itemId])

  const fetchData = async () => {
  try {
    const epRes = await fetch(`/api/endpoints/${params.id}`)
    const itRes = await fetch(`/api/endpoints/${params.id}/items/${params.itemId}`)
    console.log("[EditItemPage] epRes:", epRes)
    console.log("[EditItemPage] itRes:", itRes)

    const epJson = await epRes.json()
    const itJson = await itRes.json()
    console.log("[EditItemPage] epJson:", epJson)
    console.log("[EditItemPage] itJson:", itJson)

    if (epJson?.success) setEndpoint(epJson.data as Endpoint)

    if (itJson?.success) {
      const raw = itJson.data
      // Se já vier como { data: {...} }, mantém; se vier só {...}, embrulha num pseudo-Item
      const normalized =
        raw && typeof raw === "object" && "data" in raw
          ? raw
          : {
              id: String(params.itemId),
              endpointId: String(params.id),
              data: raw ?? {},
              createdAt: "",
              updatedAt: "",
            }
      setItem(normalized)
    }
  } catch (error) {
    console.error("Error fetching data:", error)
  } finally {
    setLoading(false)
  }
}


  if (loading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Carregando item...</p>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  if (!endpoint || !item) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-6 max-w-md">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center">
                <svg className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Item não encontrado</h1>
                <p className="text-slate-600 dark:text-slate-400">O item solicitado não existe ou foi removido.</p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Endpoint</span><span>/</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">{endpoint.title}</span>
              <span>/</span><span>Editar Item</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Editar Item</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Edite o item do endpoint <span className="font-semibold text-slate-900 dark:text-white">"{endpoint.title}"</span>
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            <ItemForm endpoint={endpoint} item={item} mode="edit" />
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}

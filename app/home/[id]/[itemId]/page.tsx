"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ItemForm } from "@/components/item-form"
import type { Endpoint, EndpointItem } from "@/types/api"

export default function EditItemPage() {
  const params = useParams()
  const [endpoint, setEndpoint] = useState<Endpoint | null>(null)
  const [item, setItem] = useState<EndpointItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [params.id, params.itemId])

  const fetchData = async () => {
    try {
      const [endpointResponse, itemResponse] = await Promise.all([
        fetch(`/api/endpoints/${params.id}`),
        fetch(`/api/endpoints/${params.id}/items/${params.itemId}`),
      ])

      const [endpointResult, itemResult] = await Promise.all([endpointResponse.json(), itemResponse.json()])

      if (endpointResult.success) {
        setEndpoint(endpointResult.data)
      }

      if (itemResult.success) {
        setItem(itemResult.data)
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
                <svg
                  className="h-10 w-10 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
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
              <span>Endpoint</span>
              <span>/</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">{endpoint.title}</span>
              <span>/</span>
              <span>Editar Item</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Editar Item</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Edite o item do endpoint{" "}
              <span className="font-semibold text-slate-900 dark:text-white">"{endpoint.title}"</span>
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

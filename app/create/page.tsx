"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateEndpointForm } from "@/components/create-endpoint-form"

export default function CreateEndpointPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Criar Endpoint</h1>
            <p className="text-muted-foreground">Configure um novo endpoint para sua API</p>
          </div>
          <CreateEndpointForm />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}

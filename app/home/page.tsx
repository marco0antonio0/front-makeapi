"use client"

import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EndpointsList } from "@/components/endpoints-list"

export default function HomePage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Endpoints</h1>
              <p className="text-muted-foreground">Gerencie seus endpoints de API</p>
            </div>
          </div>
          <EndpointsList />
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}

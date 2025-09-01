// app/api/endpoints/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse, Endpoint, EndpointItem } from "@/types/api"
import { API_CONFIG } from "@/config/api.config"

const API_BASE =
  API_CONFIG.BASE_URL
// Se não tiver esses tipos no seu projeto, mantemos locais:
type Item = EndpointItem | {
  id: string
  endpointId: string
  data: Record<string, any>
  createdAt: string
  updatedAt: string
}
type EndpointWithItems = Endpoint & { items: Item[] }

function pickObject<T = any>(raw: any): T {
  // aceita { data: {...} } ou objeto direto
  if (raw?.data && (typeof raw.data === "object" || Array.isArray(raw.data))) return raw.data as T
  return raw as T
}
function pickArray<T = any>(raw: any): T[] {
  // aceita { data: [...] } ou array direto
  if (raw?.data && Array.isArray(raw.data)) return raw.data as T[]
  if (Array.isArray(raw)) return raw as T[]
  return []
}
async function safeJson(res: Response) {
  try {
    return await res.json()
  } catch {
    return null
  }
}

type P = { id: string }

// GET /api/endpoints/[id]
export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<P> }, // 👈 params agora é Promise
): Promise<NextResponse<ApiResponse<EndpointWithItems>>> {
  try {
    const { id } = await ctx.params // 👈 aguarda antes de usar

    // 1) Busca o endpoint
    const upstream = await fetch(`${API_BASE}/api/endpoint/${id}`, {
      method: "GET",
      headers: { accept: "application/json" },
      cache: "no-store",
    })
    const raw = await safeJson(upstream)
    if (!upstream.ok) {
      const message = raw?.message || "Falha ao buscar endpoint na API"
      const status = upstream.status || 502
      return NextResponse.json({ success: false, error: message }, { status })
    }

    const base = pickObject<Endpoint & Partial<{ items: Item[] }>>(raw)

    // 2) Garante items sempre como array
    let items: Item[] = Array.isArray((base as any).items) ? (base as any).items! : []

    // 3) Se não veio items embutido, busca por endpointId
    if (items.length === 0) {
      const itRes = await fetch(`${API_BASE}/api/itens/query`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters: [{ field: "endpointId", op: "==", value: id }],
          limit: 200,
        }),
        cache: "no-store",
      })
      const itRaw = await safeJson(itRes)
      if (itRes.ok) items = pickArray<Item>(itRaw)
    }

    return NextResponse.json({
      success: true,
      data: { ...(base as Endpoint), items },
    })
  } catch (error) {
    console.error("[endpoint/:id GET] error:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno ao buscar endpoint" },
      { status: 500 },
    )
  }
}

// PUT /api/endpoints/[id]
export async function PUT(
  request: NextRequest,
  ctx: { params: Promise<P> },
): Promise<NextResponse<ApiResponse<Endpoint>>> {
  try {
    const { id } = await ctx.params
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Não autenticado (cookie auth-token ausente)" },
        { status: 401 },
      )
    }

    const body = await request.json().catch(() => ({}))
    const upstream = await fetch(`${API_BASE}/api/endpoint/${id}`, {
      method: "PUT", // troque para "PATCH" se a sua API usar PATCH
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    const raw = await safeJson(upstream)
    if (!upstream.ok) {
      const message = raw?.message || "Falha ao atualizar endpoint na API"
      return NextResponse.json(
        { success: false, error: message },
        { status: upstream.status || 502 },
      )
    }

    const updated = pickObject<Endpoint>(raw)
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("[endpoint/:id PUT] error:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno ao atualizar endpoint" },
      { status: 500 },
    )
  }
}

// DELETE /api/endpoints/[id]
export async function DELETE(
  request: NextRequest,
  ctx: { params: Promise<P> },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = await ctx.params
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Não autenticado (cookie auth-token ausente)" },
        { status: 401 },
      )
    }

    const upstream = await fetch(`${API_BASE}/api/endpoint/${id}`, {
      method: "DELETE",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    const raw = await safeJson(upstream)
    if (!upstream.ok) {
      const message = raw?.message || "Falha ao excluir endpoint na API"
      return NextResponse.json(
        { success: false, error: message },
        { status: upstream.status || 502 },
      )
    }

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    console.error("[endpoint/:id DELETE] error:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno ao excluir endpoint" },
      { status: 500 },
    )
  }
}

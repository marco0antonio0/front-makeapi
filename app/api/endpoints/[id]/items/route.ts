import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse, EndpointItem } from "@/types/api"
import { API_CONFIG } from "@/config/api.config"

const API_BASE =
  API_CONFIG.BASE_URL

function pickArray<T = any>(raw: any): T[] {
  if (raw?.data && Array.isArray(raw.data)) return raw.data as T[]
  if (Array.isArray(raw)) return raw as T[]
  return []
}

function pickObject<T = any>(raw: any): T {
  if (raw?.data && typeof raw.data === "object") return raw.data as T
  return raw as T
}

async function safeJson(res: Response) {
  try {
    return await res.json()
  } catch {
    return null
  }
}

/**
 * GET /api/endpoint/[id]/items
 * Lista todos os itens pertencentes ao endpoint [id]
 * -> Upstream: POST {API_BASE}/api/itens/query  { filters:[{field:'endpointId', op:'==', value:id}], limit:200 }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<EndpointItem[]>>> {
  try {
    const token = request.cookies.get("auth-token")?.value

    const upstream = await fetch(`${API_BASE}/api/itens/query`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        filters: [{ field: "endpointId", op: "==", value: params.id }],
        limit: 200,
      }),
      cache: "no-store",
    })

    const raw = await safeJson(upstream)

    if (!upstream.ok) {
      const message = raw?.message || "Falha ao buscar itens na API"
      const status = upstream.status || 502
      return NextResponse.json({ success: false, error: message }, { status })
    }

    const items = pickArray<EndpointItem>(raw)
    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    console.error("[endpoint/[id]/items GET] error:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno ao listar itens" },
      { status: 500 },
    )
  }
}

/**
 * POST /api/endpoint/[id]/items
 * Cria um item no endpoint [id]
 * Body esperado: { data: Record<string, any> }
 * -> Upstream: POST {API_BASE}/api/itens  { endpointId: id, values: data } (com Bearer)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<EndpointItem>>> {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Não autenticado (cookie auth-token ausente)" },
        { status: 401 },
      )
    }

    const body = await request.json().catch(() => ({} as any))
    const { data } = body || {}

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { success: false, error: "Campo 'data' é obrigatório" },
        { status: 400 },
      )
    }

    // mapeia para o payload do upstream (values)
    const upstream = await fetch(`${API_BASE}/api/itens`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpointId: params.id,
        values: data,
      }),
      cache: "no-store",
    })

    const raw = await safeJson(upstream)

    if (!upstream.ok) {
      const message = raw?.message || "Falha ao criar item na API"
      const status = upstream.status || 502
      return NextResponse.json({ success: false, error: message }, { status })
    }

    const created = pickObject<EndpointItem>(raw)
    return NextResponse.json({ success: true, data: created })
  } catch (error) {
    console.error("[endpoint/[id]/items POST] error:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno ao criar item" },
      { status: 500 },
    )
  }
}

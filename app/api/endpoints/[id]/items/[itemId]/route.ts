// app/api/endpoints/[id]/items/[itemId]/route.ts
import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse, EndpointItem } from "@/types/api"

const API_BASE =
  process.env.MAKEAPI_BASE_URL /* server-only */ ||
  "https://api-makeapi.netlify.app"

type P = { id: string; itemId: string }

async function safeJson(res: Response) {
  try {
    return await res.json()
  } catch {
    return null
  }
}
function pickObject<T = any>(raw: any): T {
  if (raw?.data && (typeof raw.data === "object" || Array.isArray(raw.data))) return raw.data as T
  return raw as T
}

// GET /api/endpoints/[id]/items/[itemId]  ->  GET /api/itens/:itemId
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<P> },
): Promise<NextResponse<ApiResponse<EndpointItem>>> {
  try {
    const { id, itemId } = await ctx.params

    const upstream = await fetch(`${API_BASE}/api/itens/${itemId}`, {
      method: "GET",
      headers: { accept: "application/json" },
      cache: "no-store",
    })

    const raw = await safeJson(upstream)
    if (!upstream.ok) {
      const message = raw?.message || "Falha ao buscar item na API"
      return NextResponse.json({ success: false, error: message }, { status: upstream.status || 502 })
    }

    const item = pickObject<EndpointItem>(raw)

    // garante que o item pertence ao endpoint da rota
    if (item?.endpointId && item.endpointId !== id) {
      return NextResponse.json(
        { success: false, error: "Item não pertence a este endpoint" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    console.error("[endpoints/:id/items/:itemId GET] error:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao buscar item" }, { status: 500 })
  }
}

// PUT /api/endpoints/[id]/items/[itemId]
// Encaminha como PATCH para a API externa: PATCH /api/itens/:itemId  { values: {...} }
export async function PUT(
  request: NextRequest,
  ctx: { params: Promise<P> },
): Promise<NextResponse<ApiResponse<EndpointItem>>> {
  try {
    const { id, itemId } = await ctx.params
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Não autenticado (cookie auth-token ausente)" },
        { status: 401 },
      )
    }

    const body = await request.json().catch(() => ({} as any))
    // aceita { values: {...} } ou { data: {...} } e converte para values
    const values = body?.values ?? body?.data
    if (!values || typeof values !== "object") {
      return NextResponse.json(
        { success: false, error: "Body inválido: envie { values: { ... } }" },
        { status: 400 },
      )
    }

    const upstream = await fetch(`${API_BASE}/api/itens/${itemId}`, {
      method: "PATCH", // a API de itens usa PATCH
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ values }),
      cache: "no-store",
    })

    const raw = await safeJson(upstream)
    if (!upstream.ok) {
      const message = raw?.message || "Falha ao atualizar item na API"
      return NextResponse.json(
        { success: false, error: message },
        { status: upstream.status || 502 },
      )
    }

    const updated = pickObject<EndpointItem>(raw)
    if (updated?.endpointId && updated.endpointId !== id) {
      return NextResponse.json(
        { success: false, error: "Item não pertence a este endpoint" },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error("[endpoints/:id/items/:itemId PUT] error:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao atualizar item" }, { status: 500 })
  }
}

// DELETE /api/endpoints/[id]/items/[itemId]  ->  DELETE /api/itens/:itemId
export async function DELETE(
  request: NextRequest,
  ctx: { params: Promise<P> },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { itemId } = await ctx.params
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Não autenticado (cookie auth-token ausente)" },
        { status: 401 },
      )
    }

    const upstream = await fetch(`${API_BASE}/api/itens/${itemId}`, {
      method: "DELETE",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    const raw = await safeJson(upstream)
    if (!upstream.ok) {
      const message = raw?.message || "Falha ao excluir item na API"
      return NextResponse.json(
        { success: false, error: message },
        { status: upstream.status || 502 },
      )
    }

    return NextResponse.json({ success: true, data: null })
  } catch (error) {
    console.error("[endpoints/:id/items/:itemId DELETE] error:", error)
    return NextResponse.json({ success: false, error: "Erro interno ao excluir item" }, { status: 500 })
  }
}

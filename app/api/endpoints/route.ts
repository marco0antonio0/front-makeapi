import { type NextRequest, NextResponse } from "next/server"
import type { ApiResponse, Endpoint } from "@/types/api"
import { API_CONFIG } from "@/config/api.config"

// Você pode sobrescrever via env se quiser
const API_BASE =
  API_CONFIG.BASE_URL

function pickArray<T = any>(raw: any): T[] {
  if (Array.isArray(raw?.data)) return raw.data as T[]
  if (Array.isArray(raw)) return raw as T[]
  return []
}

function pickObject<T = any>(raw: any): T {
  if (raw?.data && typeof raw.data === "object") return raw.data as T
  return raw as T
}

export async function GET(): Promise<NextResponse<ApiResponse<Endpoint[]>>> {
  try {
    const upstream = await fetch(`${API_BASE}/api/endpoint`, {
      method: "GET",
      headers: { accept: "application/json" },
      cache: "no-store",
    })

    const raw = await upstream.json().catch(() => null)

    if (!upstream.ok) {
      const message = raw?.message || "Falha ao buscar endpoints na API"
      return NextResponse.json(
        { success: false, error: message },
        { status: upstream.status || 502 },
      )
    }

    const endpoints = pickArray<Endpoint>(raw)
    return NextResponse.json({ success: true, data: endpoints })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro interno ao buscar endpoints" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest): Promise<
  NextResponse<ApiResponse<Endpoint>>
> {
  try {
    const body = await request.json().catch(() => ({}))
    const { title, campos } = body ?? {}

    if (!title || !Array.isArray(campos)) {
      return NextResponse.json(
        { success: false, error: "Title e campos são obrigatórios" },
        { status: 400 },
      )
    }

    // Pega o token do cookie httpOnly setado no login
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Não autenticado (cookie auth-token ausente)" },
        { status: 401 },
      )
    }

    // Encaminha para a API externa
    const upstream = await fetch(`${API_BASE}/api/endpoint`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, campos }),
      cache: "no-store",
    })

    const raw = await upstream.json().catch(() => null)

    if (!upstream.ok) {
      const message = raw?.message || "Falha ao criar endpoint na API"
      return NextResponse.json(
        { success: false, error: message },
        { status: upstream.status || 502 },
      )
    }

    const created = pickObject<Endpoint>(raw)
    return NextResponse.json({ success: true, data: created })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro interno ao criar endpoint" },
      { status: 500 },
    )
  }
}

import { API_CONFIG } from "@/config/api.config"
import { type NextRequest, NextResponse } from "next/server"

interface MeResponse {
  success: boolean
  user?: {
    id: string
    email: string
    name: string
  }
  message?: string
}

const API_BASE_URL =
  API_CONFIG.BASE_URL 

function getTokenFromCookie(request: NextRequest): string | null {
  const cookieHeader = request.headers.get("cookie")
  if (!cookieHeader) return null
  for (const raw of cookieHeader.split(";")) {
    const [name, value] = raw.trim().split("=")
    if (name === "auth-token") return value
  }
  return null
}

function deriveNameFromEmail(email: string): string {
  const local = email?.split("@")[0] ?? ""
  if (!local) return "Usuário"
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ") || "Usuário"
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromCookie(request)
    if (!token) {
      return NextResponse.json<MeResponse>(
        { success: false, message: "Token de autenticação não encontrado" },
        { status: 401 }
      )
    }

    const incoming = new URL(request.url)
    const target = new URL("/api/auth/me", API_BASE_URL)
    if (incoming.origin === target.origin && incoming.pathname === target.pathname) {
      return NextResponse.json<MeResponse>(
        { success: false, message: "Configuração inválida de API_BASE_URL (loop detectado)" },
        { status: 500 }
      )
    }

    const apiRes = await fetch(target.toString(), {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    let payload: any
    try {
      payload = await apiRes.json()
    } catch {
      return NextResponse.json<MeResponse>(
        { success: false, message: "Resposta inválida da API de autenticação" },
        { status: 502 }
      )
    }

    if (!apiRes.ok) {
      const status = payload?.status ?? apiRes.status
      const message = payload?.message ?? "Falha ao obter usuário autenticado"
      return NextResponse.json<MeResponse>({ success: false, message }, { status })
    }

    const { idUser, email } = payload ?? {}
    if (!idUser || !email) {
      return NextResponse.json<MeResponse>(
        { success: false, message: "Resposta da API não contém idUser/email" },
        { status: 502 }
      )
    }

    const response: MeResponse = {
      success: true,
      user: {
        id: idUser,
        email,
        name: deriveNameFromEmail(email),
      },
    }

    return NextResponse.json(response, { status: 200 })
  } catch (err) {
    console.error("[/api/me] error:", err)
    return NextResponse.json<MeResponse>(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"

type LoginRequest = { email: string; password: string }
type ApiSuccess = { access_token: string; status: number; id: string }
type ApiError = { message?: string; status?: number } & Record<string, any>

const API_BASE_URL =
  process.env.MAKEAPI_BASE_URL   ||
  "https://makeapi.netlify.app" 

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginRequest
    const { email, password } = body ?? {}

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    const incomingUrl = new URL(request.url)
    const target = new URL("/api/auth/login", API_BASE_URL)
    if (incomingUrl.origin === target.origin && incomingUrl.pathname === target.pathname) {
      return NextResponse.json(
        {
          message:
            "Configuração inválida: MAKEAPI_BASE_URL aponta para o mesmo endpoint. Use um domínio/base diferente para evitar loop.",
        },
        { status: 500 }
      )
    }

    const apiRes = await fetch(target.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "*/*",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    })

    let data: ApiSuccess | ApiError
    try {
      data = (await apiRes.json()) as any
    } catch {
      return NextResponse.json(
        { message: "Resposta inválida da API de autenticação." },
        { status: 502 }
      )
    }

    if (!apiRes.ok) {
      const status = (data as ApiError).status ?? apiRes.status
      const message =
        (data as ApiError).message || "Falha na autenticação (API)."
      return NextResponse.json({ message, status }, { status })
    }

    const { access_token, status, id } = data as ApiSuccess
    if (!access_token || !id) {
      return NextResponse.json(
        { message: "Resposta da API não contém access_token/id." },
        { status: 502 }
      )
    }

    const resJson = { access_token, status: status ?? 200, id }
    const res = NextResponse.json(resJson, { status: 200 })

    res.cookies.set("auth-token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    })

    return res
  } catch (err) {
    console.error("[login] error:", err)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

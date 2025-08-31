import { type NextRequest, NextResponse } from "next/server"

interface RegisterRequest {
  name: string
  email: string
  password: string
}

interface RegisterResponse {
  success: boolean
  user?: {
    id: string
    email: string
    name: string
  }
  token?: string
  message?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: "Senha deve ter pelo menos 6 caracteres" }, { status: 400 })
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
    }

    const token = `mock-jwt-${newUser.id}-${Date.now()}`

    const response: RegisterResponse = {
      success: true,
      user: newUser,
      token,
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno do servidor" }, { status: 500 })
  }
}

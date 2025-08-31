import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-data"
import type { ApiResponse, Endpoint } from "@/types/api"

export async function GET(): Promise<NextResponse<ApiResponse<Endpoint[]>>> {
  try {
    const endpoints = db.endpoints.findAll()
    return NextResponse.json({
      success: true,
      data: endpoints,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch endpoints",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Endpoint>>> {
  try {
    const body = await request.json()
    const { title, campos } = body

    if (!title || !campos || !Array.isArray(campos)) {
      return NextResponse.json(
        {
          success: false,
          error: "Title and campos are required",
        },
        { status: 400 },
      )
    }

    const newEndpoint = db.endpoints.create({ title, campos })

    return NextResponse.json({
      success: true,
      data: newEndpoint,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create endpoint",
      },
      { status: 500 },
    )
  }
}

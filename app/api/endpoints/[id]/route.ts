import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-data"
import type { ApiResponse, Endpoint } from "@/types/api"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Endpoint>>> {
  try {
    const endpoint = db.endpoints.findById(params.id)
    if (!endpoint) {
      return NextResponse.json(
        {
          success: false,
          error: "Endpoint not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: endpoint,
    })
  } catch (error) {
    console.error("[v0] API: Error in GET endpoint:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch endpoint",
      },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<Endpoint>>> {
  try {
    const body = await request.json()
    const updatedEndpoint = db.endpoints.update(params.id, body)

    if (!updatedEndpoint) {
      return NextResponse.json(
        {
          success: false,
          error: "Endpoint not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedEndpoint,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update endpoint",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const deleted = db.endpoints.delete(params.id)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Endpoint not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: null,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete endpoint",
      },
      { status: 500 },
    )
  }
}

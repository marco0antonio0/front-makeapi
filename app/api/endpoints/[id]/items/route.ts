import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-data"
import type { ApiResponse, EndpointItem } from "@/types/api"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<EndpointItem[]>>> {
  try {
    const items = db.items.findByEndpointId(params.id)

    return NextResponse.json({
      success: true,
      data: items,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch items",
      },
      { status: 500 },
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse<ApiResponse<EndpointItem>>> {
  try {
    const body = await request.json()
    const { data } = body

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: "Data is required",
        },
        { status: 400 },
      )
    }

    // Verify endpoint exists
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

    const newItem = db.items.create({
      endpointId: params.id,
      data,
    })

    return NextResponse.json({
      success: true,
      data: newItem,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create item",
      },
      { status: 500 },
    )
  }
}

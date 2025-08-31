import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-data"
import type { ApiResponse, EndpointItem } from "@/types/api"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } },
): Promise<NextResponse<ApiResponse<EndpointItem>>> {
  try {
    const item = db.items.findById(params.itemId)

    if (!item || item.endpointId !== params.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Item not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: item,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch item",
      },
      { status: 500 },
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } },
): Promise<NextResponse<ApiResponse<EndpointItem>>> {
  try {
    const body = await request.json()
    const updatedItem = db.items.update(params.itemId, body)

    if (!updatedItem || updatedItem.endpointId !== params.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Item not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedItem,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update item",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } },
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const item = db.items.findById(params.itemId)

    if (!item || item.endpointId !== params.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Item not found",
        },
        { status: 404 },
      )
    }

    const deleted = db.items.delete(params.itemId)

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete item",
        },
        { status: 500 },
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
        error: "Failed to delete item",
      },
      { status: 500 },
    )
  }
}

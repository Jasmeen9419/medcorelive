import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { trackingNumber: string } }) {
  try {
    const deliveries = db.getDeliveries()
    const delivery = deliveries.find((d) => d.trackingNumber === params.trackingNumber)

    if (!delivery) {
      return NextResponse.json({ error: "Tracking number not found" }, { status: 404 })
    }

    return NextResponse.json({ delivery })
  } catch (error) {
    return NextResponse.json({ error: "Failed to track delivery" }, { status: 500 })
  }
}

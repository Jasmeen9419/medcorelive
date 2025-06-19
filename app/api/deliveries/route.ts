import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pharmacy = searchParams.get("pharmacy")

  try {
    const deliveries = pharmacy ? db.getDeliveriesByPharmacy(pharmacy) : db.getDeliveries()

    return NextResponse.json({ deliveries })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch deliveries" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const delivery = db.addDelivery(body)

    return NextResponse.json({ delivery }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create delivery" }, { status: 500 })
  }
}

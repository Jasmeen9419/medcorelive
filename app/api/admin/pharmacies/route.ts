import { NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const pharmacies = db.getPharmacies().map(({ password, ...pharmacy }) => pharmacy)
    return NextResponse.json({ pharmacies })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pharmacies" }, { status: 500 })
  }
}

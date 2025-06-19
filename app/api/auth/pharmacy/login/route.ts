import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const pharmacy = await db.verifyPharmacyLogin(email, password)

    if (!pharmacy) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Return success without sensitive data
    const { password: _, ...safePharmacy } = pharmacy
    return NextResponse.json({
      message: "Login successful",
      pharmacy: safePharmacy,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

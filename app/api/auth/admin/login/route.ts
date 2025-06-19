import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const admin = await db.verifyAdminLogin(email, password)

    if (!admin) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 })
    }

    // Return success without sensitive data
    const { password: _, ...safeAdmin } = admin
    return NextResponse.json({
      message: "Admin login successful",
      admin: safeAdmin,
    })
  } catch (error) {
    return NextResponse.json({ error: "Admin login failed" }, { status: 500 })
  }
}

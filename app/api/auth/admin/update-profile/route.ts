import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adminId, name, email } = body

    console.log(`🔄 ADMIN PROFILE UPDATE: ${adminId}`)

    if (!adminId || !name || !email) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const admin = await db.getAdminByEmail("kaurjassu1632@gmail.com")
    if (!admin || admin.id !== adminId) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    // Update admin profile
    admin.name = name
    admin.email = email

    console.log("✅ ADMIN PROFILE UPDATED SUCCESSFULLY")

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("❌ ADMIN PROFILE UPDATE ERROR:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

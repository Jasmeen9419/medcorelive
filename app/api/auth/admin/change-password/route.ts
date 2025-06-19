import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { verifyPassword, hashPassword, isStrongPassword } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adminId, currentPassword, newPassword, confirmPassword } = body

    console.log(`🔐 ADMIN PASSWORD CHANGE ATTEMPT: ${adminId}`)

    if (!adminId || !currentPassword || !newPassword || !confirmPassword) {
      console.error("❌ Missing required fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      console.error("❌ New passwords don't match")
      return NextResponse.json({ error: "New passwords do not match" }, { status: 400 })
    }

    if (!isStrongPassword(newPassword)) {
      console.error("❌ Weak new password")
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
        },
        { status: 400 },
      )
    }

    const admin = await db.getAdminByEmail("kaurjassu1632@gmail.com")
    if (!admin || admin.id !== adminId) {
      console.error("❌ Admin not found")
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    console.log(`🔍 Verifying current password for admin: ${admin.email}`)
    const isCurrentPasswordValid = await verifyPassword(currentPassword, admin.password)
    if (!isCurrentPasswordValid) {
      console.error("❌ Current password is incorrect")
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    console.log("✅ Current password verified, updating to new password...")
    const hashedNewPassword = await hashPassword(newPassword)
    admin.password = hashedNewPassword

    console.log("✅ ADMIN PASSWORD CHANGED SUCCESSFULLY")

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("❌ ADMIN PASSWORD CHANGE ERROR:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}

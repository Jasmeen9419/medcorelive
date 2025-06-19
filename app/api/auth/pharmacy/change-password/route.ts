import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { verifyPassword, hashPassword, isStrongPassword } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pharmacyId, currentPassword, newPassword, confirmPassword } = body

    console.log(`🔐 PHARMACY PASSWORD CHANGE ATTEMPT: ${pharmacyId}`)

    if (!pharmacyId || !currentPassword || !newPassword || !confirmPassword) {
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

    const pharmacy = db.getPharmacyById(pharmacyId)
    if (!pharmacy) {
      console.error("❌ Pharmacy not found")
      return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 })
    }

    console.log(`🔍 Verifying current password for: ${pharmacy.email}`)
    const isCurrentPasswordValid = await verifyPassword(currentPassword, pharmacy.password)
    if (!isCurrentPasswordValid) {
      console.error("❌ Current password is incorrect")
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    console.log("✅ Current password verified, updating to new password...")
    const hashedNewPassword = await hashPassword(newPassword)
    const updatedPharmacy = db.updatePharmacy(pharmacyId, { password: hashedNewPassword })

    if (!updatedPharmacy) {
      console.error("❌ Failed to update password in database")
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
    }

    console.log("✅ PHARMACY PASSWORD CHANGED SUCCESSFULLY")

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    })
  } catch (error) {
    console.error("❌ PASSWORD CHANGE ERROR:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}

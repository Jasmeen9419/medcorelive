import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pharmacyId, name, email, phone, address, contactName, position, licenseNumber } = body

    console.log(`🔄 PHARMACY PROFILE UPDATE: ${pharmacyId}`)

    if (!pharmacyId || !name || !email || !phone || !address || !contactName || !position || !licenseNumber) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const updatedPharmacy = db.updatePharmacy(pharmacyId, {
      name,
      email,
      phone,
      address,
      contactName,
      position,
      licenseNumber,
    })

    if (!updatedPharmacy) {
      return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 })
    }

    console.log("✅ PHARMACY PROFILE UPDATED SUCCESSFULLY")

    const { password: _, ...safePharmacy } = updatedPharmacy
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      pharmacy: safePharmacy,
    })
  } catch (error) {
    console.error("❌ PHARMACY PROFILE UPDATE ERROR:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

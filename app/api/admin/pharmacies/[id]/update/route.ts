import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, email, phone, address, contactName, position, licenseNumber } = body

    console.log(`🔄 ADMIN UPDATING PHARMACY: ${params.id}`)

    if (!name || !email || !phone || !address || !contactName || !position || !licenseNumber) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const updatedPharmacy = db.updatePharmacy(params.id, {
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

    console.log("✅ PHARMACY UPDATED BY ADMIN SUCCESSFULLY")

    const { password: _, ...safePharmacy } = updatedPharmacy
    return NextResponse.json({
      success: true,
      message: "Pharmacy updated successfully",
      pharmacy: safePharmacy,
    })
  } catch (error) {
    console.error("❌ ADMIN PHARMACY UPDATE ERROR:", error)
    return NextResponse.json({ error: "Failed to update pharmacy" }, { status: 500 })
  }
}

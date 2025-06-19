import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { adminId, reason } = body

    console.log(`🔄 REJECTING PHARMACY: ${params.id}`)
    console.log(`   Admin ID: ${adminId}`)
    console.log(`   Reason: ${reason}`)

    if (!adminId || !reason) {
      return NextResponse.json({ error: "Admin ID and reason required" }, { status: 400 })
    }

    const pharmacy = db.rejectPharmacy(params.id, adminId, reason)

    if (!pharmacy) {
      console.error(`❌ Pharmacy ${params.id} not found`)
      return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 })
    }

    console.log(`❌ PHARMACY REJECTED: ${pharmacy.name}`)
    console.log(`   Email: ${pharmacy.email}`)
    console.log(`   Reason: ${reason}`)

    // Send rejection email to pharmacy
    console.log("📧 Sending rejection email to pharmacy...")

    try {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
      const pharmacyResponse = await fetch(`${baseUrl}/api/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pharmacy_rejected",
          to: pharmacy.email,
          data: {
            pharmacyName: pharmacy.name,
            reason: reason,
          },
        }),
      })

      const pharmacyResult = await pharmacyResponse.json()

      if (pharmacyResponse.ok) {
        console.log("✅ REJECTION EMAIL SENT TO PHARMACY")
        console.log("   Result:", pharmacyResult)
      } else {
        console.error("❌ FAILED TO SEND REJECTION EMAIL TO PHARMACY")
        console.error("   Error:", pharmacyResult)
      }

      // Send notification to admin
      const adminResponse = await fetch(`${baseUrl}/api/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "new_registration",
          to: "kaurjassu1632@gmail.com",
          data: {
            pharmacyName: `${pharmacy.name} - REJECTED ❌`,
            email: pharmacy.email,
            contactName: pharmacy.contactName,
            licenseNumber: pharmacy.licenseNumber,
            phone: pharmacy.phone,
          },
        }),
      })

      if (adminResponse.ok) {
        console.log("✅ ADMIN NOTIFICATION SENT")
      }
    } catch (notificationError) {
      console.error("❌ NOTIFICATION ERROR:", notificationError)
    }

    const { password: _, ...safePharmacy } = pharmacy
    return NextResponse.json({
      success: true,
      message: "Pharmacy rejected",
      pharmacy: safePharmacy,
    })
  } catch (error) {
    console.error("❌ REJECTION ERROR:", error)
    return NextResponse.json({ error: "Failed to reject pharmacy" }, { status: 500 })
  }
}

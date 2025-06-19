import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { adminId } = body

    console.log(`🔄 APPROVING PHARMACY: ${params.id}`)
    console.log(`   Admin ID: ${adminId}`)

    if (!adminId) {
      return NextResponse.json({ error: "Admin ID required" }, { status: 400 })
    }

    const pharmacy = db.approvePharmacy(params.id, adminId)

    if (!pharmacy) {
      console.error(`❌ Pharmacy ${params.id} not found`)
      return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 })
    }

    console.log(`✅ PHARMACY APPROVED: ${pharmacy.name}`)
    console.log(`   Email: ${pharmacy.email}`)
    console.log(`   Status: ${pharmacy.status}`)

    // Send approval email to pharmacy
    console.log("📧 Sending approval email to pharmacy...")

    try {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
      const pharmacyResponse = await fetch(`${baseUrl}/api/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pharmacy_approved",
          to: pharmacy.email,
          data: {
            pharmacyName: pharmacy.name,
          },
        }),
      })

      const pharmacyResult = await pharmacyResponse.json()

      if (pharmacyResponse.ok) {
        console.log("✅ APPROVAL EMAIL SENT TO PHARMACY")
        console.log("   Result:", pharmacyResult)
      } else {
        console.error("❌ FAILED TO SEND APPROVAL EMAIL TO PHARMACY")
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
            pharmacyName: `${pharmacy.name} - APPROVED ✅`,
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
      message: "Pharmacy approved successfully",
      pharmacy: safePharmacy,
    })
  } catch (error) {
    console.error("❌ APPROVAL ERROR:", error)
    return NextResponse.json({ error: "Failed to approve pharmacy" }, { status: 500 })
  }
}

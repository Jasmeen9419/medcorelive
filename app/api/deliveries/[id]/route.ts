import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const delivery = db.getDeliveryById(params.id)

    if (!delivery) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 })
    }

    return NextResponse.json({ delivery })
  } catch (error) {
    console.error("❌ Get delivery error:", error)
    return NextResponse.json({ error: "Failed to fetch delivery" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    console.log(`🔄 Updating delivery ${params.id} with:`, body)

    const delivery = db.updateDelivery(params.id, body)

    if (!delivery) {
      console.error(`❌ Delivery ${params.id} not found`)
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 })
    }

    console.log(`✅ Delivery ${params.id} updated successfully to status: ${delivery.status}`)

    // Get pharmacy info for notification
    const pharmacy = db.getPharmacyById(delivery.pharmacyId)

    // Send status update notification to pharmacy
    if (pharmacy) {
      console.log(`📧 Sending status update email to pharmacy: ${pharmacy.email}`)

      try {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
        const response = await fetch(`${baseUrl}/api/notifications/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "delivery_status_update",
            to: pharmacy.email,
            data: {
              deliveryId: delivery.id,
              patientName: delivery.patientName,
              status: delivery.status,
              trackingNumber: delivery.trackingNumber,
            },
          }),
        })

        if (response.ok) {
          console.log("✅ Pharmacy notification sent successfully")
        } else {
          console.error("❌ Failed to send pharmacy notification")
        }
      } catch (emailError) {
        console.error("❌ Email notification error:", emailError)
      }

      // Send notification to admin
      try {
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
        const response = await fetch(`${baseUrl}/api/notifications/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "delivery_status_update",
            to: "kaurjassu1632@gmail.com",
            data: {
              deliveryId: delivery.id,
              patientName: delivery.patientName,
              status: delivery.status,
              trackingNumber: delivery.trackingNumber,
              pharmacyName: delivery.pharmacyName,
            },
          }),
        })

        if (response.ok) {
          console.log("✅ Admin notification sent successfully")
        } else {
          console.error("❌ Failed to send admin notification")
        }
      } catch (emailError) {
        console.error("❌ Admin email notification error:", emailError)
      }
    }

    return NextResponse.json({
      success: true,
      delivery,
      message: `Delivery status updated to ${delivery.status}`,
    })
  } catch (error) {
    console.error("❌ Update delivery error:", error)
    return NextResponse.json({ error: "Failed to update delivery" }, { status: 500 })
  }
}

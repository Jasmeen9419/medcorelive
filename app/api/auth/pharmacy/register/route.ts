import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"
import { isValidEmail, isStrongPassword } from "@/lib/auth-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, confirmPassword, phone, address, licenseNumber, contactName, position } = body

    console.log("📝 PHARMACY REGISTRATION ATTEMPT:")
    console.log(`   Name: ${name}`)
    console.log(`   Email: ${email}`)
    console.log(`   Contact: ${contactName}`)

    // Validation
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !address ||
      !licenseNumber ||
      !contactName ||
      !position
    ) {
      console.error("❌ Missing required fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      console.error("❌ Invalid email format")
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (!isStrongPassword(password)) {
      console.error("❌ Weak password")
      return NextResponse.json(
        {
          error: "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
        },
        { status: 400 },
      )
    }

    if (password !== confirmPassword) {
      console.error("❌ Passwords don't match")
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    // Register pharmacy
    const pharmacy = await db.registerPharmacy({
      name,
      email,
      password,
      phone,
      address,
      licenseNumber,
      contactName,
      position,
    })

    console.log("✅ PHARMACY REGISTERED SUCCESSFULLY:")
    console.log(`   ID: ${pharmacy.id}`)
    console.log(`   Status: ${pharmacy.status}`)

    // Send notification to admin IMMEDIATELY
    console.log("📧 Sending admin notification...")

    try {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
      const notificationResponse = await fetch(`${baseUrl}/api/notifications/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "new_registration",
          to: "kaurjassu1632@gmail.com",
          data: {
            pharmacyName: name,
            email,
            contactName,
            licenseNumber,
            phone,
            address,
          },
        }),
      })

      const notificationResult = await notificationResponse.json()

      if (notificationResponse.ok) {
        console.log("✅ ADMIN NOTIFICATION SENT SUCCESSFULLY")
        console.log("   Result:", notificationResult)
      } else {
        console.error("❌ ADMIN NOTIFICATION FAILED")
        console.error("   Error:", notificationResult)
      }
    } catch (notificationError) {
      console.error("❌ NOTIFICATION ERROR:", notificationError)
    }

    // Return success without sensitive data
    const { password: _, ...safePharmacy } = pharmacy
    return NextResponse.json(
      {
        success: true,
        message: "Registration submitted successfully! You will receive an email once approved by our admin team.",
        pharmacy: safePharmacy,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("❌ REGISTRATION ERROR:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}

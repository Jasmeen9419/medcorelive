import { hashPassword, verifyPassword, generateSecureId } from "./auth-utils"

export interface Delivery {
  id: string
  patientName: string
  address: string
  phone: string
  packages: number
  status: "pending" | "picked-up" | "in-transit" | "delivered" | "delivery-failed"
  createdAt: string
  updatedAt: string
  pharmacyId: string
  pharmacyName: string
  notes?: string
  trackingNumber: string
  estimatedDelivery?: string
  driverName?: string
  driverPhone?: string
  location?: {
    lat: number
    lng: number
    address: string
    timestamp: string
  }[]
}

export interface Pharmacy {
  id: string
  name: string
  email: string
  password: string // hashed
  phone: string
  address: string
  licenseNumber: string
  status: "pending" | "approved" | "rejected"
  contactName: string
  position: string
  createdAt: string
  approvedAt?: string
  approvedBy?: string
  rejectedAt?: string
  rejectedBy?: string
  rejectionReason?: string
}

export interface Admin {
  id: string
  email: string
  password: string // hashed
  name: string
  role: "admin"
  createdAt: string
  lastLogin?: string
}

// Secure admin credentials
const ADMIN_EMAIL = "kaurjassu1632@gmail.com"
const ADMIN_PASSWORD = "MedCore@Admin2024!"

// Test pharmacy credentials for demo
const TEST_PHARMACY_EMAIL = "test@pharmacy.com"
const TEST_PHARMACY_PASSWORD = "TestPharmacy123!"

// Storage arrays
const admins: Admin[] = []
const deliveries: Delivery[] = []
const pharmacies: Pharmacy[] = []

// Initialize admin and test accounts
async function initializeAccounts() {
  console.log("🔄 Initializing accounts...")

  // Initialize admin account
  if (admins.length === 0) {
    try {
      const hashedAdminPassword = await hashPassword(ADMIN_PASSWORD)
      const admin: Admin = {
        id: "admin-1",
        email: ADMIN_EMAIL,
        password: hashedAdminPassword,
        name: "System Administrator",
        role: "admin",
        createdAt: new Date().toISOString(),
      }
      admins.push(admin)
      console.log("✅ Admin account initialized")
      console.log(`   Email: ${ADMIN_EMAIL}`)
      console.log(`   Password: ${ADMIN_PASSWORD}`)
    } catch (error) {
      console.error("❌ Failed to initialize admin account:", error)
    }
  }

  // Initialize test pharmacy account
  if (pharmacies.length === 0) {
    try {
      const hashedPharmacyPassword = await hashPassword(TEST_PHARMACY_PASSWORD)
      const testPharmacy: Pharmacy = {
        id: "PHARM-TEST-001",
        name: "Test Pharmacy",
        email: TEST_PHARMACY_EMAIL,
        password: hashedPharmacyPassword,
        phone: "(416) 555-0123",
        address: "123 Test Street, Toronto, ON M5V 3A8",
        licenseNumber: "ON12345",
        status: "approved", // Pre-approved for testing
        contactName: "Test Manager",
        position: "Pharmacy Manager",
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
        approvedBy: "admin-1",
      }
      pharmacies.push(testPharmacy)
      console.log("✅ Test pharmacy account initialized")
      console.log(`   Email: ${TEST_PHARMACY_EMAIL}`)
      console.log(`   Password: ${TEST_PHARMACY_PASSWORD}`)
    } catch (error) {
      console.error("❌ Failed to initialize test pharmacy account:", error)
    }
  }
}

// Initialize accounts on module load
initializeAccounts()

export const db = {
  // Admin functions
  getAdminByEmail: async (email: string) => {
    await initializeAccounts()
    const admin = admins.find((a) => a.email === email)
    console.log(`🔍 Looking for admin with email: ${email}`)
    console.log(`   Found: ${admin ? "YES" : "NO"}`)
    return admin
  },

  verifyAdminLogin: async (email: string, password: string) => {
    console.log("🔐 ADMIN LOGIN ATTEMPT:")
    console.log(`   Email: ${email}`)
    console.log(`   Password provided: ${password ? "YES" : "NO"}`)

    const admin = await db.getAdminByEmail(email)
    if (!admin) {
      console.log("❌ Admin not found")
      return null
    }

    console.log(`🔍 Admin found: ${admin.name}`)
    console.log(`   Stored password hash: ${admin.password.substring(0, 20)}...`)

    try {
      const isValid = await verifyPassword(password, admin.password)
      console.log(`🔐 Password verification result: ${isValid}`)

      if (isValid) {
        // Update last login
        admin.lastLogin = new Date().toISOString()
        console.log("✅ ADMIN LOGIN SUCCESSFUL")
        return admin
      } else {
        console.log("❌ INVALID ADMIN PASSWORD")
        return null
      }
    } catch (error) {
      console.error("❌ Password verification error:", error)
      return null
    }
  },

  // Pharmacy functions
  getPharmacies: () => pharmacies,
  getPharmacyById: (id: string) => pharmacies.find((p) => p.id === id),
  getPharmacyByEmail: (email: string) => {
    const pharmacy = pharmacies.find((p) => p.email === email)
    console.log(`🔍 Looking for pharmacy with email: ${email}`)
    console.log(`   Found: ${pharmacy ? "YES" : "NO"}`)
    return pharmacy
  },

  registerPharmacy: async (pharmacyData: {
    name: string
    email: string
    password: string
    phone: string
    address: string
    licenseNumber: string
    contactName: string
    position: string
  }) => {
    console.log("📝 Registering pharmacy:", pharmacyData.email)

    // Check if email already exists
    if (db.getPharmacyByEmail(pharmacyData.email)) {
      throw new Error("Email already registered")
    }

    const hashedPassword = await hashPassword(pharmacyData.password)
    const newPharmacy: Pharmacy = {
      ...pharmacyData,
      id: `PHARM-${generateSecureId()}`,
      password: hashedPassword,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    pharmacies.push(newPharmacy)
    console.log("✅ Pharmacy registered successfully:", newPharmacy.id)
    return newPharmacy
  },

  updatePharmacy: (id: string, updates: Partial<Pharmacy>) => {
    const index = pharmacies.findIndex((p) => p.id === id)
    if (index !== -1) {
      pharmacies[index] = { ...pharmacies[index], ...updates }
      return pharmacies[index]
    }
    return null
  },

  verifyPharmacyLogin: async (email: string, password: string) => {
    console.log("🔐 PHARMACY LOGIN ATTEMPT:")
    console.log(`   Email: ${email}`)
    console.log(`   Password provided: ${password ? "YES" : "NO"}`)

    const pharmacy = db.getPharmacyByEmail(email)
    if (!pharmacy) {
      console.log("❌ Pharmacy not found")
      return null
    }

    console.log(`🔍 Pharmacy found: ${pharmacy.name}`)
    console.log(`   Status: ${pharmacy.status}`)
    console.log(`   Stored password hash: ${pharmacy.password.substring(0, 20)}...`)

    if (pharmacy.status !== "approved") {
      console.log("❌ Pharmacy not approved yet, status:", pharmacy.status)
      throw new Error("Account not approved yet. Please wait for admin approval.")
    }

    try {
      const isValid = await verifyPassword(password, pharmacy.password)
      console.log(`🔐 Password verification result: ${isValid}`)

      if (isValid) {
        console.log("✅ PHARMACY LOGIN SUCCESSFUL")
        return pharmacy
      } else {
        console.log("❌ INVALID PHARMACY PASSWORD")
        return null
      }
    } catch (error) {
      console.error("❌ Password verification error:", error)
      return null
    }
  },

  approvePharmacy: (id: string, adminId: string) => {
    const index = pharmacies.findIndex((p) => p.id === id)
    if (index !== -1) {
      pharmacies[index] = {
        ...pharmacies[index],
        status: "approved",
        approvedAt: new Date().toISOString(),
        approvedBy: adminId,
      }
      console.log("✅ Pharmacy approved:", pharmacies[index].name)
      return pharmacies[index]
    }
    return null
  },

  rejectPharmacy: (id: string, adminId: string, reason: string) => {
    const index = pharmacies.findIndex((p) => p.id === id)
    if (index !== -1) {
      pharmacies[index] = {
        ...pharmacies[index],
        status: "rejected",
        rejectedAt: new Date().toISOString(),
        rejectedBy: adminId,
        rejectionReason: reason,
      }
      console.log("❌ Pharmacy rejected:", pharmacies[index].name)
      return pharmacies[index]
    }
    return null
  },

  // Delivery functions
  getDeliveries: () => deliveries,
  getDeliveryById: (id: string) => deliveries.find((d) => d.id === id),
  getDeliveriesByPharmacy: (pharmacyId: string) => deliveries.filter((d) => d.pharmacyId === pharmacyId),

  addDelivery: (delivery: Omit<Delivery, "id" | "createdAt" | "updatedAt" | "trackingNumber">) => {
    const newDelivery: Delivery = {
      ...delivery,
      id: `DEL-${generateSecureId()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingNumber: `TRK-${generateSecureId()}`,
    }
    deliveries.push(newDelivery)
    console.log("✅ Delivery added:", newDelivery.id)
    return newDelivery
  },

  updateDelivery: (id: string, updates: Partial<Delivery>) => {
    const index = deliveries.findIndex((d) => d.id === id)
    if (index !== -1) {
      deliveries[index] = { ...deliveries[index], ...updates, updatedAt: new Date().toISOString() }
      console.log("✅ Delivery updated:", deliveries[index].id, "Status:", deliveries[index].status)
      return deliveries[index]
    }
    return null
  },

  // Stats
  getStats: () => ({
    totalPharmacies: pharmacies.length,
    pendingPharmacies: pharmacies.filter((p) => p.status === "pending").length,
    approvedPharmacies: pharmacies.filter((p) => p.status === "approved").length,
    totalDeliveries: deliveries.length,
    pendingDeliveries: deliveries.filter((d) => d.status === "pending").length,
    inTransitDeliveries: deliveries.filter((d) => d.status === "in-transit").length,
    deliveredDeliveries: deliveries.filter((d) => d.status === "delivered").length,
  }),

  // Debug function to show current accounts
  debugAccounts: () => {
    console.log("\n🔍 DEBUG: Current Accounts")
    console.log("=========================")
    console.log("ADMINS:")
    admins.forEach((admin) => {
      console.log(`  - ${admin.email} (${admin.name})`)
    })
    console.log("PHARMACIES:")
    pharmacies.forEach((pharmacy) => {
      console.log(`  - ${pharmacy.email} (${pharmacy.name}) - Status: ${pharmacy.status}`)
    })
    console.log("=========================\n")
  },
}

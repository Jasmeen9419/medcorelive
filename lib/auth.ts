import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "./database"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Admin login
          if (credentials.userType === "admin") {
            const admin = await db.verifyAdminLogin(credentials.email, credentials.password)
            if (admin) {
              return {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: "admin",
              }
            }
          }

          // Pharmacy login
          if (credentials.userType === "pharmacy") {
            const pharmacy = await db.verifyPharmacyLogin(credentials.email, credentials.password)
            if (pharmacy) {
              return {
                id: pharmacy.id,
                email: pharmacy.email,
                name: pharmacy.name,
                role: "pharmacy",
              }
            }
          }

          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/pharmacy-portal",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  debug: true, // Enable debug mode to see auth issues
}

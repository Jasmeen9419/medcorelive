"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck, Lock, AlertCircle, Shield, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminPortal() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store admin info in localStorage for demo (use proper session management in production)
        localStorage.setItem("admin", JSON.stringify(data.admin))
        router.push("/admin-portal/dashboard")
      } else {
        setError(data.error || "Invalid credentials")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MEDCORE</h1>
                <p className="text-sm text-blue-400 font-medium">ADMIN PORTAL</p>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Return to Website
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Portal Login Section */}
      <section className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-red-900 rounded-full mb-4">
              <Shield className="h-10 w-10 text-red-300" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400">Secure access to delivery management system</p>
            <div className="mt-4 p-3 bg-yellow-900/50 rounded-lg border border-yellow-700">
              <p className="text-yellow-300 text-sm">
                <strong>Authorized Access Only</strong>
                <br />
                Use your secure admin credentials
              </p>
            </div>
          </div>

          <Card className="bg-gray-800 border-gray-700 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Administrator Login</CardTitle>
              <CardDescription className="text-gray-400">
                Enter your secure credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 text-base">
                    Admin Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@medcorehub.ca"
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 text-base">
                    Admin Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="bg-gray-700 border-gray-600 text-white h-12 pr-10"
                      placeholder="Enter your secure password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <Alert className="bg-red-900/50 border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">{error}</AlertDescription>
                  </Alert>
                )}

                <Alert className="bg-blue-900/50 border-blue-800">
                  <Lock className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-300">
                    This portal is restricted to authorized administrators only. All access attempts are logged and
                    monitored.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Access Admin Dashboard"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Technical support:{" "}
              <a href="mailto:sraojass@icloud.com" className="text-blue-400 hover:underline">
                sraojass@icloud.com
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500">© 2024 MEDCORE DELIVERY SERVICES. All rights reserved. | medcorehub.ca</p>
        </div>
      </footer>
    </div>
  )
}

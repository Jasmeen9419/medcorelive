"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Truck, Lock, AlertCircle, CheckCircle, Building, Mail, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PharmacyPortal() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/auth/pharmacy/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store pharmacy info in localStorage for demo (use proper session management in production)
        localStorage.setItem("pharmacy", JSON.stringify(data.pharmacy))
        router.push("/pharmacy-portal/dashboard")
      } else {
        setMessageType("error")
        setMessage(data.error || "Login failed")
      }
    } catch (error) {
      setMessageType("error")
      setMessage("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const formData = new FormData(e.target as HTMLFormElement)
    const registrationData = {
      name: formData.get("pharmacyName") as string,
      email: formData.get("regEmail") as string,
      password: formData.get("regPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      licenseNumber: formData.get("licenseNumber") as string,
      contactName: formData.get("contactName") as string,
      position: formData.get("position") as string,
    }

    try {
      const response = await fetch("/api/auth/pharmacy/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessageType("success")
        setMessage(data.message)
        // Clear form
        ;(e.target as HTMLFormElement).reset()
      } else {
        setMessageType("error")
        setMessage(data.error || "Registration failed")
      }
    } catch (error) {
      setMessageType("error")
      setMessage("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MEDCORE</h1>
                <p className="text-sm text-blue-600 font-medium">DELIVERY SERVICES</p>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                Contact
              </Link>
              <Link href="/track" className="text-gray-600 hover:text-blue-600">
                Track Delivery
              </Link>
              <Link href="/pharmacy-portal" className="text-blue-600 font-medium">
                Pharmacy Portal
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Portal Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Pharmacy Portal</h1>
            <p className="text-gray-600 mt-2">Secure access to MEDCORE delivery services</p>
          </div>

          {message && (
            <Alert
              className={`mb-6 ${messageType === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
            >
              {messageType === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={messageType === "success" ? "text-green-700" : "text-red-700"}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="text-lg py-3">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="text-lg py-3">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Pharmacy Login</CardTitle>
                  <CardDescription>Enter your approved pharmacy credentials</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="pharmacy@example.com"
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-base">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="h-12 pr-10"
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
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login to Dashboard"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Pharmacy Registration</CardTitle>
                  <CardDescription>
                    Register your pharmacy for MEDCORE delivery services.
                    <strong className="text-orange-600"> Admin approval required.</strong>
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-6">
                    {/* Pharmacy Information */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Building className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">Pharmacy Information</h3>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pharmacyName" className="text-base">
                          Pharmacy Name *
                        </Label>
                        <Input
                          id="pharmacyName"
                          name="pharmacyName"
                          placeholder="ABC Pharmacy"
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber" className="text-base">
                          Pharmacy License Number *
                        </Label>
                        <Input
                          id="licenseNumber"
                          name="licenseNumber"
                          placeholder="e.g. ON12345"
                          required
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-base">
                          Pharmacy Address *
                        </Label>
                        <Textarea
                          id="address"
                          name="address"
                          placeholder="123 Main Street, Toronto, ON M5V 3A8"
                          required
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">Contact Information</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactName" className="text-base">
                            Contact Person *
                          </Label>
                          <Input id="contactName" name="contactName" placeholder="John Doe" required className="h-12" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="position" className="text-base">
                            Position *
                          </Label>
                          <Input
                            id="position"
                            name="position"
                            placeholder="Pharmacy Manager"
                            required
                            className="h-12"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="regEmail" className="text-base">
                            Email Address *
                          </Label>
                          <Input
                            id="regEmail"
                            name="regEmail"
                            type="email"
                            placeholder="contact@pharmacy.com"
                            required
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-base">
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="(416) 555-0123"
                            required
                            className="h-12"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Account Setup */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Lock className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">Account Setup</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="regPassword" className="text-base">
                            Password *
                          </Label>
                          <div className="relative">
                            <Input
                              id="regPassword"
                              name="regPassword"
                              type={showPassword ? "text" : "password"}
                              required
                              className="h-12 pr-10"
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
                          <p className="text-xs text-gray-500">
                            Must be 8+ characters with uppercase, lowercase, number, and special character
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-base">
                            Confirm Password *
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              required
                              className="h-12 pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-700">
                        <strong>Important:</strong> Your registration requires admin approval. You will receive an email
                        notification once your account is approved and activated.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitting Registration..." : "Submit Registration"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact our support team at{" "}
              <a href="mailto:sraojass@icloud.com" className="text-blue-600 hover:underline font-medium">
                sraojass@icloud.com
              </a>
            </p>
            <p className="text-sm text-gray-600">
              Or call us at{" "}
              <a href="tel:(406) 969-9419" className="text-blue-600 hover:underline font-medium">
                (406) 969-9419
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">MEDCORE DELIVERY SERVICES</span>
            </div>
          </div>
          <p className="text-gray-400">© 2024 MEDCORE DELIVERY SERVICES. All rights reserved. | medcorehub.ca</p>
        </div>
      </footer>
    </div>
  )
}

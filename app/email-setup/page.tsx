"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Truck, Mail, Key, CheckCircle, AlertCircle, Copy, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function EmailSetupPage() {
  const [testEmail, setTestEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleTestEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pharmacy_approved",
          to: testEmail,
          data: {
            pharmacyName: "Test Pharmacy",
          },
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: "Network error" })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MEDCORE</h1>
                <p className="text-sm text-blue-600 font-medium">EMAIL SETUP</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link href="/">
                <Button variant="outline">Home</Button>
              </Link>
              <Link href="/debug">
                <Button variant="outline">Debug Page</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">📧 Email Service Setup</h1>
          <p className="text-lg text-gray-600">Configure email notifications for MEDCORE</p>
        </div>

        {/* Setup Instructions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              Gmail App Password Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                <strong>Important:</strong> You need to set up a Gmail App Password for email notifications to work.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step-by-Step Setup:</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Enable 2-Factor Authentication</p>
                    <p className="text-gray-600 text-sm">
                      Go to your Google Account settings and enable 2FA if not already enabled.
                    </p>
                    <a
                      href="https://myaccount.google.com/security"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      Google Account Security <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Generate App Password</p>
                    <p className="text-gray-600 text-sm">Go to Google Account → Security → App passwords</p>
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      Generate App Password <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Add Environment Variable</p>
                    <p className="text-gray-600 text-sm">Add the app password to your environment variables:</p>
                    <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm mt-2 flex items-center justify-between">
                      <span>EMAIL_APP_PASSWORD=your-16-character-app-password</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard("EMAIL_APP_PASSWORD=your-16-character-app-password")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Restart Application</p>
                    <p className="text-gray-600 text-sm">
                      Restart your Next.js application to load the new environment variable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Email */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-600" />
              Test Email Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTestEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testEmail">Test Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading || !testEmail}>
                {isLoading ? "Sending..." : "Send Test Email"}
              </Button>
            </form>

            {result && (
              <Alert className={`mt-4 ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? "text-green-700" : "text-red-700"}>
                  {result.success ? (
                    <div>
                      <p className="font-medium">✅ Email sent successfully!</p>
                      {result.messageId && <p className="text-sm">Message ID: {result.messageId}</p>}
                      <p className="text-sm">Check your inbox for the test email.</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">❌ Email failed to send</p>
                      <p className="text-sm">{result.error || "Unknown error"}</p>
                      {result.details && <p className="text-sm">Details: {result.details}</p>}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Current Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Current Email Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email Service:</span>
                <span className="font-medium">Gmail SMTP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">From Address:</span>
                <span className="font-medium">sraojass@icloud.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">SMTP Host:</span>
                <span className="font-medium">smtp.gmail.com</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Port:</span>
                <span className="font-medium">587 (TLS)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">App Password:</span>
                <span className="font-medium">{process.env.EMAIL_APP_PASSWORD ? "✅ Configured" : "❌ Not Set"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/debug">
              <Button variant="outline">Debug Page</Button>
            </Link>
            <Link href="/pharmacy-portal">
              <Button variant="outline">Test Registration</Button>
            </Link>
            <Link href="/admin-portal">
              <Button variant="outline">Admin Portal</Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 MEDCORE DELIVERY SERVICES - Email Setup</p>
        </div>
      </footer>
    </div>
  )
}

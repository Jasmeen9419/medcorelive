"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, User, Building, Key, Copy, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Account {
  type: string
  email: string
  password: string
  name: string
  status?: string
}

export default function DebugPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    // Set up test accounts
    const testAccounts: Account[] = [
      {
        type: "Admin",
        email: "kaurjassu1632@gmail.com",
        password: "MedCore@Admin2024!",
        name: "System Administrator",
      },
      {
        type: "Pharmacy",
        email: "test@pharmacy.com",
        password: "TestPharmacy123!",
        name: "Test Pharmacy",
        status: "approved",
      },
    ]
    setAccounts(testAccounts)
  }, [])

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
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
                <p className="text-sm text-blue-600 font-medium">DEBUG PAGE</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link href="/">
                <Button variant="outline">Home</Button>
              </Link>
              <Link href="/pharmacy-portal">
                <Button variant="outline">Pharmacy Portal</Button>
              </Link>
              <Link href="/admin-portal">
                <Button variant="outline">Admin Portal</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🔧 Debug & Test Accounts</h1>
          <p className="text-lg text-gray-600">Use these pre-configured accounts to test the system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {accounts.map((account, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {account.type === "Admin" ? (
                    <User className="h-6 w-6 text-red-600" />
                  ) : (
                    <Building className="h-6 w-6 text-blue-600" />
                  )}
                  {account.type} Account
                  {account.status && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {account.status}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900 font-medium">{account.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 font-mono text-sm flex-1">{account.email}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(account.email, `email-${index}`)}
                    >
                      {copied === `email-${index}` ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Password</label>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900 font-mono text-sm flex-1 bg-gray-100 px-2 py-1 rounded">
                      {account.password}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(account.password, `password-${index}`)}
                    >
                      {copied === `password-${index}` ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href={account.type === "Admin" ? "/admin-portal" : "/pharmacy-portal"}>
                    <Button className="w-full" variant={account.type === "Admin" ? "destructive" : "default"}>
                      <Key className="h-4 w-4 mr-2" />
                      Login as {account.type}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">📋 Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-700">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <strong>Admin Login:</strong> Use the admin credentials to access the admin dashboard and manage
                pharmacy registrations
              </li>
              <li>
                <strong>Pharmacy Login:</strong> Use the test pharmacy credentials to access the pharmacy dashboard and
                submit delivery requests
              </li>
              <li>
                <strong>Registration:</strong> You can also register new pharmacies through the pharmacy portal
                (requires admin approval)
              </li>
              <li>
                <strong>Tracking:</strong> After creating deliveries, you can track them using the tracking page
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/track">
              <Button variant="outline">Track Delivery</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">Contact Page</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline">About Page</Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 MEDCORE DELIVERY SERVICES - Debug Mode</p>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Truck, MapPin, Clock, Package, Phone, User, Search, RefreshCw } from "lucide-react"
import Link from "next/link"

interface TrackingData {
  id: string
  patientName: string
  address: string
  phone: string
  packages: number
  status: string
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

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/track/${trackingNumber}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to track delivery")
      }

      setTrackingData(data.delivery)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to track delivery")
      setTrackingData(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshTracking = () => {
    if (trackingData) {
      handleTrack()
    }
  }

  useEffect(() => {
    // Auto-refresh every 30 seconds if tracking data exists
    if (trackingData) {
      const interval = setInterval(refreshTracking, 30000)
      return () => clearInterval(interval)
    }
  }, [trackingData])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "picked-up":
        return "bg-blue-100 text-blue-800"
      case "in-transit":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "delivery-failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Pickup"
      case "picked-up":
        return "Picked Up"
      case "in-transit":
        return "In Transit"
      case "delivered":
        return "Delivered"
      case "delivery-failed":
        return "Delivery Failed"
      default:
        return status
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
              <Link href="/track" className="text-blue-600 font-medium">
                Track Delivery
              </Link>
              <Link href="/pharmacy-portal" className="text-gray-600 hover:text-blue-600">
                Pharmacy Portal
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Delivery</h1>
          <p className="text-lg text-gray-600">Enter your tracking number to see real-time delivery updates</p>
        </div>

        {/* Tracking Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Track Package
            </CardTitle>
            <CardDescription>Enter your tracking number provided by your pharmacy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="tracking" className="sr-only">
                  Tracking Number
                </Label>
                <Input
                  id="tracking"
                  placeholder="Enter tracking number (e.g., TRK-123456789)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                  className="h-12"
                />
              </div>
              <Button onClick={handleTrack} disabled={loading} className="bg-blue-600 hover:bg-blue-700 h-12 px-8">
                {loading ? "Tracking..." : "Track"}
              </Button>
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>

        {/* No Deliveries Message */}
        {!trackingData && !loading && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Deliveries</h3>
              <p className="text-gray-600 mb-6">
                There are currently no deliveries in the system. Once pharmacies start submitting delivery requests,
                you'll be able to track them here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/pharmacy-portal">Pharmacy Portal</Link>
                </Button>
                <Button asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tracking Results */}
        {trackingData && (
          <div className="space-y-6">
            {/* Status Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Delivery Status
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={refreshTracking} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Status</Label>
                        <div className="mt-1">
                          <Badge className={getStatusColor(trackingData.status)}>
                            {getStatusText(trackingData.status)}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Tracking Number</Label>
                        <p className="text-lg font-mono">{trackingData.trackingNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Patient</Label>
                        <p className="text-gray-900">{trackingData.patientName}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Packages</Label>
                        <p className="text-gray-900">{trackingData.packages}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Delivery Address</Label>
                        <p className="text-gray-900">{trackingData.address}</p>
                      </div>
                      {trackingData.estimatedDelivery && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Estimated Delivery</Label>
                          <p className="text-gray-900 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(trackingData.estimatedDelivery).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {trackingData.driverName && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Driver</Label>
                          <p className="text-gray-900 flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {trackingData.driverName}
                          </p>
                          {trackingData.driverPhone && (
                            <p className="text-gray-600 flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {trackingData.driverPhone}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location History */}
            {trackingData.location && trackingData.location.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location History
                  </CardTitle>
                  <CardDescription>Real-time tracking updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingData.location.map((location, index) => (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                        <div className="flex-shrink-0">
                          <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{location.address}</p>
                          <p className="text-sm text-gray-500">{new Date(location.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Information Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Get Your Tracking Number</CardTitle>
            <CardDescription>Your tracking number will be provided by your pharmacy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">1</span>
                </div>
                <p className="text-gray-700">Your pharmacy submits a delivery request through our system</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">2</span>
                </div>
                <p className="text-gray-700">A unique tracking number is generated automatically</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">3</span>
                </div>
                <p className="text-gray-700">Your pharmacy provides you with the tracking number</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-medium">4</span>
                </div>
                <p className="text-gray-700">Use the tracking number here to monitor your delivery in real-time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
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

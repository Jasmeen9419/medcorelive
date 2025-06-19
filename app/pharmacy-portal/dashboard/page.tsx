"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Truck,
  Plus,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle,
  Package,
  AlertCircle,
  User,
  LogOut,
  Settings,
  MapPin,
  Eye,
  EyeOff,
  Key,
  Edit,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Delivery {
  id: string
  patientName: string
  address: string
  phone: string
  packages: number
  status: string
  createdAt: string
  notes?: string
  trackingNumber: string
}

interface Pharmacy {
  id: string
  name: string
  email: string
  phone: string
  address: string
  contactName: string
  position: string
  licenseNumber: string
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
    "picked-up": { color: "bg-blue-100 text-blue-800", icon: Truck, label: "Picked Up" },
    "in-transit": { color: "bg-purple-100 text-purple-800", icon: Truck, label: "In Transit" },
    delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Delivered" },
    "delivery-failed": { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Failed" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  const Icon = config.icon

  return (
    <Badge className={`${config.color} hover:${config.color}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}

export default function PharmacyDashboard() {
  const router = useRouter()
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null)
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewDeliveryForm, setShowNewDeliveryForm] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)

  useEffect(() => {
    // Get pharmacy info from localStorage
    const pharmacyData = localStorage.getItem("pharmacy")
    if (!pharmacyData) {
      router.push("/pharmacy-portal")
      return
    }

    const parsedPharmacy = JSON.parse(pharmacyData)
    setPharmacy(parsedPharmacy)

    // Fetch deliveries for this pharmacy
    fetchDeliveries(parsedPharmacy.id)
  }, [router])

  const fetchDeliveries = async (pharmacyId: string) => {
    try {
      const response = await fetch(`/api/deliveries?pharmacy=${pharmacyId}`)
      const data = await response.json()
      setDeliveries(data.deliveries || [])
    } catch (error) {
      console.error("Failed to fetch deliveries:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("pharmacy")
    router.push("/pharmacy-portal")
  }

  const handleNewDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const deliveryData = {
      patientName: formData.get("patientName") as string,
      address: formData.get("deliveryAddress") as string,
      phone: formData.get("contactNumber") as string,
      packages: Number.parseInt(formData.get("packages") as string),
      notes: formData.get("notes") as string,
      status: "pending",
      pharmacyId: pharmacy?.id,
      pharmacyName: pharmacy?.name,
    }

    try {
      const response = await fetch("/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deliveryData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage(`Delivery request submitted successfully! Tracking: ${data.delivery.trackingNumber}`)
        setShowNewDeliveryForm(false)
        // Refresh deliveries
        if (pharmacy) {
          fetchDeliveries(pharmacy.id)
        }
        // Clear form
        ;(e.target as HTMLFormElement).reset()
      } else {
        setSubmitMessage("Failed to submit delivery request")
      }
    } catch (error) {
      setSubmitMessage("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 5000)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const passwordData = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    try {
      const response = await fetch("/api/auth/pharmacy/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...passwordData, pharmacyId: pharmacy?.id }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage("Password changed successfully!")
        setShowPasswordDialog(false)
        ;(e.target as HTMLFormElement).reset()
      } else {
        setSubmitMessage(data.error || "Failed to change password")
      }
    } catch (error) {
      setSubmitMessage("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 5000)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const profileData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      contactName: formData.get("contactName") as string,
      position: formData.get("position") as string,
      licenseNumber: formData.get("licenseNumber") as string,
    }

    try {
      const response = await fetch("/api/auth/pharmacy/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profileData, pharmacyId: pharmacy?.id }),
      })

      const data = await response.json()

      if (response.ok) {
        setPharmacy({ ...pharmacy!, ...profileData })
        localStorage.setItem("pharmacy", JSON.stringify({ ...pharmacy!, ...profileData }))
        setSubmitMessage("Profile updated successfully!")
        setEditingProfile(false)
        setShowProfileDialog(false)
      } else {
        setSubmitMessage(data.error || "Failed to update profile")
      }
    } catch (error) {
      setSubmitMessage("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitMessage(""), 5000)
    }
  }

  const filteredDeliveries = deliveries.filter(
    (delivery) =>
      delivery.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = {
    pending: deliveries.filter((d) => d.status === "pending").length,
    pickedUp: deliveries.filter((d) => d.status === "picked-up").length,
    inTransit: deliveries.filter((d) => d.status === "in-transit").length,
    delivered: deliveries.filter((d) => d.status === "delivered").length,
    total: deliveries.length,
  }

  if (!pharmacy) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">MEDCORE</h1>
                <p className="text-sm text-blue-600 font-medium">PHARMACY DASHBOARD</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:inline-block">{pharmacy.name}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {pharmacy.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Pharmacy Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowPasswordDialog(true)}>
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSettingsDialog(true)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pharmacy Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your medication delivery requests</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-3"
              onClick={() => setShowNewDeliveryForm(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              New Delivery Request
            </Button>
          </div>
        </div>

        {submitMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{submitMessage}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-3xl font-bold">{stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-3xl font-bold">{stats.pending}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Picked Up</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-3xl font-bold">{stats.pickedUp}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">In Transit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-3xl font-bold">{stats.inTransit}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-3xl font-bold">{stats.delivered}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Dialog */}
        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Pharmacy Profile
                <Button variant="ghost" size="sm" onClick={() => setEditingProfile(!editingProfile)}>
                  {editingProfile ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                </Button>
              </DialogTitle>
              <DialogDescription>View and edit your pharmacy information</DialogDescription>
            </DialogHeader>
            {editingProfile ? (
              <form onSubmit={handleProfileUpdate}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Pharmacy Name</Label>
                      <Input id="name" name="name" defaultValue={pharmacy.name} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">License Number</Label>
                      <Input id="licenseNumber" name="licenseNumber" defaultValue={pharmacy.licenseNumber} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" defaultValue={pharmacy.email} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" defaultValue={pharmacy.phone} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name</Label>
                      <Input id="contactName" name="contactName" defaultValue={pharmacy.contactName} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" name="position" defaultValue={pharmacy.position} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" name="address" defaultValue={pharmacy.address} required />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingProfile(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Pharmacy Name</Label>
                    <p className="text-gray-900">{pharmacy.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">License Number</Label>
                    <p className="text-gray-900">{pharmacy.licenseNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-gray-900">{pharmacy.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <p className="text-gray-900">{pharmacy.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Contact Person</Label>
                    <p className="text-gray-900">{pharmacy.contactName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Position</Label>
                    <p className="text-gray-900">{pharmacy.position}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Address</Label>
                  <p className="text-gray-900">{pharmacy.address}</p>
                </div>
                <DialogFooter>
                  <Button onClick={() => setShowProfileDialog(false)}>Close</Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pharmacy Settings</DialogTitle>
              <DialogDescription>Configure your pharmacy preferences</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Delivery status updates</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>New delivery confirmations</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Account updates</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dashboard Preferences</h3>
                <div className="space-y-2">
                  <Label>Auto-refresh interval</Label>
                  <select className="w-full p-2 border rounded">
                    <option value="30">30 seconds</option>
                    <option value="60">1 minute</option>
                    <option value="300">5 minutes</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowSettingsDialog(false)}>Save Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Password Change Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
              <DialogDescription>Update your account password</DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Must be 8+ characters with uppercase, lowercase, number, and special character
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordDialog(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Changing..." : "Change Password"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* New Delivery Form Dialog */}
        <Dialog open={showNewDeliveryForm} onOpenChange={setShowNewDeliveryForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">New Delivery Request</DialogTitle>
              <DialogDescription>Fill out the patient and delivery information below</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewDeliverySubmit}>
              <div className="space-y-6">
                {/* Patient Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Patient Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="patientName" className="text-base">
                      Patient Name *
                    </Label>
                    <Input id="patientName" name="patientName" placeholder="John Doe" required className="h-12" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactNumber" className="text-base">
                      Contact Number *
                    </Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      type="tel"
                      placeholder="(416) 555-0123"
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    Delivery Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddress" className="text-base">
                      Delivery Address *
                    </Label>
                    <Textarea
                      id="deliveryAddress"
                      name="deliveryAddress"
                      placeholder="123 Main Street, Toronto, ON M5V 3A8"
                      required
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="packages" className="text-base">
                      Number of Packages *
                    </Label>
                    <Input
                      id="packages"
                      name="packages"
                      type="number"
                      min="1"
                      placeholder="1"
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-base">
                      Notes / Special Instructions
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="e.g., Apartment 4B, Ring doorbell, Refrigerated medication, etc."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewDeliveryForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Deliveries Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Delivery History</CardTitle>
                <CardDescription>View and track your submitted delivery requests</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search deliveries..."
                    className="pl-10 w-full md:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredDeliveries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium text-gray-500 py-3 px-4">Request ID</th>
                      <th className="text-left font-medium text-gray-500 py-3 px-4">Patient</th>
                      <th className="text-left font-medium text-gray-500 py-3 px-4 hidden md:table-cell">Address</th>
                      <th className="text-left font-medium text-gray-500 py-3 px-4 hidden lg:table-cell">Packages</th>
                      <th className="text-left font-medium text-gray-500 py-3 px-4 hidden lg:table-cell">Date</th>
                      <th className="text-left font-medium text-gray-500 py-3 px-4">Status</th>
                      <th className="text-right font-medium text-gray-500 py-3 px-4">Tracking</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeliveries.map((delivery) => (
                      <tr key={delivery.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-blue-600">{delivery.id}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{delivery.patientName}</div>
                            <div className="text-gray-500 text-xs">{delivery.phone}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <div className="text-gray-600 truncate max-w-[200px]">{delivery.address}</div>
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell">
                          <div className="text-gray-600">{delivery.packages}</div>
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell">
                          <div className="text-gray-600">{new Date(delivery.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="py-4 px-4">
                          <StatusBadge status={delivery.status} />
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`/track?tracking=${delivery.trackingNumber}`} target="_blank" rel="noreferrer">
                              Track
                            </a>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Delivery Requests Yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't submitted any delivery requests yet. Click the button above to create your first delivery
                  request.
                </p>
                <Button onClick={() => setShowNewDeliveryForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Delivery Request
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 MEDCORE DELIVERY SERVICES. All rights reserved. | sraojass@icloud.com
          </p>
        </div>
      </footer>
    </div>
  )
}

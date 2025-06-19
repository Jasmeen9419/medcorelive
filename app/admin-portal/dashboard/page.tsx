"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
  Users,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Download,
  MoreVertical,
  LogOut,
  Settings,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Eye,
  EyeOff,
  Key,
  Edit,
  Save,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Admin {
  id: string
  email: string
  name: string
  role: string
  lastLogin?: string
}

interface Pharmacy {
  id: string
  name: string
  email: string
  phone: string
  address: string
  licenseNumber: string
  status: string
  contactName: string
  position: string
  createdAt: string
}

interface Delivery {
  id: string
  patientName: string
  address: string
  phone: string
  packages: number
  status: string
  createdAt: string
  pharmacyName: string
  trackingNumber: string
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
    "picked-up": { color: "bg-blue-100 text-blue-800", icon: Truck, label: "Picked Up" },
    "in-transit": { color: "bg-purple-100 text-purple-800", icon: Truck, label: "In Transit" },
    delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Delivered" },
    "delivery-failed": { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Failed" },
    approved: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Approved" },
    rejected: { color: "bg-red-100 text-red-800", icon: AlertCircle, label: "Rejected" },
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

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [updateMessage, setUpdateMessage] = useState("")
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingPharmacy, setEditingPharmacy] = useState<string | null>(null)
  const [editingProfile, setEditingProfile] = useState(false)

  useEffect(() => {
    // Get admin info from localStorage
    const adminData = localStorage.getItem("admin")
    if (!adminData) {
      router.push("/admin-portal")
      return
    }

    const parsedAdmin = JSON.parse(adminData)
    setAdmin(parsedAdmin)

    // Fetch data
    fetchPharmacies()
    fetchDeliveries()
  }, [router])

  const fetchPharmacies = async () => {
    try {
      const response = await fetch("/api/admin/pharmacies")
      const data = await response.json()
      setPharmacies(data.pharmacies || [])
    } catch (error) {
      console.error("Failed to fetch pharmacies:", error)
    }
  }

  const fetchDeliveries = async () => {
    try {
      const response = await fetch("/api/deliveries")
      const data = await response.json()
      setDeliveries(data.deliveries || [])
    } catch (error) {
      console.error("Failed to fetch deliveries:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin")
    router.push("/admin-portal")
  }

  const handleApprovePharmacy = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/pharmacies/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: admin?.id }),
      })

      if (response.ok) {
        setUpdateMessage(`Pharmacy registration approved successfully!`)
        fetchPharmacies()
      }
    } catch (error) {
      setUpdateMessage("Failed to approve pharmacy")
    }
    setTimeout(() => setUpdateMessage(""), 3000)
  }

  const handleRejectPharmacy = async (id: string) => {
    const reason = prompt("Please provide a reason for rejection:")
    if (!reason) return

    try {
      const response = await fetch(`/api/admin/pharmacies/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: admin?.id, reason }),
      })

      if (response.ok) {
        setUpdateMessage(`Pharmacy registration rejected.`)
        fetchPharmacies()
      }
    } catch (error) {
      setUpdateMessage("Failed to reject pharmacy")
    }
    setTimeout(() => setUpdateMessage(""), 3000)
  }

  const handleUpdateDeliveryStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/deliveries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setUpdateMessage(`Delivery ${id} status updated to ${newStatus}`)
        fetchDeliveries()
      }
    } catch (error) {
      setUpdateMessage("Failed to update delivery status")
    }
    setTimeout(() => setUpdateMessage(""), 3000)
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
      const response = await fetch("/api/auth/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...passwordData, adminId: admin?.id }),
      })

      const data = await response.json()

      if (response.ok) {
        setUpdateMessage("Password changed successfully!")
        setShowPasswordDialog(false)
        ;(e.target as HTMLFormElement).reset()
      } else {
        setUpdateMessage(data.error || "Failed to change password")
      }
    } catch (error) {
      setUpdateMessage("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setUpdateMessage(""), 5000)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const profileData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    }

    try {
      const response = await fetch("/api/auth/admin/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profileData, adminId: admin?.id }),
      })

      const data = await response.json()

      if (response.ok) {
        setAdmin({ ...admin!, ...profileData })
        localStorage.setItem("admin", JSON.stringify({ ...admin!, ...profileData }))
        setUpdateMessage("Profile updated successfully!")
        setEditingProfile(false)
        setShowProfileDialog(false)
      } else {
        setUpdateMessage(data.error || "Failed to update profile")
      }
    } catch (error) {
      setUpdateMessage("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setUpdateMessage(""), 5000)
    }
  }

  const handlePharmacyUpdate = async (pharmacyId: string, e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target as HTMLFormElement)
    const pharmacyData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      contactName: formData.get("contactName") as string,
      position: formData.get("position") as string,
      licenseNumber: formData.get("licenseNumber") as string,
    }

    try {
      const response = await fetch(`/api/admin/pharmacies/${pharmacyId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pharmacyData),
      })

      if (response.ok) {
        setUpdateMessage("Pharmacy updated successfully!")
        setEditingPharmacy(null)
        fetchPharmacies()
      } else {
        setUpdateMessage("Failed to update pharmacy")
      }
    } catch (error) {
      setUpdateMessage("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setUpdateMessage(""), 3000)
    }
  }

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.pharmacyName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalDeliveries: deliveries.length,
    pending: deliveries.filter((d) => d.status === "pending").length,
    inTransit: deliveries.filter((d) => d.status === "picked-up" || d.status === "in-transit").length,
    delivered: deliveries.filter((d) => d.status === "delivered").length,
    failed: deliveries.filter((d) => d.status === "delivery-failed").length,
    pendingRegistrations: pharmacies.filter((r) => r.status === "pending").length,
    approvedPharmacies: pharmacies.filter((r) => r.status === "approved").length,
  }

  if (!admin) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">MEDCORE</h1>
                <p className="text-sm text-blue-400 font-medium">ADMIN DASHBOARD</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300 hidden md:inline-block">{admin.name}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-gray-800">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {admin.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage pharmacy registrations and delivery operations</p>
        </div>

        {updateMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{updateMessage}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-2xl font-bold">{stats.totalDeliveries}</span>
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
                <span className="text-2xl font-bold">{stats.pending}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">In Transit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">{stats.inTransit}</span>
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
                <span className="text-2xl font-bold">{stats.delivered}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-2xl font-bold">{stats.failed}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-2xl font-bold">{stats.pendingRegistrations}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Approved Pharmacies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Building className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-2xl font-bold">{stats.approvedPharmacies}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Dialog */}
        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Admin Profile
                <Button variant="ghost" size="sm" onClick={() => setEditingProfile(!editingProfile)}>
                  {editingProfile ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                </Button>
              </DialogTitle>
              <DialogDescription>View and edit your administrator information</DialogDescription>
            </DialogHeader>
            {editingProfile ? (
              <form onSubmit={handleProfileUpdate}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={admin.name} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={admin.email} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value="System Administrator" disabled />
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
                <div>
                  <Label className="text-sm font-medium text-gray-500">Name</Label>
                  <p className="text-gray-900">{admin.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-gray-900">{admin.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Role</Label>
                  <p className="text-gray-900 capitalize">{admin.role}</p>
                </div>
                {admin.lastLogin && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Last Login</Label>
                    <p className="text-gray-900">{new Date(admin.lastLogin).toLocaleString()}</p>
                  </div>
                )}
                <DialogFooter>
                  <Button onClick={() => setShowProfileDialog(false)}>Close</Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Password Change Dialog */}
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Admin Password</DialogTitle>
              <DialogDescription>Update your administrator password</DialogDescription>
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

        {/* Settings Dialog */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Admin Settings</DialogTitle>
              <DialogDescription>Configure system settings and preferences</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>New pharmacy registrations</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Delivery status updates</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>System alerts</Label>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">System Preferences</h3>
                <div className="space-y-2">
                  <Label>Default delivery status refresh interval</Label>
                  <Select defaultValue="30">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                      <SelectItem value="300">5 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowSettingsDialog(false)}>Save Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Main Tabs */}
        <Tabs defaultValue="deliveries" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deliveries" className="text-lg py-3">
              Delivery Management
            </TabsTrigger>
            <TabsTrigger value="registrations" className="text-lg py-3">
              Pending Registrations ({stats.pendingRegistrations})
            </TabsTrigger>
            <TabsTrigger value="pharmacies" className="text-lg py-3">
              Approved Pharmacies ({stats.approvedPharmacies})
            </TabsTrigger>
          </TabsList>

          {/* Deliveries Tab */}
          <TabsContent value="deliveries">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Delivery Management</CardTitle>
                    <CardDescription>View and manage all delivery requests</CardDescription>
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
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="picked-up">Picked Up</SelectItem>
                        <SelectItem value="in-transit">In Transit</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="delivery-failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
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
                          <th className="text-left font-medium text-gray-500 py-3 px-4">Delivery ID</th>
                          <th className="text-left font-medium text-gray-500 py-3 px-4">Patient</th>
                          <th className="text-left font-medium text-gray-500 py-3 px-4 hidden md:table-cell">
                            Pharmacy
                          </th>
                          <th className="text-left font-medium text-gray-500 py-3 px-4 hidden lg:table-cell">
                            Address
                          </th>
                          <th className="text-left font-medium text-gray-500 py-3 px-4 hidden lg:table-cell">
                            Packages
                          </th>
                          <th className="text-left font-medium text-gray-500 py-3 px-4">Status</th>
                          <th className="text-right font-medium text-gray-500 py-3 px-4">Actions</th>
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
                              <div className="text-gray-600">{delivery.pharmacyName}</div>
                            </td>
                            <td className="py-4 px-4 hidden lg:table-cell">
                              <div className="text-gray-600 truncate max-w-[200px]">{delivery.address}</div>
                            </td>
                            <td className="py-4 px-4 hidden lg:table-cell">
                              <div className="text-gray-600">{delivery.packages}</div>
                            </td>
                            <td className="py-4 px-4">
                              <StatusBadge status={delivery.status} />
                            </td>
                            <td className="py-4 px-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateDeliveryStatus(delivery.id, "picked-up")}
                                  >
                                    Mark as Picked Up
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateDeliveryStatus(delivery.id, "in-transit")}
                                  >
                                    Mark as In Transit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateDeliveryStatus(delivery.id, "delivered")}
                                  >
                                    Mark as Delivered
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateDeliveryStatus(delivery.id, "delivery-failed")}
                                  >
                                    Mark as Failed
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Deliveries Yet</h3>
                    <p className="text-gray-600 mb-6">
                      No delivery requests have been submitted yet. Once pharmacies start submitting requests, they will
                      appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pharmacy Registrations Tab */}
          <TabsContent value="registrations">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Pharmacy Registration Approvals</CardTitle>
                <CardDescription>Review and approve pharmacy registration requests</CardDescription>
              </CardHeader>
              <CardContent>
                {pharmacies.filter((p) => p.status === "pending").length > 0 ? (
                  <div className="space-y-4">
                    {pharmacies
                      .filter((p) => p.status === "pending")
                      .map((registration) => (
                        <div key={registration.id} className="border rounded-lg p-6 bg-white">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <Building className="h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-gray-900">{registration.name}</h3>
                                <StatusBadge status={registration.status} />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">License: {registration.licenseNumber}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">Contact: {registration.contactName}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">
                                      Submitted: {new Date(registration.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">{registration.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">{registration.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-600">{registration.address}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleApprovePharmacy(registration.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button onClick={() => handleRejectPharmacy(registration.id)} variant="destructive">
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Pending Registrations</h3>
                    <p className="text-gray-600">No pharmacy registration requests are pending approval.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Pharmacies Tab */}
          <TabsContent value="pharmacies">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Approved Pharmacies</CardTitle>
                <CardDescription>Manage approved pharmacy accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {pharmacies.filter((p) => p.status === "approved").length > 0 ? (
                  <div className="space-y-4">
                    {pharmacies
                      .filter((p) => p.status === "approved")
                      .map((pharmacy) => (
                        <div key={pharmacy.id} className="border rounded-lg p-6 bg-white">
                          {editingPharmacy === pharmacy.id ? (
                            <form onSubmit={(e) => handlePharmacyUpdate(pharmacy.id, e)}>
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Pharmacy Name</Label>
                                    <Input name="name" defaultValue={pharmacy.name} required />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>License Number</Label>
                                    <Input name="licenseNumber" defaultValue={pharmacy.licenseNumber} required />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input name="email" type="email" defaultValue={pharmacy.email} required />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input name="phone" defaultValue={pharmacy.phone} required />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Contact Name</Label>
                                    <Input name="contactName" defaultValue={pharmacy.contactName} required />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Position</Label>
                                    <Input name="position" defaultValue={pharmacy.position} required />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Address</Label>
                                  <Textarea name="address" defaultValue={pharmacy.address} required />
                                </div>
                                <div className="flex gap-2">
                                  <Button type="submit" disabled={isSubmitting}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                  </Button>
                                  <Button type="button" variant="outline" onClick={() => setEditingPharmacy(null)}>
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </form>
                          ) : (
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <Building className="h-5 w-5 text-green-600" />
                                  <h3 className="text-lg font-semibold text-gray-900">{pharmacy.name}</h3>
                                  <StatusBadge status={pharmacy.status} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-gray-500" />
                                      <span className="text-gray-600">License: {pharmacy.licenseNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-gray-500" />
                                      <span className="text-gray-600">Contact: {pharmacy.contactName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-gray-500" />
                                      <span className="text-gray-600">
                                        Approved: {new Date(pharmacy.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4 text-gray-500" />
                                      <span className="text-gray-600">{pharmacy.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-gray-500" />
                                      <span className="text-gray-600">{pharmacy.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-gray-500" />
                                      <span className="text-gray-600">{pharmacy.address}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button onClick={() => setEditingPharmacy(pharmacy.id)} variant="outline">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Approved Pharmacies</h3>
                    <p className="text-gray-600">
                      No pharmacies have been approved yet. Once you approve registrations, they will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 MEDCORE DELIVERY SERVICES. All rights reserved. | medcorehub.ca</p>
        </div>
      </footer>
    </div>
  )
}

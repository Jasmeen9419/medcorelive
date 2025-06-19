import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, Shield, Phone, MapPin, CheckCircle, Star, Users, Package, Zap, Mail, Lock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MEDCORE
                </h1>
                <p className="text-xs text-gray-600 font-medium">DELIVERY SERVICES</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact
              </Link>
              <Link href="/track" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Track Order
              </Link>
              <Link href="/pharmacy-portal">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Pharmacy Portal
                </Button>
              </Link>
              <Link href="/admin-portal">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
              🚀 Now Serving Greater Toronto Area
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Fast & Reliable
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Medication Delivery
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional pharmaceutical delivery services connecting pharmacies with patients across the GTA. Same-day
              delivery, real-time tracking, and secure handling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pharmacy-portal">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
                >
                  <Truck className="mr-2 h-5 w-5" />
                  Join as Pharmacy
                </Button>
              </Link>
              <Link href="/track">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2">
                  <Package className="mr-2 h-5 w-5" />
                  Track Delivery
                </Button>
              </Link>
            </div>

            {/* Contact Numbers */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2 text-blue-600" />
                <span className="font-medium">24/7 Emergency:</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:4069699419" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                  (406) 969-9419
                </a>
                <a href="tel:4376071040" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
                  (437) 607-1040
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Deliveries Completed</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Partner Pharmacies</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600">Secure Delivery</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, fast, and secure medication delivery in just a few steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">1. Pharmacy Submits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Pharmacy submits delivery request through our secure portal with patient details and medication info.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">2. Order Confirmed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We verify the order details and assign a professional driver for pickup and delivery.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">3. Express Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  <Badge className="mb-2 bg-purple-100 text-purple-800">NEW</Badge>
                  <br />
                  Choose from Standard (same day), Rush (4 hours), or Express (2 hours) delivery options.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="text-xl">4. Secure & Verified Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Professional delivery to patient's doorstep with identity verification, real-time tracking and
                  delivery confirmation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Areas We Serve</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Expanding across Ontario to serve more communities
            </p>

            {/* Highlighted GTA Service Line */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-full inline-block mb-8">
              <div className="flex items-center justify-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg font-bold">🌟 WE SERVE ALL OVER THE GREATER TORONTO AREA (GTA) 🌟</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    Toronto
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Full coverage across all Toronto neighborhoods including downtown, midtown, and suburbs.
                </p>
                <div className="text-sm text-gray-500">
                  <p>• Same-day delivery available</p>
                  <p>• Express 2-hour service</p>
                  <p>• 24/7 emergency delivery</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    Mississauga
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Comprehensive service throughout Mississauga with dedicated local drivers.
                </p>
                <div className="text-sm text-gray-500">
                  <p>• Same-day delivery available</p>
                  <p>• Express 2-hour service</p>
                  <p>• Local pharmacy partnerships</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    Brampton
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Reliable delivery service across all Brampton districts and surrounding areas.
                </p>
                <div className="text-sm text-gray-500">
                  <p>• Same-day delivery available</p>
                  <p>• Express 2-hour service</p>
                  <p>• Growing network coverage</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    Markham
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Professional delivery services throughout Markham and York Region communities.
                </p>
                <div className="text-sm text-gray-500">
                  <p>• Same-day delivery available</p>
                  <p>• Express 2-hour service</p>
                  <p>• York Region coverage</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    Vaughan
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Fast and secure medication delivery across Vaughan and neighboring communities.
                </p>
                <div className="text-sm text-gray-500">
                  <p>• Same-day delivery available</p>
                  <p>• Express 2-hour service</p>
                  <p>• Expanding coverage area</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow border-2 border-orange-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center">
                    <MapPin className="h-5 w-5 text-orange-600 mr-2" />
                    Halton Region
                  </CardTitle>
                  <Badge className="bg-orange-100 text-orange-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Coming Soon
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Expanding to serve Oakville, Burlington, Milton, and Halton Hills. Join our waitlist!
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>• Launching Q2 2024</p>
                  <p>• Same-day delivery planned</p>
                  <p>• Express service available</p>
                </div>
                <Link href="/contact">
                  <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                    <Mail className="h-3 w-3 mr-1" />
                    Get Notified
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Don't see your area? We're expanding rapidly!</p>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                <MapPin className="mr-2 h-4 w-4" />
                Request Service in Your Area
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose MEDCORE?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional, secure, and reliable medication delivery services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Secure & Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  HIPAA compliant handling with secure chain of custody. All drivers are background checked and trained
                  in pharmaceutical handling.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Same-day delivery standard, with express 2-hour service available. Real-time tracking keeps everyone
                  informed.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Phone className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Round-the-clock customer support for urgent deliveries and emergency medications. Call (406) 969-9419
                  or (437) 607-1040.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Express Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Multiple delivery speeds: Standard (same day), Rush (4 hours), and Express (2 hours) to meet any
                  urgency level.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-indigo-600 mb-4" />
                <CardTitle>Pharmacy Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Growing network of trusted pharmacy partners across the GTA. Easy integration with existing pharmacy
                  systems.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Package className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Temperature Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Specialized handling for temperature-sensitive medications with insulated transport and monitoring
                  systems.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our network of pharmacy partners and start providing better service to your patients today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/pharmacy-portal">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                <Truck className="mr-2 h-5 w-5" />
                Register Your Pharmacy
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
              >
                <Phone className="mr-2 h-5 w-5" />
                Contact Sales
              </Button>
            </Link>
          </div>

          {/* Emergency Contact Numbers */}
          <div className="text-center">
            <p className="text-blue-100 mb-2">24/7 Emergency Delivery Hotlines:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:4069699419" className="text-white font-bold text-xl hover:text-blue-200 transition-colors">
                (406) 969-9419
              </a>
              <a href="tel:4376071040" className="text-white font-bold text-xl hover:text-blue-200 transition-colors">
                (437) 607-1040
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">MEDCORE</h3>
                  <p className="text-sm text-gray-400">DELIVERY SERVICES</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Professional medication delivery services across the Greater Toronto Area.
              </p>
              <p className="text-sm text-gray-500">© 2024 MEDCORE Delivery Services. All rights reserved.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Same-Day Delivery</li>
                <li>Express 2-Hour Service</li>
                <li>Temperature-Controlled Transport</li>
                <li>Real-Time Tracking</li>
                <li>Emergency Delivery</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/track" className="hover:text-white transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/pharmacy-portal" className="hover:text-white transition-colors">
                    Pharmacy Portal
                  </Link>
                </li>
                <li>
                  <Link href="/admin-portal" className="hover:text-white transition-colors">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>sraojass@icloud.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>(406) 969-9419</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>(437) 607-1040</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Greater Toronto Area</span>
                </div>
                <div className="text-sm text-green-400 font-medium">24/7 Emergency Support</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">Secure, professional medication delivery services. Licensed and insured.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

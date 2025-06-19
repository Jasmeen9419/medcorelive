import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Users, Award, MapPin, Clock, Shield } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Medcore</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
              <Link href="/about" className="text-blue-600 font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">Medcore</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Medcore Delivery Services operates throughout Ontario, Canada, providing reliable and secure medical
            delivery solutions to healthcare providers, pharmacies, and patients.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                We are dedicated to ensuring that critical medications and medical supplies reach their destinations
                safely, securely, and on time. Our specialized delivery network serves the entire province of Ontario,
                connecting healthcare providers with the patients who need them most.
              </p>
              <p className="text-lg text-gray-600">
                With a focus on reliability, professionalism, and care, we bridge the gap between medical facilities and
                communities across Ontario.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <CardHeader className="pb-2">
                  <Users className="h-8 w-8 text-blue-600 mx-auto" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Clients Served</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader className="pb-2">
                  <Truck className="h-8 w-8 text-blue-600 mx-auto" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">20K+</div>
                  <div className="text-sm text-gray-600">Deliveries Made</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader className="pb-2">
                  <MapPin className="h-8 w-8 text-blue-600 mx-auto" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">120+</div>
                  <div className="text-sm text-gray-600">Cities Covered</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardHeader className="pb-2">
                  <Award className="h-8 w-8 text-blue-600 mx-auto" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">On-Time Rate</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Same-Day Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Urgent medical deliveries within the Greater Toronto Area and surrounding regions, available 24/7 for
                  critical medications.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Temperature-Controlled Transport</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Specialized vehicles equipped with temperature monitoring systems for vaccines, biologics, and
                  temperature-sensitive medications.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Truck className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Scheduled Routes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Regular delivery routes connecting major hospitals, clinics, and pharmacies across Ontario with
                  reliable scheduling.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Coverage Areas Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Coverage Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Greater Toronto Area (GTA)</h3>
              <ul className="list-disc list-inside text-gray-600">
                <li>Toronto</li>
                <li>Mississauga</li>
                <li>Brampton</li>
                <li>Vaughan</li>
                <li>Markham</li>
                <li>Oakville</li>
                <li>Pickering</li>
                <li>Ajax</li>
                <li>Whitby</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Partner with Medcore Today</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join dozens of healthcare providers who trust us with their critical deliveries
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Truck className="h-6 w-6" />
            <span className="text-xl font-bold">Medcore Delivery Services</span>
          </div>
          <p className="text-gray-400">© 2024 Medcore Delivery Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

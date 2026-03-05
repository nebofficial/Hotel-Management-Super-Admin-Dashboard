"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

interface Plan {
  id: string
  name: string
}

export default function NewHotelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [plans, setPlans] = useState<Plan[]>([])
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    planId: "",
    hotelAdminEmail: "",
    hotelAdminName: "",
    hotelAdminPassword: "",
  })

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/plans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans || [])
      }
    } catch (error) {
      console.error("Error fetching plans:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          planId: formData.planId || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/hotels")
      } else {
        alert(data.message || "Error creating hotel")
      }
    } catch (error) {
      console.error("Error creating hotel:", error)
      alert("Error creating hotel")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
      <div className="py-4 md:py-6">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-foreground">Create New Hotel</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border-2 border-accent/10 space-y-6">
          <div>
            <label htmlFor="hotel-name" className="block text-sm font-medium text-card-foreground mb-2">
              Hotel Name *
            </label>
            <input
              id="hotel-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter hotel name"
            />
          </div>

          <div>
            <label htmlFor="hotel-address" className="block text-sm font-medium text-card-foreground mb-2">
              Address *
            </label>
            <input
              id="hotel-address"
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter hotel address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="hotel-phone" className="block text-sm font-medium text-card-foreground mb-2">
                Phone *
              </label>
              <input
                id="hotel-phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label htmlFor="hotel-email" className="block text-sm font-medium text-card-foreground mb-2">
                Email *
              </label>
              <input
                id="hotel-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div>
            <label htmlFor="hotel-plan" className="block text-sm font-medium text-card-foreground mb-2">
              Plan (Optional)
            </label>
            <select
              id="hotel-plan"
              value={formData.planId}
              onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Select a plan"
            >
              <option value="">Select a plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Hotel Admin Details</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="admin-name" className="block text-sm font-medium text-card-foreground mb-2">
                  Admin Name *
                </label>
                <input
                  id="admin-name"
                  type="text"
                  required
                  value={formData.hotelAdminName}
                  onChange={(e) => setFormData({ ...formData, hotelAdminName: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter admin name"
                />
              </div>

              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-card-foreground mb-2">
                  Admin Email *
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={formData.hotelAdminEmail}
                  onChange={(e) => setFormData({ ...formData, hotelAdminEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter admin email"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-card-foreground mb-2">
                  Admin Password *
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.hotelAdminPassword}
                  onChange={(e) => setFormData({ ...formData, hotelAdminPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter admin password (min 6 characters)"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Hotel"}
            </button>
          </div>
        </form>
      </div>
      </div>
    </main>
    </ProtectedRoute>
  )
}

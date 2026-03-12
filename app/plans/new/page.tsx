"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, X } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

const availablePermissions = [
  "Dashboard",
  "Reservations & Front Office",
  "Rooms & Property",
  "Guests & CRM",
  "Housekeeping",
  "Restaurant / POS",
  "Inventory & Store",
  "Accounting & Finance",
  "Billing & Invoicing",
  "Staff & HR",
  "Reports",
  "Marketing & OTA",
  "Multi-Property",
  "Settings",
  "Help & System",
]

export default function NewPlanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

  const togglePermission = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${API_BASE_URL}/api/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/plans")
      } else {
        alert(data.message || "Error creating plan")
      }
    } catch (error) {
      console.error("Error creating plan:", error)
      alert("Error creating plan")
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
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-foreground">Create New Plan</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border-2 border-accent/10 space-y-6">
          <div>
            <label htmlFor="plan-name" className="block text-sm font-medium text-card-foreground mb-2">
              Plan Name *
            </label>
            <input
              id="plan-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter plan name"
            />
          </div>

          <div>
            <label htmlFor="plan-description" className="block text-sm font-medium text-card-foreground mb-2">
              Description *
            </label>
            <textarea
              id="plan-description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter plan description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-4">
              Permissions *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availablePermissions.map((permission) => (
                <label
                  key={permission}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={() => togglePermission(permission)}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-card-foreground">{permission}</span>
                </label>
              ))}
            </div>
            {formData.permissions.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {permission}
                    <button
                      type="button"
                      onClick={() => togglePermission(permission)}
                      className="hover:text-primary/80"
                      aria-label={`Remove ${permission} permission`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
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
              disabled={loading || formData.permissions.length === 0}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Plan"}
            </button>
          </div>
        </form>
      </div>
      </div>
    </main>
    </ProtectedRoute>
  )
}

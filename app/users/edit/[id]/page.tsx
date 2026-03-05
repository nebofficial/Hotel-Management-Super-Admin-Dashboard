"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

interface Hotel {
  id: string
  name: string
}

interface Role {
  id: string
  name: string
}

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "hotel_admin",
    hotelId: "",
    roleId: "",
    isActive: true,
  })

  useEffect(() => {
    fetchHotels()
    fetchRoles()
    fetchUser()
  }, [userId])

  const fetchHotels = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/hotels", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setHotels(data.hotels || [])
      }
    } catch (error) {
      console.error("Error fetching hotels:", error)
    }
  }

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setRoles(data.roles || [])
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
    }
  }

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setFormData({
          name: data.user.name || "",
          email: data.user.email || "",
          role: data.user.role || "hotel_admin",
          hotelId: data.user.hotelId || "",
          roleId: data.user.roleId || "",
          isActive: data.user.isActive !== undefined ? data.user.isActive : true,
        })
      } else {
        alert("Error fetching user")
        router.push("/users")
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      alert("Error fetching user")
      router.push("/users")
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          hotelId: formData.hotelId || null,
          roleId: formData.roleId || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/users")
      } else {
        alert(data.message || "Error updating user")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Error updating user")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-background">
          <div className="py-4 md:py-6">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
              <div className="text-center py-12">Loading...</div>
            </div>
          </div>
        </main>
      </ProtectedRoute>
    )
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
          <h1 className="text-3xl font-bold text-foreground">Edit User</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border-2 border-accent/10 space-y-6">
          <div>
            <label htmlFor="user-name" className="block text-sm font-medium text-card-foreground mb-2">
              Name *
            </label>
            <input
              id="user-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter user name"
            />
          </div>

          <div>
            <label htmlFor="user-email" className="block text-sm font-medium text-card-foreground mb-2">
              Email *
            </label>
            <input
              id="user-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label htmlFor="user-role" className="block text-sm font-medium text-card-foreground mb-2">
              Role *
            </label>
            <select
              id="user-role"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="hotel_admin">Hotel Admin</option>
              <option value="staff">Staff</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          <div>
            <label htmlFor="user-hotel" className="block text-sm font-medium text-card-foreground mb-2">
              Hotel (Optional)
            </label>
            <select
              id="user-hotel"
              value={formData.hotelId}
              onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="user-role-custom" className="block text-sm font-medium text-card-foreground mb-2">
              Custom Role (Optional)
            </label>
            <select
              id="user-role-custom"
              value={formData.roleId}
              onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm text-card-foreground">Active</span>
            </label>
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
              {loading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
      </div>
    </main>
    </ProtectedRoute>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Hotel {
  id: string
  name: string
  address: string
  phone: string
  email: string
  isActive: boolean
}

export default function HotelsPage() {
  const router = useRouter()
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchHotels()
  }, [])

  // Refresh hotels list when returning from edit page
  useEffect(() => {
    const handleFocus = () => {
      fetchHotels()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

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
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    console.log('Edit button clicked for hotel:', id)
    router.push(`/hotels/edit/${id}`)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the hotel "${name}"? This action cannot be undone and will delete all associated data.`)) {
      return
    }

    setDeletingId(id)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/hotels/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setHotels(hotels.filter((hotel) => hotel.id !== id))
        alert("Hotel deleted successfully")
      } else {
        alert(data.message || "Error deleting hotel")
      }
    } catch (error) {
      console.error("Error deleting hotel:", error)
      alert("Error deleting hotel")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="py-4 md:py-6">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">Hotel Management</h1>
          <a
            href="/hotels/new"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Add New Hotel
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md border-2 border-accent/10 overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hotels.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                    No hotels found
                  </td>
                </tr>
              ) : (
                hotels.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">
                      {hotel.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                      {hotel.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                      {hotel.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                      {hotel.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          hotel.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {hotel.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-2 relative z-10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('Edit button clicked, hotel ID:', hotel.id)
                            handleEdit(hotel.id)
                          }}
                          className="text-primary hover:text-primary/80 p-2 rounded hover:bg-primary/10 transition-colors cursor-pointer active:scale-95 relative z-20 pointer-events-auto"
                          aria-label={`Edit ${hotel.name}`}
                          title="Edit hotel"
                        >
                          <Edit className="w-4 h-4 pointer-events-none" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('Delete button clicked, hotel ID:', hotel.id)
                            handleDelete(hotel.id, hotel.name)
                          }}
                          disabled={deletingId === hotel.id}
                          className="text-destructive hover:text-destructive/80 p-2 rounded hover:bg-destructive/10 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed active:scale-95 relative z-20 pointer-events-auto"
                          aria-label={`Delete ${hotel.name}`}
                          title="Delete hotel"
                        >
                          <Trash2 className="w-4 h-4 pointer-events-none" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </main>
  )
}

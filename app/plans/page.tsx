"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Plan {
  id: string
  name: string
  description: string
  permissions: string[]
}

export default function PlansPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  // Refresh plans list when returning from edit page
  useEffect(() => {
    const handleFocus = () => {
      fetchPlans()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
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
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    console.log('Edit button clicked for plan:', id)
    router.push(`/plans/edit/${id}`)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the plan "${name}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(id)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/plans/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (response.ok) {
        setPlans(plans.filter((plan) => plan.id !== id))
        alert("Plan deleted successfully")
      } else {
        alert(data.message || "Error deleting plan")
      }
    } catch (error) {
      console.error("Error deleting plan:", error)
      alert("Error deleting plan")
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
          <h1 className="text-3xl font-bold text-foreground">Plan Management</h1>
          <a
            href="/plans/new"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Create Plan
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-12">
              No plans found
            </div>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-lg shadow-md p-6 border-2 border-accent/10 hover:border-accent transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-card-foreground">{plan.name}</h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log('Edit button clicked, plan ID:', plan.id)
                        handleEdit(plan.id)
                      }}
                      className="text-primary hover:text-primary/80 p-2 rounded hover:bg-primary/10 transition-colors cursor-pointer active:scale-95"
                      aria-label={`Edit ${plan.name}`}
                      title="Edit plan"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        console.log('Delete button clicked, plan ID:', plan.id)
                        handleDelete(plan.id, plan.name)
                      }}
                      disabled={deletingId === plan.id}
                      className="text-destructive hover:text-destructive/80 p-2 rounded hover:bg-destructive/10 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed active:scale-95"
                      aria-label={`Delete ${plan.name}`}
                      title="Delete plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div>
                  <p className="text-sm font-medium text-card-foreground mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {plan.permissions.map((permission, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </main>
  )
}

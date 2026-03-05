"use client"

import { Building2, Package, Users } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/app/auth-context"

export default function Home() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <div className="py-4 md:py-6">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">
              Super Admin Dashboard
              {user && <span className="text-lg font-normal text-muted-foreground ml-2">- Welcome, {user.name}</span>}
            </h1>
          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border-2 border-accent/10 hover:border-accent transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-primary">Hotels</h2>
                </div>
                <p className="text-foreground/70 mb-4">Manage all hotels in the system</p>
                <a href="/hotels" className="text-primary hover:underline font-medium inline-flex items-center gap-2">
                  View Hotels →
                </a>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-2 border-accent/10 hover:border-accent transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-primary">Plans</h2>
                </div>
                <p className="text-foreground/70 mb-4">Manage subscription plans</p>
                <a href="/plans" className="text-primary hover:underline font-medium inline-flex items-center gap-2">
                  View Plans →
                </a>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 border-2 border-accent/10 hover:border-accent transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-primary">Users</h2>
                </div>
                <p className="text-foreground/70 mb-4">Manage all system users</p>
                <a href="/users" className="text-primary hover:underline font-medium inline-flex items-center gap-2">
                  View Users →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}

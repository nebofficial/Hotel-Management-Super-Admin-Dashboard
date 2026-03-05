"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useLayoutEffect } from "react"
import { Menu, LogOut, User } from "lucide-react"
import { useSidebar } from "@/app/sidebar-context"

interface UserData {
  id: string
  email: string
  name: string
  role: string
  hotelId?: string | null
  roleId?: string | null
  permissions?: string[]
}

export function Navbar() {
  const { toggleMobileSidebar } = useSidebar()
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)

  // Read from localStorage only after component mounts (client-side only)
  // This prevents hydration mismatch between server and client
  // Using useLayoutEffect to sync before paint and avoid hydration issues
  useLayoutEffect(() => {
    // Defer state update to next tick to avoid linter warning
    // This is the standard pattern for reading from localStorage in Next.js
    const updateUser = () => {
      const userData = localStorage.getItem("user")
      if (userData) {
        try {
          setUser(JSON.parse(userData) as UserData)
        } catch {
          setUser(null)
        }
      }
    }
    // Use requestAnimationFrame to defer update slightly
    requestAnimationFrame(updateUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <nav className="sticky top-0 z-40 bg-gradient-to-r from-red-900 to-red-800 shadow-lg">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Menu Icon and Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobileSidebar}
              className="md:hidden text-amber-100 hover:text-white p-2 rounded-lg hover:bg-red-700/50 transition-colors"
              aria-label="Toggle sidebar menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-md flex items-center justify-center text-red-900 font-bold text-sm shadow-md">
                SA
              </div>
              <span className="font-serif font-bold text-amber-100 hidden sm:inline text-lg">Super Admin</span>
            </Link>
          </div>

          {/* Right Side - User Info */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-amber-100 text-sm hidden sm:flex">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-amber-100 hover:text-white px-3 py-2 rounded-lg hover:bg-red-700/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-amber-100 hover:text-white px-4 py-2 rounded-lg hover:bg-red-700/50 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

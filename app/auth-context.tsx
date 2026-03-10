"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  role: string
  hotelId: string | null
  roleId: string | null
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is authenticated on mount and route changes
  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setUser(null)
        setLoading(false)
        // Only redirect if not on public pages
        const publicPages = ["/login", "/signup"]
        const isPublicPage = publicPages.includes(pathname) || pathname.startsWith("/login") || pathname.startsWith("/signup")
        if (!isPublicPage) {
          router.push("/login")
        }
        return
      }

      // Fetch current user
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const userData = data.user

        // Only allow super_admin role to access this dashboard
        if (userData.role !== "super_admin") {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setUser(null)
          if (pathname !== "/login") {
            router.push("/login")
          }
          setLoading(false)
          return
        }

        setUser(userData)
      } else {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        if (pathname !== "/login") {
          router.push("/login")
        }
      }
    } catch (error) {
      console.error("Auth check error:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      if (pathname !== "/login") {
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Network error" }))
        const msg =
          errorData?.message ||
          errorData?.error ||
          (typeof errorData === "object" && Object.keys(errorData).length === 0
            ? "Invalid credentials or server error. Please try again."
            : String(errorData))
        return { success: false, message: msg }
      }

      const data = await response.json()

      if (data.token) {
        if (data.user?.role !== "super_admin") {
          return { success: false, message: "Access denied. Only super admin can access this dashboard." }
        }

        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setUser(data.user)
        return { success: true }
      }

      return { success: false, message: "Invalid response from server. Please try again." }
    } catch (error) {
      const isNetworkError = error instanceof TypeError && error.message === "Failed to fetch"
      const msg = isNetworkError
        ? "Cannot reach server. Ensure the backend is running on port 5000 and CORS is configured."
        : "An unexpected error occurred. Please try again."
      return { success: false, message: msg }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

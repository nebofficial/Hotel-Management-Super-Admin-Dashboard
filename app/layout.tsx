import type { Metadata, Viewport } from "next"
import type React from "react"
import "./globals.css"
import { AuthProvider } from "@/app/auth-context"
import { AppShell } from "@/components/app-shell"

export const metadata: Metadata = {
  title: "Super Admin Dashboard - Hotel Management System",
  description: "Super Admin Dashboard for managing hotels, plans, and users",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  )
}

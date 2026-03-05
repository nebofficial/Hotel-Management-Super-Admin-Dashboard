"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"
import { SidebarProvider } from "@/app/sidebar-context"

const PUBLIC_PAGES = ["/login", "/signup"]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublicPage = PUBLIC_PAGES.some((page) => pathname === page || pathname.startsWith(`${page}/`))

  if (isPublicPage) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <Navbar />
      <Sidebar />
      <MainContent>{children}</MainContent>
    </SidebarProvider>
  )
}

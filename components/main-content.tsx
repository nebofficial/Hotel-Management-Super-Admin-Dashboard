"use client"

import React from "react"
import { useSidebar } from "@/app/sidebar-context"

export function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <main className={`transition-all duration-300 pb-12 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}>
      {children}
    </main>
  )
}

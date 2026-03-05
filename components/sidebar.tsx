"use client"

import Link from "next/link"
import { useState } from "react"
import {
  Home,
  Building2,
  Package,
  Users,
  ChevronDown,
} from "lucide-react"
import { useSidebar } from "@/app/sidebar-context"

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/",
    subItems: [],
  },
  {
    id: "hotels",
    label: "Hotel Management",
    icon: Building2,
    href: "/hotels",
    subItems: [
      { label: "All Hotels", href: "/hotels" },
      { label: "Add New Hotel", href: "/hotels/new" },
    ],
  },
  {
    id: "plans",
    label: "Plan Management",
    icon: Package,
    href: "/plans",
    subItems: [
      { label: "All Plans", href: "/plans" },
      { label: "Create Plan", href: "/plans/new" },
    ],
  },
  {
    id: "users",
    label: "User Management",
    icon: Users,
    href: "/users",
    subItems: [
      { label: "All Users", href: "/users" },
      { label: "Add New User", href: "/users/new" },
    ],
  },
]

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const { isCollapsed, isMobileOpen, closeMobileSidebar } = useSidebar()

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-red-900 to-red-950 text-white z-30 overflow-y-auto transition-all duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 md:flex ${
          isCollapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const hasSubItems = item.subItems.length > 0
            const isExpanded = expandedItems.includes(item.id)

            return (
              <div key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => {
                    if (hasSubItems) {
                      toggleExpand(item.id)
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-700/50 transition-colors text-left"
                  title={item.label}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="font-medium flex-1">{item.label}</span>
                      {hasSubItems && (
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </>
                  )}
                </Link>

                {/* Sub-menu items */}
                {hasSubItems && isExpanded && !isCollapsed && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-amber-400/30 pl-4">
                    {item.subItems.map((subItem, idx) => (
                      <Link
                        key={idx}
                        href={subItem.href}
                        className="block px-4 py-2 rounded-lg text-sm text-amber-100 hover:text-white hover:bg-red-700/30 transition-colors"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

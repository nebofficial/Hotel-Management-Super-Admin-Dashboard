import type React from "react"

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 w-screen h-screen m-0 p-0 overflow-auto bg-background">
      {children}
    </div>
  )
}

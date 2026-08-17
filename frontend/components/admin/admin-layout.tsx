"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/admin/login-form"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import type { ReactNode } from "react"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="md:pl-64">
        <div className="p-4 md:p-8 pt-20 md:pt-8">{children}</div>
      </main>
    </div>
  )
}

"use client"

import { usePathname } from "next/navigation"

import { AuthProvider } from "@/lib/auth-context"
import { AnimalsProvider } from "@/lib/animals-context"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isLogin = pathname === "/admin/login"

  return (
    <AuthProvider>
      <AdminAuthGuard>
        <AnimalsProvider>
          {isLogin ? (
            children
          ) : (
            <AdminLayout>
              {children}
            </AdminLayout>
          )}
        </AnimalsProvider>
      </AdminAuthGuard>
    </AuthProvider>
  )
}
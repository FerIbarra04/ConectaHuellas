"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { useAuth } from "@/lib/auth-context"
import { Spinner } from "@/components/ui/spinner"

export function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const {
    isAuthenticated,
    isLoadingAuth,
  } = useAuth()

  const isLoginPage =
    pathname === "/admin/login"

  useEffect(() => {
    if (isLoadingAuth) return

    if (
      !isAuthenticated &&
      !isLoginPage
    ) {
      router.replace("/admin/login")
    }

    if (
      isAuthenticated &&
      isLoginPage
    ) {
      router.replace("/admin/dashboard")
    }
  }, [
    isAuthenticated,
    isLoadingAuth,
    isLoginPage,
    router,
  ])

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  if (
    !isAuthenticated &&
    !isLoginPage
  ) {
    return null
  }

  if (
    isAuthenticated &&
    isLoginPage
  ) {
    return null
  }

  return <>{children}</>
}
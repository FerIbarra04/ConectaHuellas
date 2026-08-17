"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

interface AuthUser {
  id: number
  username: string
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoadingAuth: boolean
  user: AuthUser | null
  token: string | null
  login: (
    username: string,
    password: string,
  ) => Promise<{
    success: boolean
    error?: string
  }>
  logout: () => void
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  )

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
process.env.NEXT_PUBLIC_API_URL
  
const TOKEN_KEY = "conecta-huellas-admin-token"
const USER_KEY = "conecta-huellas-admin-user"

export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] =
    useState(false)

  const [isLoadingAuth, setIsLoadingAuth] =
    useState(true)

  const [user, setUser] =
    useState<AuthUser | null>(null)

  const [token, setToken] =
    useState<string | null>(null)

  useEffect(() => {
    const savedToken =
      localStorage.getItem(TOKEN_KEY)

    const savedUser =
      localStorage.getItem(USER_KEY)

    if (savedToken && savedUser) {
      try {
        const parsedUser =
          JSON.parse(savedUser) as AuthUser

        setToken(savedToken)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }

    setIsLoadingAuth(false)
  }, [])

  const login = useCallback(
    async (
      username: string,
      password: string,
    ) => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              username,
              password,
            }),
          },
        )

        const data =
          await res.json().catch(() => null)

        if (!res.ok) {
          return {
            success: false,
            error:
              data?.error ||
              "No se pudo iniciar sesión.",
          }
        }

        localStorage.setItem(
          TOKEN_KEY,
          data.token,
        )

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(data.user),
        )

        setToken(data.token)
        setUser(data.user)
        setIsAuthenticated(true)

        return {
          success: true,
        }
      } catch (error) {
        console.error(
          "Error iniciando sesión:",
          error,
        )

        return {
          success: false,
          error:
            "No se pudo conectar con el servidor.",
        }
      }
    },
    [],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)

    setToken(null)
    setUser(null)
    setIsAuthenticated(false)

    window.location.href =
      "/admin/login"
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoadingAuth,
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context =
    useContext(AuthContext)

  if (context === undefined) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    )
  }

  return context
}
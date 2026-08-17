"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { Animal, AnimalFormData } from "./types"

interface AnimalsContextType {
  animales: Animal[]
  agregarAnimal: (data: AnimalFormData) => void
  editarAnimal: (id: number, data: AnimalFormData) => void
  eliminarAnimal: (id: number) => void
  obtenerAnimal: (id: number) => Animal | undefined
}

const AnimalsContext = createContext<AnimalsContextType | undefined>(undefined)

export function AnimalsProvider({ children }: { children: ReactNode }) {
  const [animales, setAnimales] = useState<Animal[]>([])

  // 🔥 CARGAR DESDE API REAL
  useEffect(() => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    console.error("NEXT_PUBLIC_API_URL no está configurada")
    return
  }

  fetch(`${apiUrl}/animales`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`)
      }

      return res.json()
    })
    .then((data) => setAnimales(data))
    .catch((error) => {
      console.error("Error cargando animales:", error)
    })
}, [])

  const agregarAnimal = useCallback((data: AnimalFormData) => {
    const nuevoAnimal: Animal = {
      ...data,
      id: Date.now(), // 👈 NUMBER (IMPORTANTE)
      estado: "disponible",
      fecha_registro: new Date().toISOString(),
      tags: [],
      multimedia: []
    }

    setAnimales(prev => [nuevoAnimal, ...prev])
  }, [])

  const editarAnimal = useCallback((id: number, data: AnimalFormData) => {
    setAnimales(prev =>
      prev.map(animal =>
        animal.id === id ? { ...animal, ...data } : animal
      )
    )
  }, [])

  const eliminarAnimal = useCallback((id: number) => {
    setAnimales(prev => prev.filter(animal => animal.id !== id))
  }, [])

  const obtenerAnimal = useCallback(
    (id: number) => animales.find(animal => animal.id === id),
    [animales]
  )

  return (
    <AnimalsContext.Provider
      value={{ animales, agregarAnimal, editarAnimal, eliminarAnimal, obtenerAnimal }}
    >
      {children}
    </AnimalsContext.Provider>
  )
}

export function useAnimals() {
  const context = useContext(AnimalsContext)
  if (!context) {
    throw new Error("useAnimals must be used within an AnimalsProvider")
  }
  return context
}
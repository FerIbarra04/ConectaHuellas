"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { getAnimalById, updateAnimal } from "@/lib/api"
import type { Animal, AnimalFormData } from "@/lib/types"

import { AnimalForm } from "@/components/admin/animals/animal-form"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, PawPrintIcon } from "lucide-react"

interface EditAnimalPageProps {
  params: Promise<{ id: string }>
}

export default function EditAnimalPage({
  params,
}: EditAnimalPageProps) {
  const router = useRouter()
  const { id } = use(params)

  const [animal, setAnimal] = useState<Animal | null>(null)
  const [loading, setLoading] = useState(true)

  // =========================
  // CARGAR ANIMAL
  // =========================

  useEffect(() => {
    const loadAnimal = async () => {
      try {
        const animalId = Number(id)

        if (Number.isNaN(animalId)) {
          setAnimal(null)
          return
        }

        const data = await getAnimalById(animalId)
        setAnimal(data)
      } catch (error) {
        console.error("Error cargando animal:", error)
        setAnimal(null)
      } finally {
        setLoading(false)
      }
    }

    loadAnimal()
  }, [id])

  // =========================
  // ACTUALIZAR
  // =========================

  const handleUpdate = async (data: AnimalFormData) => {
    try {
      const animalId = Number(id)

      if (Number.isNaN(animalId)) {
        throw new Error("El ID del animal no es válido")
      }

      await updateAnimal(animalId, data)

      router.push("/admin/animales")
      router.refresh()
    } catch (error) {
      console.error("Error actualizando animal:", error)
    }
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        Cargando...
      </div>
    )
  }

  // =========================
  // NOT FOUND
  // =========================

  if (!animal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/animales">
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="sr-only">Volver a animales</span>
            </Link>
          </Button>

          <h1 className="text-2xl font-bold">
            Animal no encontrado
          </h1>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PawPrintIcon className="mb-4 h-12 w-12 text-muted-foreground" />

            <p className="text-muted-foreground">
              El animal no existe o fue eliminado.
            </p>

            <Button className="mt-4" asChild>
              <Link href="/admin/animales">
                Volver a la lista
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // =========================
  // FORMULARIO
  // =========================

  return (
    <AnimalForm
      animal={animal}
      isEditing
      onSubmit={handleUpdate}
    />
  )
}
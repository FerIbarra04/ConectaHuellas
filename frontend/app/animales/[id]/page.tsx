import { notFound } from "next/navigation"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimalDetailContent } from "@/components/animal-detail-content"

import { getAnimalById, getAnimales } from "@/lib/api"

export async function generateStaticParams() {
  const animals = await getAnimales()

  return animals.map((animal) => ({
    id: animal.id.toString(),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const animalId = Number(id)

  if (Number.isNaN(animalId)) {
    return {
      title: "Animal no encontrado | Conecta Huellas",
    }
  }

  const animal = await getAnimalById(animalId)

  if (!animal) {
    return {
      title: "Animal no encontrado | Conecta Huellas",
    }
  }

  return {
    title: `${animal.nombre} - ${
      animal.estado === "disponible" ? "En Adopción" : "Adoptado"
    } | Conecta Huellas`,
    description: animal.descripcion,
  }
}

export default async function AnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const animalId = Number(id)

  if (Number.isNaN(animalId)) {
    notFound()
  }

  const animal = await getAnimalById(animalId)

  if (!animal) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header/>

      <main className="pt-32 sm:pt-36">
        <AnimalDetailContent animal={animal} />
      </main>

      <Footer />
    </div>
  )
}
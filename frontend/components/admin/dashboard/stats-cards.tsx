"use client"

import { useEffect, useMemo, useState } from "react"
import { useAnimals } from "@/lib/animals-context"
import { getSolicitudes, type SolicitudAdmin } from "@/lib/api"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  PawPrintIcon,
  HeartIcon,
  HomeIcon,
} from "lucide-react"

export function StatsCards() {
  const { animales } = useAnimals()

  const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarSolicitudes() {
      try {
        const data = await getSolicitudes()

        setSolicitudes(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error(
          "Error al cargar solicitudes para las estadísticas:",
          error
        )

        setSolicitudes([])
      } finally {
        setCargando(false)
      }
    }

    cargarSolicitudes()
  }, [])

  const animalesCoordinacion = useMemo(() => {
    const idsExternos = new Set(
      solicitudes
        .filter(
          (solicitud) =>
            solicitud.estado_solicitud === "registrada" &&
            solicitud.animal_id
        )
        .map((solicitud) => Number(solicitud.animal_id))
    )

    return animales.filter(
      (animal) => !idsExternos.has(Number(animal.id))
    )
  }, [animales, solicitudes])

  const totalAnimales = animalesCoordinacion.length

  const enAdopcion = animalesCoordinacion.filter(
    (animal) => animal.estado === "disponible"
  ).length

  const adoptados = animalesCoordinacion.filter(
    (animal) => animal.estado === "adoptado"
  ).length

  const stats = [
    {
      title: "Total de Animales",
      value: totalAnimales,
      icon: PawPrintIcon,
      color: "bg-primary",
      textColor: "text-primary",
    },
    {
      title: "En Adopción",
      value: enAdopcion,
      icon: HomeIcon,
      color: "bg-[#3CB371]",
      textColor: "text-[#3CB371]",
    },
    {
      title: "Adoptados",
      value: adoptados,
      icon: HeartIcon,
      color: "bg-[#ef4444]",
      textColor: "text-[#ef4444]",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>

            <div className={`rounded-lg p-2 ${stat.color}`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>

          <CardContent>
            <div className={`text-3xl font-bold ${stat.textColor}`}>
              {cargando ? "—" : stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
"use client"

import { useAnimals } from "@/lib/animals-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, TrendingUp, Clock } from "lucide-react"

const calcularDias = (fechaInicio?: string, fechaFin?: string) => {
  if (!fechaInicio || !fechaFin) return null

  const inicio = new Date(fechaInicio).getTime()
  const fin = new Date(fechaFin).getTime()

  if (isNaN(inicio) || isNaN(fin)) return null

  return Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24))
}

export function TimeMetrics() {
  const { animales } = useAnimals()

  const hoy = new Date()

  const hace7Dias = new Date()
  hace7Dias.setDate(hoy.getDate() - 7)

  const hace30Dias = new Date()
  hace30Dias.setDate(hoy.getDate() - 30)

  const ultimos7Dias = animales.filter((animal) => {
    if (!animal.fecha_registro) return false
    return new Date(animal.fecha_registro) >= hace7Dias
  }).length

  const ultimos30Dias = animales.filter((animal) => {
    if (!animal.fecha_registro) return false
    return new Date(animal.fecha_registro) >= hace30Dias
  }).length

  const diasAdopcion = animales
    .filter((animal) => animal.estado === "adoptado")
    .map((animal) =>
      calcularDias(
        animal.fecha_alta_coordinacion || animal.fecha_registro,
        animal.fecha_adopcion
      )
    )
    .filter((dias): dias is number => dias !== null && dias >= 0)

  const promedioAdopcion =
    diasAdopcion.length > 0
      ? Math.round(
          diasAdopcion.reduce((total, dias) => total + dias, 0) /
            diasAdopcion.length
        )
      : 0

  const metrics = [
    {
      title: "Últimos 7 días",
      value: ultimos7Dias,
      subtitle: "animales agregados",
      icon: CalendarDays,
      trend: "Dato real",
      trendUp: true,
    },
    {
      title: "Últimos 30 días",
      value: ultimos30Dias,
      subtitle: "animales agregados",
      icon: TrendingUp,
      trend: "Dato real",
      trendUp: true,
    },
    {
      title: "Tiempo promedio de adopción",
      value: promedioAdopcion,
      subtitle: "días en promedio",
      icon: Clock,
      trend: "Dato real",
      trendUp: true,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.title} className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-2">
              <metric.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                {metric.value}
              </span>
              <span className="text-sm text-muted-foreground">
                {metric.subtitle}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`text-xs font-medium ${
                  metric.trendUp ? "text-[#3CB371]" : "text-[#ef4444]"
                }`}
              >
                {metric.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
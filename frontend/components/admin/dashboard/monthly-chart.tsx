"use client"

import { useAnimals } from "@/lib/animals-context"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export function MonthlyChart() {
  const { animales } = useAnimals()

  const añoActual = new Date().getFullYear()

  const meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ]

  const monthlyData = meses.map((mes, index) => {
    const agregados = animales.filter((animal) => {
      if (!animal.fecha_registro) return false

      const fecha = new Date(animal.fecha_registro)

      return (
        fecha.getMonth() === index &&
        fecha.getFullYear() === añoActual
      )
    }).length

    const adoptados = animales.filter((animal) => {
      if (!animal.fecha_adopcion) return false

      const fecha = new Date(animal.fecha_adopcion)

      return (
        fecha.getMonth() === index &&
        fecha.getFullYear() === añoActual
      )
    }).length

    return {
      mes,
      agregados,
      adoptados,
    }
  })

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Animales por Mes
        </CardTitle>
        <CardDescription>
          Distribución mensual de animales agregados y adoptados en {añoActual}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="mes"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{ color: "#1a1a2e", fontWeight: 600 }}
              />

              <Bar
                dataKey="agregados"
                name="Agregados"
                fill="#2F6FED"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="adoptados"
                name="Adoptados"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Agregados</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#ef4444]" />
            <span className="text-sm text-muted-foreground">Adoptados</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
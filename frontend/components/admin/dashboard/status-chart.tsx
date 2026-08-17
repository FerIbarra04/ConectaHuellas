"use client"

import { useAnimals } from "@/lib/animals-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = ["#3CB371", "#ef4444"]

export function StatusChart() {
  const { animales } = useAnimals()

  const disponibles = animales.filter((a) => a.estado === "disponible").length
  const adoptados = animales.filter((a) => a.estado === "adoptado").length
  const total = disponibles + adoptados

  const data = [
    { name: "Disponibles", value: disponibles, percentage: total > 0 ? Math.round((disponibles / total) * 100) : 0 },
    { name: "Adoptados", value: adoptados, percentage: total > 0 ? Math.round((adoptados / total) * 100) : 0 },
  ]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Estado de Animales
        </CardTitle>
        <CardDescription>
          Comparación entre animales disponibles y adoptados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number, name: string) => [`${value} animales`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {data.map((item, index) => (
            <div
              key={item.name}
              className={`flex flex-col items-center rounded-lg p-4 ${
  index === 0
    ? "bg-green-50"
    : "bg-red-50"
}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-sm font-medium text-foreground">
                  {item.name}
                </span>
              </div>
              <span className="mt-1 text-2xl font-bold text-foreground">
                {item.value}
              </span>
              <span className="text-sm text-muted-foreground">
                {item.percentage}% del total
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

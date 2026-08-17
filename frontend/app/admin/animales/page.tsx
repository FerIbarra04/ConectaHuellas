"use client"

import { AnimalsTable } from "@/components/admin/animals/animals-table"

export default function AnimalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Gestión de Animales
        </h1>
        <p className="text-muted-foreground">
          Administra los animales disponibles para adopción
        </p>
      </div>

      <AnimalsTable />
    </div>
  )
}

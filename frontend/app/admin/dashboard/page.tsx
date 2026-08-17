"use client"

import { StatsCards } from "@/components/admin/dashboard/stats-cards"
import { ExternalStatsCards } from "@/components/admin/dashboard/external-stats-cards"
import { RecentActivity } from "@/components/admin/dashboard/recent-activity"
import { TimeMetrics } from "@/components/admin/dashboard/time-metrics"
import { MonthlyChart } from "@/components/admin/dashboard/monthly-chart"
import { StatusChart } from "@/components/admin/dashboard/status-chart"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de administración de Conecta Huellas
        </p>
      </div>

      {/* Estadísticas de la Coordinación */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Estadísticas de la Coordinación
        </h2>

        <StatsCards />
      </div>

      {/* Estadísticas de Animales Externos */}
      <div>
        <h2 className="mb-1 text-lg font-semibold text-foreground">
          Estadísticas de Animales Externos
        </h2>

        <p className="mb-4 text-sm text-muted-foreground">
          Animales incorporados mediante solicitudes de ciudadanos y asociaciones.
        </p>

        <ExternalStatsCards />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Análisis de Tiempo
        </h2>

        <TimeMetrics />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyChart />
        <StatusChart />
      </div>

      <RecentActivity />
    </div>
  )
}
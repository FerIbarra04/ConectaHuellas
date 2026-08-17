"use client"

import { useEffect } from "react"

import { Input } from "@/components/ui/input"
import type { SolicitudFormData } from "@/components/solicitud/solicitud-wizard"

interface AnimalSolicitudFormProps {
  data: SolicitudFormData["animal"]
  onChange: (data: Partial<SolicitudFormData["animal"]>) => void
  onValidChange: (isValid: boolean) => void
}

export function AnimalSolicitudForm({
  data,
  onChange,
  onValidChange,
}: AnimalSolicitudFormProps) {
  useEffect(() => {
    const isValid =
      data.nombre.trim() !== "" &&
      data.edad.trim() !== "" &&
      data.tipo !== "" &&
      data.sexo !== "" &&
      data.tamano !== "" &&
      data.esterilizado !== ""

    onValidChange(isValid)
  }, [data, onValidChange])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#1F2937]">
          Información del animal
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
          Registra los datos principales del animal para que la Coordinación
          pueda revisar el caso.
        </p>
      </div>

      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">
              Nombre del animal
            </label>

            <Input
              className="mt-2"
              placeholder="Ej. Rocky, Luna, Max"
              value={data.nombre}
              onChange={(e) => onChange({ nombre: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Edad aproximada
            </label>

            <Input
              className="mt-2"
              placeholder="Ej. 2 años, 6 meses"
              value={data.edad}
              onChange={(e) => onChange({ edad: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Tipo de animal
            </label>

            <select
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={data.tipo}
              onChange={(e) => onChange({ tipo: e.target.value })}
            >
              <option value="">Selecciona una opción</option>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              Sexo
            </label>

            <select
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={data.sexo}
              onChange={(e) => onChange({ sexo: e.target.value })}
            >
              <option value="desconocido">Desconocido</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              Tamaño
            </label>

            <select
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={data.tamano}
              onChange={(e) => onChange({ tamano: e.target.value })}
            >
              <option value="">Selecciona tamaño</option>
              <option value="pequeño">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              ¿Está esterilizado?
            </label>

            <select
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={data.esterilizado}
              onChange={(e) => onChange({ esterilizado: e.target.value })}
            >
              <option value="no_se_sabe">No se sabe</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
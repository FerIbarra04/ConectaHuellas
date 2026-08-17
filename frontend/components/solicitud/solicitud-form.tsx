"use client"

import { useState } from "react"
import { Building2, UserRound, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type TipoSolicitante = "persona" | "agrupacion" | ""

export function SolicitanteForm() {
  const [tipo, setTipo] = useState<TipoSolicitante>("")
  const [agrupacionExistente, setAgrupacionExistente] = useState<"si" | "no" | "">("")

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#1F2937]">
          Información del solicitante
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
          Antes de comenzar, necesitamos conocer quién presenta esta solicitud.
          Esta información permitirá dar seguimiento al caso.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            setTipo("persona")
            setAgrupacionExistente("")
          }}
          className={`rounded-3xl border p-5 text-left transition-all ${
            tipo === "persona"
              ? "border-[#2563EB] bg-[#DBEAFE]/60 shadow-sm"
              : "border-[#E5E7EB] bg-white hover:border-[#2563EB]/40"
          }`}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DBEAFE]">
            <UserRound className="h-6 w-6 text-[#2563EB]" />
          </div>

          <h3 className="font-bold text-[#1F2937]">Persona particular</h3>
          <p className="mt-1 text-sm text-[#6B7280]">
            Presento esta solicitud como ciudadano.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setTipo("agrupacion")}
          className={`rounded-3xl border p-5 text-left transition-all ${
            tipo === "agrupacion"
              ? "border-[#2563EB] bg-[#DBEAFE]/60 shadow-sm"
              : "border-[#E5E7EB] bg-white hover:border-[#2563EB]/40"
          }`}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCFCE7]">
            <Building2 className="h-6 w-6 text-[#22C55E]" />
          </div>

          <h3 className="font-bold text-[#1F2937]">Agrupación protectora</h3>
          <p className="mt-1 text-sm text-[#6B7280]">
            Presento esta solicitud en representación de una agrupación.
          </p>
        </button>
      </div>

      {tipo === "agrupacion" && (
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <h3 className="font-bold text-[#1F2937]">
            ¿La agrupación ya está registrada?
          </h3>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              type="button"
              variant={agrupacionExistente === "si" ? "default" : "outline"}
              onClick={() => setAgrupacionExistente("si")}
            >
              Sí, buscar agrupación
            </Button>

            <Button
              type="button"
              variant={agrupacionExistente === "no" ? "default" : "outline"}
              onClick={() => setAgrupacionExistente("no")}
            >
              No, registrar nueva
            </Button>
          </div>

          {agrupacionExistente === "si" && (
            <div className="mt-6">
              <label className="text-sm font-medium text-[#1F2937]">
                Buscar agrupación
              </label>
              <Input
                className="mt-2"
                placeholder="Ej. Patitas Felices, Huellitas Chihuahua..."
              />
              <p className="mt-2 text-xs text-[#6B7280]">
                Después conectaremos este buscador con la base de datos.
              </p>
            </div>
          )}
        </div>
      )}

      {(tipo === "persona" ||
        (tipo === "agrupacion" && agrupacionExistente === "no")) && (
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <h3 className="mb-5 font-bold text-[#1F2937]">
            {tipo === "persona"
              ? "Datos de la persona"
              : "Datos de la agrupación"}
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[#1F2937]">
                {tipo === "persona"
                  ? "Nombre completo"
                  : "Nombre de la agrupación"}
              </label>
              <Input className="mt-2" placeholder="Escribe el nombre" />
            </div>

            {tipo === "agrupacion" && (
              <div>
                <label className="text-sm font-medium text-[#1F2937]">
                  Responsable
                </label>
                <Input className="mt-2" placeholder="Nombre del responsable" />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-[#1F2937]">
                Teléfono
              </label>
              <Input className="mt-2" placeholder="614 000 0000" />
            </div>

            <div>
              <label className="text-sm font-medium text-[#1F2937]">
                Correo electrónico
              </label>
              <Input className="mt-2" placeholder="correo@ejemplo.com" />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-[#1F2937]">
                Ubicación o dirección
              </label>
              <Input
                className="mt-2"
                placeholder="Colonia, calle o referencia de ubicación"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[#1F2937]">
                Identificación oficial / INE
              </label>
              <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4 text-sm text-[#6B7280] hover:border-[#2563EB]">
                <Upload className="h-4 w-4" />
                Subir archivo
                <input type="file" className="hidden" accept="image/*,.pdf" />
              </label>
            </div>

            <div>
              <label className="text-sm font-medium text-[#1F2937]">
                Comprobante de domicilio
              </label>
              <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4 text-sm text-[#6B7280] hover:border-[#2563EB]">
                <Upload className="h-4 w-4" />
                Subir archivo
                <input type="file" className="hidden" accept="image/*,.pdf" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
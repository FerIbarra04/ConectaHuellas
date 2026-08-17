"use client"

import { useEffect, useState } from "react"
import {
  Building2,
  CheckCircle2,
  Loader2,
  Search,
  Upload,
  UserRound,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { SolicitudFormData } from "@/components/solicitud/solicitud-wizard"
import {
  buscarSolicitantes,
  type Solicitante,
} from "@/lib/api"

interface SolicitanteFormProps {
  data: SolicitudFormData["solicitante"]
  onChange: (data: Partial<SolicitudFormData["solicitante"]>) => void
  onValidChange: (isValid: boolean) => void
}

export function SolicitanteForm({
  data,
  onChange,
  onValidChange,
}: SolicitanteFormProps) {
  const [resultados, setResultados] = useState<Solicitante[]>([])
  const [buscando, setBuscando] = useState(false)
  const [errorBusqueda, setErrorBusqueda] = useState("")

  useEffect(() => {
    let isValid = false

    if (data.tipo === "persona") {
      isValid = Boolean(
        data.nombre.trim() &&
          data.telefono.trim() &&
          data.correo.trim() &&
          data.ubicacion.trim() &&
          data.ineFile &&
          data.comprobanteFile
      )
    }

    if (
      data.tipo === "agrupacion" &&
      data.agrupacionExistente === "si"
    ) {
      isValid = Boolean(data.solicitanteId)
    }

    if (
      data.tipo === "agrupacion" &&
      data.agrupacionExistente === "no"
    ) {
      isValid = Boolean(
        data.nombre.trim() &&
          data.responsable.trim() &&
          data.telefono.trim() &&
          data.correo.trim() &&
          data.ubicacion.trim() &&
          data.ineFile &&
          data.comprobanteFile
      )
    }

    onValidChange(isValid)
  }, [data, onValidChange])

  useEffect(() => {
    if (
      data.tipo !== "agrupacion" ||
      data.agrupacionExistente !== "si"
    ) {
      setResultados([])
      return
    }

    if (data.busquedaAgrupacion.trim().length < 2) {
      setResultados([])
      return
    }

    const timeout = window.setTimeout(async () => {
      setBuscando(true)
      setErrorBusqueda("")

      try {
        const encontrados = await buscarSolicitantes(
          data.busquedaAgrupacion
        )

        setResultados(
          encontrados.filter(
            (solicitante) =>
              solicitante.tipo_solicitante === "agrupacion" &&
              solicitante.estado === "activo"
          )
        )
      } catch (error) {
        console.error(error)
        setErrorBusqueda("No se pudieron consultar las agrupaciones.")
      } finally {
        setBuscando(false)
      }
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [
    data.tipo,
    data.agrupacionExistente,
    data.busquedaAgrupacion,
  ])

  const seleccionarAgrupacion = (solicitante: Solicitante) => {
    onChange({
      solicitanteId: solicitante.id,
      solicitanteSeleccionado: solicitante.nombre,
      busquedaAgrupacion: solicitante.nombre,
      nombre: solicitante.nombre,
      responsable: solicitante.responsable || "",
      telefono: solicitante.telefono || "",
      correo: solicitante.correo || "",
      ubicacion: solicitante.ubicacion || "",
    })

    setResultados([])
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#1F2937]">
          Información del solicitante
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
          Antes de comenzar necesitamos conocer quién presenta esta solicitud.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <button
          type="button"
          onClick={() =>
            onChange({
              tipo: "persona",
              agrupacionExistente: "",
              solicitanteId: null,
              solicitanteSeleccionado: "",
              busquedaAgrupacion: "",
            })
          }
          className={`rounded-3xl border p-6 text-left transition-all ${
            data.tipo === "persona"
              ? "border-[#2563EB] bg-[#DBEAFE]/60 shadow-md"
              : "border-[#E5E7EB] hover:border-[#2563EB]/40"
          }`}
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DBEAFE]">
            <UserRound className="h-7 w-7 text-[#2563EB]" />
          </div>

          <h3 className="text-lg font-bold text-[#1F2937]">
            Persona particular
          </h3>

          <p className="mt-2 text-sm text-[#6B7280]">
            Presento esta solicitud como ciudadano.
          </p>
        </button>

        <button
          type="button"
          onClick={() =>
            onChange({
              tipo: "agrupacion",
              solicitanteId: null,
              solicitanteSeleccionado: "",
              busquedaAgrupacion: "",
            })
          }
          className={`rounded-3xl border p-6 text-left transition-all ${
            data.tipo === "agrupacion"
              ? "border-[#2563EB] bg-[#DBEAFE]/60 shadow-md"
              : "border-[#E5E7EB] hover:border-[#2563EB]/40"
          }`}
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCFCE7]">
            <Building2 className="h-7 w-7 text-[#22C55E]" />
          </div>

          <h3 className="text-lg font-bold text-[#1F2937]">
            Agrupación protectora
          </h3>

          <p className="mt-2 text-sm text-[#6B7280]">
            Presento esta solicitud en representación de una agrupación.
          </p>
        </button>
      </div>

      {data.tipo === "agrupacion" && (
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <h3 className="font-bold text-[#1F2937]">
            ¿La agrupación ya está registrada?
          </h3>

          <div className="mt-5 flex gap-3">
            <Button
              type="button"
              variant={
                data.agrupacionExistente === "si"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                onChange({
                  agrupacionExistente: "si",
                  solicitanteId: null,
                  solicitanteSeleccionado: "",
                  busquedaAgrupacion: "",
                  nombre: "",
                  responsable: "",
                  telefono: "",
                  correo: "",
                  ubicacion: "",
                  ineFile: null,
                  comprobanteFile: null,
                })
              }
            >
              Sí, buscar
            </Button>

            <Button
              type="button"
              variant={
                data.agrupacionExistente === "no"
                  ? "default"
                  : "outline"
              }
              onClick={() =>
                onChange({
                  agrupacionExistente: "no",
                  solicitanteId: null,
                  solicitanteSeleccionado: "",
                  busquedaAgrupacion: "",
                })
              }
            >
              No, registrar nueva
            </Button>
          </div>

          {data.agrupacionExistente === "si" && (
            <div className="relative mt-6">
              <label className="text-sm font-medium">
                Buscar agrupación
              </label>

              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />

                <Input
                  className="pl-9"
                  placeholder="Escribe al menos 2 letras..."
                  value={data.busquedaAgrupacion}
                  onChange={(e) =>
                    onChange({
                      busquedaAgrupacion: e.target.value,
                      solicitanteId: null,
                      solicitanteSeleccionado: "",
                    })
                  }
                />

                {buscando && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#2563EB]" />
                )}
              </div>

              {errorBusqueda && (
                <p className="mt-2 text-sm text-red-600">
                  {errorBusqueda}
                </p>
              )}

              {resultados.length > 0 && (
                <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-xl">
                  {resultados.map((solicitante) => (
                    <button
                      key={solicitante.id}
                      type="button"
                      onClick={() =>
                        seleccionarAgrupacion(solicitante)
                      }
                      className="w-full rounded-xl px-4 py-3 text-left transition-colors hover:bg-[#F3F4F6]"
                    >
                      <p className="font-semibold text-[#1F2937]">
                        {solicitante.nombre}
                      </p>

                      <p className="mt-1 text-xs text-[#6B7280]">
                        Responsable:{" "}
                        {solicitante.responsable || "No especificado"}
                      </p>
                    </button>
                  ))}
                </div>
              )}

              {data.solicitanteId && (
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#16A34A]" />

                  <div>
                    <p className="font-semibold text-[#166534]">
                      Agrupación seleccionada
                    </p>

                    <p className="mt-1 text-sm text-[#4B5563]">
                      {data.solicitanteSeleccionado}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {(data.tipo === "persona" ||
        (data.tipo === "agrupacion" &&
          data.agrupacionExistente === "no")) && (
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
          <h3 className="mb-6 text-lg font-bold text-[#1F2937]">
            {data.tipo === "persona"
              ? "Datos del solicitante"
              : "Datos de la agrupación"}
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">
                {data.tipo === "persona"
                  ? "Nombre completo"
                  : "Nombre de la agrupación"}
              </label>

              <Input
                className="mt-2"
                value={data.nombre}
                onChange={(e) =>
                  onChange({ nombre: e.target.value })
                }
              />
            </div>

            {data.tipo === "agrupacion" && (
              <div>
                <label className="text-sm font-medium">
                  Responsable
                </label>

                <Input
                  className="mt-2"
                  value={data.responsable}
                  onChange={(e) =>
                    onChange({ responsable: e.target.value })
                  }
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium">
                Teléfono
              </label>

              <Input
                className="mt-2"
                value={data.telefono}
                onChange={(e) =>
                  onChange({ telefono: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Correo electrónico
              </label>

              <Input
                className="mt-2"
                value={data.correo}
                onChange={(e) =>
                  onChange({ correo: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">
                Ubicación
              </label>

              <Input
                className="mt-2"
                value={data.ubicacion}
                onChange={(e) =>
                  onChange({ ubicacion: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Identificación oficial
              </label>

              <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed p-5 text-sm">
                <Upload className="h-4 w-4" />

                {data.ineFile
                  ? data.ineFile.name
                  : "Seleccionar archivo"}

                <input
                  className="hidden"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) =>
                    onChange({
                      ineFile: e.target.files?.[0] || null,
                    })
                  }
                />
              </label>
            </div>

            <div>
              <label className="text-sm font-medium">
                Comprobante de domicilio
              </label>

              <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed p-5 text-sm">
                <Upload className="h-4 w-4" />

                {data.comprobanteFile
                  ? data.comprobanteFile.name
                  : "Seleccionar archivo"}

                <input
                  className="hidden"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) =>
                    onChange({
                      comprobanteFile:
                        e.target.files?.[0] || null,
                    })
                  }
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
"use client"

import { useEffect, useState } from "react"
import {
  Building2,
  CheckCircle2,
  FileText,
  ImageIcon,
  MapPin,
  PawPrint,
  UserRound,
  Video,
} from "lucide-react"

import type { SolicitudFormData } from "@/components/solicitud/solicitud-wizard"

interface ResumenSolicitudProps {
  data: SolicitudFormData
  onValidChange: (isValid: boolean) => void
}

const formatValue = (value: string) => {
  if (!value) return "No especificado"

  return value
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase())
}

export function ResumenSolicitud({
  data,
  onValidChange,
}: ResumenSolicitudProps) {
  const [informacionVerdadera, setInformacionVerdadera] = useState(false)
  const [avisoPrivacidad, setAvisoPrivacidad] = useState(false)

  useEffect(() => {
    onValidChange(informacionVerdadera && avisoPrivacidad)
  }, [informacionVerdadera, avisoPrivacidad, onValidChange])

  const esAgrupacion = data.solicitante.tipo === "agrupacion"
  const esAgrupacionExistente =
    esAgrupacion && data.solicitante.agrupacionExistente === "si"

  const nombreSolicitante = esAgrupacionExistente
    ? data.solicitante.busquedaAgrupacion
    : data.solicitante.nombre

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#1F2937]">
          Revisa tu solicitud
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
          Verifica que la información sea correcta antes de enviarla a la
          Coordinación de Medio Ambiente y Protección Animal.
        </p>
      </div>

      {/* Solicitante */}
      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DBEAFE]">
            {esAgrupacion ? (
              <Building2 className="h-5 w-5 text-[#2563EB]" />
            ) : (
              <UserRound className="h-5 w-5 text-[#2563EB]" />
            )}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
              Solicitante
            </p>
            <h3 className="font-bold text-[#1F2937]">
              {nombreSolicitante || "Sin nombre"}
            </h3>
          </div>
        </div>

        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <SummaryItem
            label="Tipo"
            value={
              esAgrupacion ? "Agrupación protectora" : "Persona particular"
            }
          />

          {esAgrupacion && !esAgrupacionExistente && (
            <SummaryItem
              label="Responsable"
              value={data.solicitante.responsable}
            />
          )}

          {!esAgrupacionExistente && (
            <>
              <SummaryItem
                label="Teléfono"
                value={data.solicitante.telefono}
              />

              <SummaryItem
                label="Correo"
                value={data.solicitante.correo}
              />

              <div className="sm:col-span-2">
                <SummaryItem
                  label="Ubicación"
                  value={data.solicitante.ubicacion}
                />
              </div>
            </>
          )}
        </div>

        {!esAgrupacionExistente && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <FileStatus
              label="Identificación oficial"
              filename={data.solicitante.ineFile?.name}
            />

            <FileStatus
              label="Comprobante de domicilio"
              filename={data.solicitante.comprobanteFile?.name}
            />
          </div>
        )}
      </section>

      {/* Animal */}
      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DCFCE7]">
            <PawPrint className="h-5 w-5 text-[#22C55E]" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#22C55E]">
              Animal
            </p>
            <h3 className="font-bold text-[#1F2937]">
              {data.animal.nombre || "Sin nombre"}
            </h3>
          </div>
        </div>

        <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <SummaryItem
            label="Tipo"
            value={formatValue(data.animal.tipo)}
          />

          <SummaryItem
            label="Sexo"
            value={formatValue(data.animal.sexo)}
          />

          <SummaryItem
            label="Edad aproximada"
            value={data.animal.edad}
          />

          <SummaryItem
            label="Tamaño"
            value={formatValue(data.animal.tamano)}
          />

          <SummaryItem
            label="Esterilizado"
            value={
              data.animal.esterilizado === "si"
                ? "Sí"
                : data.animal.esterilizado === "no"
                  ? "No"
                  : "No se sabe"
            }
          />
        </div>
      </section>

      {/* Caso y ubicación */}
      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FEF3C7]">
            <MapPin className="h-5 w-5 text-[#D97706]" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#D97706]">
              Información del caso
            </p>
            <h3 className="font-bold text-[#1F2937]">
              Lugar de estancia y descripción
            </h3>
          </div>
        </div>

        <div className="space-y-5">
          <SummaryItem
            label="Lugar donde se encuentra"
            value={data.documentos.lugarEstancia}
          />

          <SummaryItem
            label="Descripción del caso"
            value={data.documentos.descripcion}
          />
        </div>
      </section>

      {/* Archivos */}
      <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-[#7C3AED]">
            Evidencia y documentos
          </p>

          <h3 className="mt-1 font-bold text-[#1F2937]">
            Archivos seleccionados
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#F8FAFC] p-4">
            <ImageIcon className="mb-3 h-5 w-5 text-[#2563EB]" />

            <p className="text-sm font-semibold text-[#1F2937]">
              Fotografías
            </p>

            <p className="mt-1 text-sm text-[#6B7280]">
              {data.documentos.fotos.length} archivo
              {data.documentos.fotos.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] p-4">
            <Video className="mb-3 h-5 w-5 text-[#7C3AED]" />

            <p className="text-sm font-semibold text-[#1F2937]">
              Video
            </p>

            <p className="mt-1 break-words text-sm text-[#6B7280]">
              {data.documentos.video
                ? data.documentos.video.name
                : "No agregado"}
            </p>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] p-4">
            <FileText className="mb-3 h-5 w-5 text-[#22C55E]" />

            <p className="text-sm font-semibold text-[#1F2937]">
              Cartilla
            </p>

            <p className="mt-1 break-words text-sm text-[#6B7280]">
              {data.documentos.cartilla
                ? data.documentos.cartilla.name
                : "No agregada"}
            </p>
          </div>
        </div>

        {data.documentos.fotos.length > 0 && (
          <div className="mt-5 space-y-2">
            {data.documentos.fotos.map((foto, index) => (
              <div
                key={`${foto.name}-${index}`}
                className="rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm text-[#4B5563]"
              >
                Foto {index + 1}: {foto.name}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Confirmaciones */}
      <section className="rounded-3xl border border-[#BFDBFE] bg-[#EFF6FF] p-6">
        <h3 className="font-bold text-[#1F2937]">
          Confirmación de la información
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
          Para enviar la solicitud debes aceptar las siguientes declaraciones.
        </p>

        <div className="mt-5 space-y-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={informacionVerdadera}
              onChange={(event) =>
                setInformacionVerdadera(event.target.checked)
              }
              className="mt-1 h-4 w-4 rounded border-[#CBD5E1] accent-[#2563EB]"
            />

            <span className="text-sm leading-relaxed text-[#4B5563]">
              Declaro que la información y los documentos proporcionados son
              verdaderos y corresponden al caso presentado.
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={avisoPrivacidad}
              onChange={(event) => setAvisoPrivacidad(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#CBD5E1] accent-[#2563EB]"
            />

            <span className="text-sm leading-relaxed text-[#4B5563]">
              Acepto el tratamiento de los datos proporcionados para la
              revisión, seguimiento y resolución de esta solicitud.
            </span>
          </label>
        </div>
      </section>
    </div>
  )
}

function SummaryItem({
  label,
  value,
}: {
  label: string
  value?: string | null
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
        {label}
      </p>

      <p className="mt-1 whitespace-pre-line leading-relaxed text-[#374151]">
        {value?.trim() || "No especificado"}
      </p>
    </div>
  )
}

function FileStatus({
  label,
  filename,
}: {
  label: string
  filename?: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#F8FAFC] p-4">
      <CheckCircle2
        className={`mt-0.5 h-5 w-5 ${
          filename ? "text-[#22C55E]" : "text-[#9CA3AF]"
        }`}
      />

      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#1F2937]">
          {label}
        </p>

        <p className="mt-1 break-words text-xs text-[#6B7280]">
          {filename || "No agregado"}
        </p>
      </div>
    </div>
  )
}
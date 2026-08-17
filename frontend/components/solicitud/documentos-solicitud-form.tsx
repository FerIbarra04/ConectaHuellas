"use client"

import { useEffect } from "react"
import { Upload } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { SolicitudFormData } from "@/components/solicitud/solicitud-wizard"

interface DocumentosSolicitudFormProps {
  data: SolicitudFormData["documentos"]
  onChange: (data: Partial<SolicitudFormData["documentos"]>) => void
  onValidChange: (isValid: boolean) => void
}

export function DocumentosSolicitudForm({
  data,
  onChange,
  onValidChange,
}: DocumentosSolicitudFormProps) {
  useEffect(() => {
    const isValid =
      data.lugarEstancia.trim() !== "" &&
      data.descripcion.trim() !== "" &&
      data.fotos.length >= 2 &&
      data.fotos.length <= 3

    onValidChange(isValid)
  }, [data, onValidChange])

  const agregarFotos = (files: FileList | null) => {
    if (!files) return

    const nuevasFotos = Array.from(files)

    if (data.fotos.length + nuevasFotos.length > 3) {
      alert("Solo puedes agregar máximo 3 fotos.")
      return
    }

    onChange({
      fotos: [...data.fotos, ...nuevasFotos],
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-[#1F2937]">
          Documentos y evidencia
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
          Agrega la información que ayudará a CMAYPA a revisar el caso del
          animal.
        </p>
      </div>

      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
        <div className="grid gap-5">
          <div>
            <label className="text-sm font-medium">
              Lugar donde se encuentra el animal
            </label>

            <Input
              className="mt-2"
              placeholder="Ej. Colonia, domicilio, refugio o referencia"
              value={data.lugarEstancia}
              onChange={(e) => onChange({ lugarEstancia: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Descripción del caso</label>

            <Textarea
              className="mt-2"
              rows={5}
              placeholder="Describe la situación del animal, comportamiento, necesidades o información importante..."
              value={data.descripcion}
              onChange={(e) => onChange({ descripcion: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Fotografías del animal / Mínimo 2 y máximo 3
            </label>

            <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-sm text-[#6B7280] hover:border-[#2563EB]">
              <Upload className="h-4 w-4" />
              Seleccionar fotos

              <input
                className="hidden"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => agregarFotos(e.target.files)}
              />
            </label>

            <div className="mt-3 space-y-2">
              {data.fotos.map((foto, index) => (
                <div
                  key={`${foto.name}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm"
                >
                  <span className="text-[#4B5563]">
                    Foto {index + 1}: {foto.name}
                  </span>

                  <button
                    type="button"
                    className="text-sm font-medium text-red-500 hover:text-red-600"
                    onClick={() =>
                      onChange({
                        fotos: data.fotos.filter((_, i) => i !== index),
                      })
                    }
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Video del animal / Opcional, máximo 1
            </label>

            <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-sm text-[#6B7280] hover:border-[#2563EB]">
              <Upload className="h-4 w-4" />
              {data.video ? data.video.name : "Seleccionar video"}

              <input
                className="hidden"
                type="file"
                accept="video/*"
                onChange={(e) =>
                  onChange({ video: e.target.files?.[0] || null })
                }
              />
            </label>

            {data.video && (
              <button
                type="button"
                className="mt-2 text-sm font-medium text-red-500 hover:text-red-600"
                onClick={() => onChange({ video: null })}
              >
                Quitar video
              </button>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Cartilla de vacunación / Opcional
            </label>

            <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-5 text-sm text-[#6B7280] hover:border-[#2563EB]">
              <Upload className="h-4 w-4" />
              {data.cartilla ? data.cartilla.name : "Seleccionar archivo"}

              <input
                className="hidden"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) =>
                  onChange({ cartilla: e.target.files?.[0] || null })
                }
              />
            </label>

            {data.cartilla && (
              <button
                type="button"
                className="mt-2 text-sm font-medium text-red-500 hover:text-red-600"
                onClick={() => onChange({ cartilla: null })}
              >
                Quitar cartilla
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
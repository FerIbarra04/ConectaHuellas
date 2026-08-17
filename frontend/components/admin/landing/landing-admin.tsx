"use client"

import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import {
  CheckCircle2,
  FileText,
  Home,
  Loader2,
  Megaphone,
  Plus,
  Save,
  Trash2,
  Upload,
  Workflow,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  addLandingDestacado,
  deleteLandingDestacado,
  getAnimales,
  getLanding,
  updateLanding,
  uploadFile,
  updateLandingDestacado,
  type LandingConfig,
  type LandingContenidoItem,
} from "@/lib/api"
import type { Animal } from "@/lib/types"
import { SuccessDialog } from "@/components/ui/success-dialog"

export function LandingAdmin() {
  const router = useRouter()

  const [animales, setAnimales] = useState<Animal[]>([])
  const [animalSeleccionado, setAnimalSeleccionado] =
    useState("")
  const [imagenDestacado, setImagenDestacado] =
    useState<File | null>(null)
  const [agregandoDestacado, setAgregandoDestacado] =
    useState(false)
  const [eliminandoDestacadoId, setEliminandoDestacadoId] =
    useState<number | null>(null)
  const [landing, setLanding] =
    useState<LandingConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  useEffect(() => {
    let mounted = true

    const cargarLanding = async () => {
      try {
        setLoading(true)
        setError("")

        const [landingData, animalesData] = await Promise.all([
  getLanding(),
  getAnimales(),
])

if (!mounted) return

setLanding(landingData)
setAnimales(animalesData)
      } catch (error) {
        console.error(
          "Error cargando landing:",
          error,
        )

        if (mounted) {
          setError(
            error instanceof Error
              ? error.message
              : "No se pudo cargar el landing.",
          )
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    cargarLanding()

    return () => {
      mounted = false
    }
  }, [])
  const recargarLanding = async () => {
  const data = await getLanding()
  setLanding(data)
}
const agregarAnimalDestacado = async () => {
  if (!landing || agregandoDestacado) return

  if (landing.animales_destacados.length >= 3) {
    alert("Solo puedes tener máximo 3 animales destacados.")
    return
  }

  const animalId = Number(animalSeleccionado)

  if (!Number.isInteger(animalId) || animalId <= 0) {
    alert("Selecciona un animal.")
    return
  }

  if (!imagenDestacado) {
    alert("Selecciona la imagen sin fondo del animal.")
    return
  }

  try {
    setAgregandoDestacado(true)
    setError("")

    const uploaded = await uploadFile(imagenDestacado)

    const siguienteOrden =
      landing.animales_destacados.length + 1

    await addLandingDestacado({
      animal_id: animalId,
      imagen_sin_fondo_url: uploaded.url,
      orden: siguienteOrden,
    })

    await recargarLanding()

    setAnimalSeleccionado("")
    setImagenDestacado(null)

setShowSuccessDialog(true)
  } catch (error) {
    console.error(
      "Error agregando animal destacado:",
      error,
    )

    setError(
      error instanceof Error
        ? error.message
        : "No se pudo agregar el animal destacado.",
    )
  } finally {
    setAgregandoDestacado(false)
  }
}
const quitarAnimalDestacado = async (
  destacadoId: number,
) => {
  if (eliminandoDestacadoId !== null) return

  const confirmado = window.confirm(
    "¿Deseas quitar este animal de los destacados del landing?",
  )

  if (!confirmado) return

  try {
    setEliminandoDestacadoId(destacadoId)
    setError("")

    await deleteLandingDestacado(destacadoId)
    await recargarLanding()
  } catch (error) {
    console.error(
      "Error quitando animal destacado:",
      error,
    )

    setError(
      error instanceof Error
        ? error.message
        : "No se pudo quitar el animal destacado.",
    )
  } finally {
    setEliminandoDestacadoId(null)
  }
}
const moverAnimalDestacado = async (
  index: number,
  direccion: "izquierda" | "derecha",
) => {
  if (!landing) return

  const destacados = [
    ...landing.animales_destacados,
  ].sort((a, b) => a.orden - b.orden)

  const nuevoIndex =
    direccion === "izquierda"
      ? index - 1
      : index + 1

  if (
    nuevoIndex < 0 ||
    nuevoIndex >= destacados.length
  ) {
    return
  }

  const actual = destacados[index]
  const intercambio = destacados[nuevoIndex]

  try {
    setError("")

    await Promise.all([
      updateLandingDestacado(actual.id, {
        imagen_sin_fondo_url:
          actual.imagen_sin_fondo_url,
        orden: intercambio.orden,
      }),

      updateLandingDestacado(intercambio.id, {
        imagen_sin_fondo_url:
          intercambio.imagen_sin_fondo_url,
        orden: actual.orden,
      }),
    ])

    await recargarLanding()
  } catch (error) {
    console.error(
      "Error reordenando destacados:",
      error,
    )

    setError(
      error instanceof Error
        ? error.message
        : "No se pudo cambiar el orden de los destacados.",
    )
  }
}

const guardarCambios = async () => {
  if (!landing || saving) return

  try {
    setSaving(true)
    setError("")

    console.log("Abriendo modal...")
  setShowSuccessDialog(true)

    await updateLanding({
      hero: landing.hero,
      proposito: landing.proposito,
      proceso_adopcion: landing.proceso_adopcion,
      concientizacion: landing.concientizacion,
      footer: landing.footer,
    })

    await recargarLanding()
    router.refresh()

  } catch (error) {
    console.error(
      "Error guardando landing:",
      error,
    )

    setError(
      error instanceof Error
        ? error.message
        : "No se pudieron guardar los cambios.",
    )
  } finally {
    setSaving(false)
  }
}

  const actualizarProposito = (
    index: number,
    field: keyof LandingContenidoItem,
    value: string,
  ) => {
    if (!landing) return

    setLanding((prev) => {
      if (!prev) return prev

      const items = [...prev.proposito]

      items[index] = {
        ...items[index],
        [field]: value,
      }

      return {
        ...prev,
        proposito: items,
      }
    })
  }

  const actualizarProceso = (
    index: number,
    field: keyof LandingContenidoItem,
    value: string,
  ) => {
    if (!landing) return

    setLanding((prev) => {
      if (!prev) return prev

      const items = [
        ...prev.proceso_adopcion,
      ]

      items[index] = {
        ...items[index],
        [field]: value,
      }

      return {
        ...prev,
        proceso_adopcion: items,
      }
    })
  }

  const actualizarConcientizacion = (
    index: number,
    field: keyof LandingContenidoItem,
    value: string,
  ) => {
    if (!landing) return

    setLanding((prev) => {
      if (!prev) return prev

      const items = [
        ...prev.concientizacion,
      ]

      items[index] = {
        ...items[index],
        [field]: value,
      }

      return {
        ...prev,
        concientizacion: items,
      }
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#2563EB]" />

          <p className="mt-3 text-sm text-[#6B7280]">
            Cargando contenido del landing...
          </p>
        </div>
      </div>
    )
  }

  if (error && !landing) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    )
  }

  if (!landing) {
    return null
  }
  const idsDestacados = new Set(
  landing.animales_destacados.map(
    (animal) => animal.animal_id,
  ),
)

const animalesDisponibles = animales.filter(
  (animal) =>
    !idsDestacados.has(animal.id) &&
    animal.estado === "disponible",
)

  return (
    <div className="space-y-8 pb-28">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2563EB]">
          Administración
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#1F2937]">
          Landing Page
        </h1>

        <p className="mt-2 max-w-2xl text-[#6B7280]">
          Edita el contenido textual de la página
          principal de Conecta Huellas. La estructura
          y el diseño visual permanecen protegidos.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {/* HERO */}
      <Card className="rounded-3xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DBEAFE]">
              <Home className="h-5 w-5 text-[#2563EB]" />
            </div>

            <div>
              <CardTitle>Hero principal</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Contenido principal de bienvenida.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <CampoTexto
            label="Título principal"
            value={landing.hero.titulo}
            placeholder="Cada huella merece una segunda oportunidad"
            onChange={(value) =>
              setLanding((prev) =>
                prev
                  ? {
                      ...prev,
                      hero: {
                        ...prev.hero,
                        titulo: value,
                      },
                    }
                  : prev,
              )
            }
          />

          <CampoArea
            label="Descripción"
            value={landing.hero.descripcion}
            placeholder="Conecta Huellas ayuda a encontrar un hogar lleno de amor para perros y gatos bajo resguardo de la Coordinacion de Medio Ambiente y Protección Animal."
            onChange={(value) =>
              setLanding((prev) =>
                prev
                  ? {
                      ...prev,
                      hero: {
                        ...prev.hero,
                        descripcion: value,
                      },
                    }
                  : prev,
              )
            }
          />

          <CampoArea
            label="Frase destacada"
            value={landing.hero.frase}
            placeholder="Adoptar no cambia el mundo, pero cambia el mundo de un animal."
            onChange={(value) =>
              setLanding((prev) =>
                prev
                  ? {
                      ...prev,
                      hero: {
                        ...prev.hero,
                        frase: value,
                      },
                    }
                  : prev,
              )
            }
          />

          <VistaPreviaTexto
            titulo={landing.hero.titulo}
            descripcion={landing.hero.descripcion}
            frase={landing.hero.frase}
          />
        </CardContent>
      </Card>

      {/* ANIMALES DESTACADOS */}
<Card className="rounded-3xl">
  <CardHeader>
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#DCFCE7]">
        <span className="text-xl">🐾</span>
      </div>

      <div>
        <CardTitle>Animales destacados</CardTitle>

        <p className="mt-1 text-sm text-muted-foreground">
          Selecciona hasta 3 animales para mostrarlos en el hero
          utilizando una imagen especial sin fondo.
        </p>
      </div>
    </div>
  </CardHeader>

  <CardContent className="space-y-6">
    {/* AGREGAR DESTACADO */}
    {landing.animales_destacados.length < 3 && (
      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5">
        <div className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-[#2563EB]" />

          <h3 className="font-bold text-[#1F2937]">
            Agregar animal destacado
          </h3>
        </div>

<div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
            <label className="text-sm font-semibold text-[#374151]">
              Animal
            </label>

            <select
              value={animalSeleccionado}
              onChange={(event) =>
                setAnimalSeleccionado(event.target.value)
              }
              className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              disabled={agregandoDestacado}
            >
              <option value="">
                Selecciona un animal
              </option>

              {animalesDisponibles.map((animal) => (
                <option
                  key={animal.id}
                  value={animal.id}
                >
                  {animal.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#374151]">
              Imagen sin fondo
            </label>

            <Input
              type="file"
              accept="image/png,image/webp"
              className="mt-2"
              disabled={agregandoDestacado}
              onChange={(event) =>
                setImagenDestacado(
                  event.target.files?.[0] || null,
                )
              }
            />
          </div>
        </div>

        {imagenDestacado && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#DBEAFE] bg-white p-3">
            <Upload className="h-5 w-5 text-[#2563EB]" />

            <div>
              <p className="text-sm font-semibold text-[#1F2937]">
                Imagen seleccionada
              </p>

              <p className="text-xs text-[#6B7280]">
                {imagenDestacado.name}
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            onClick={agregarAnimalDestacado}
            disabled={
              agregandoDestacado ||
              !animalSeleccionado ||
              !imagenDestacado
            }
          >
            {agregandoDestacado ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Agregando...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Agregar destacado
              </>
            )}
          </Button>
        </div>
      </div>
    )}

    {/* LÍMITE */}
    {landing.animales_destacados.length >= 3 && (
      <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-800">
        Ya tienes los 3 animales destacados permitidos.
        Quita uno para agregar otro.
      </div>
    )}

    {/* DESTACADOS ACTUALES */}
    {landing.animales_destacados.length === 0 ? (
      <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-8 text-center">
        <span className="text-3xl">🐶</span>

        <p className="mt-3 font-semibold text-[#1F2937]">
          No hay animales destacados
        </p>

        <p className="mt-2 text-sm text-[#6B7280]">
          Selecciona un animal disponible y agrega su imagen
          sin fondo.
        </p>
      </div>
    ) : (
      <div className="grid gap-4 md:grid-cols-3">
        {[...landing.animales_destacados]
  .sort((a, b) => a.orden - b.orden)
  .map((animal, index) => (
          <div
            key={animal.id}
            className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white"
          >
            <div className="relative flex h-56 items-center justify-center bg-gradient-to-b from-[#DBEAFE] to-[#DCFCE7] p-5">
              <img
                src={animal.imagen_sin_fondo_url}
                alt={animal.nombre}
                className="h-full w-full object-contain"
              />

              <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#2563EB] shadow-sm">
                Posición {animal.orden}
              </div>
            </div>

            <div className="p-4">
              <p className="text-lg font-bold text-[#1F2937]">
                {animal.nombre}
              </p>

              <p className="mt-1 text-sm text-[#6B7280]">
                {animal.edad || "Edad no especificada"}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
  <Button
    type="button"
    variant="outline"
    size="sm"
    disabled={index === 0}
    onClick={() =>
      moverAnimalDestacado(
        index,
        "izquierda",
      )
    }
  >
    <ArrowLeft className="mr-2 h-4 w-4" />
    Mover
  </Button>

  <Button
    type="button"
    variant="outline"
    size="sm"
    disabled={
      index ===
      landing.animales_destacados.length - 1
    }
    onClick={() =>
      moverAnimalDestacado(
        index,
        "derecha",
      )
    }
  >
    Mover
    <ArrowRight className="ml-2 h-4 w-4" />
  </Button>

  <Button
    type="button"
    variant="outline"
    size="sm"
    className="col-span-2 text-red-600 hover:bg-red-50 hover:text-red-700"
    disabled={
      eliminandoDestacadoId === animal.id
    }
    onClick={() =>
      quitarAnimalDestacado(animal.id)
    }
  >
    {eliminandoDestacadoId === animal.id ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Quitando...
      </>
    ) : (
      <>
        <Trash2 className="mr-2 h-4 w-4" />
        Quitar de destacados
      </>
    )}
  </Button>
</div>
            </div>
          </div>
        ))}
      </div>
    )}
  </CardContent>
</Card>

      {/* PROPÓSITO */}
      <SeccionItems
        icon={
          <Megaphone className="h-5 w-5 text-[#7C3AED]" />
        }
        iconBg="bg-[#EDE9FE]"
        title="Propósito de Conecta Huellas"
        description="Edita el título y la descripción de las tres tarjetas."
        items={landing.proposito}
        onChange={actualizarProposito}
      />

      {/* PROCESO */}
      <SeccionItems
        icon={
          <Workflow className="h-5 w-5 text-[#D97706]" />
        }
        iconBg="bg-[#FEF3C7]"
        title="Proceso de adopción"
        description="Contenido descriptivo de los cuatro pasos del proceso."
        items={landing.proceso_adopcion}
        onChange={actualizarProceso}
        showNumber
      />

      {/* CONCIENTIZACIÓN */}
      <SeccionItems
        icon={
          <FileText className="h-5 w-5 text-[#DC2626]" />
        }
        iconBg="bg-red-100"
        title="Concientización"
        description="Contenido educativo mostrado en las tarjetas de la página principal."
        items={landing.concientizacion}
        onChange={actualizarConcientizacion}
      />

      {/* FOOTER */}
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Footer</CardTitle>

          <p className="text-sm text-muted-foreground">
            Información institucional y enlaces de
            contacto.
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          <CampoArea
            label="Descripción institucional"
            value={landing.footer.descripcion}
            onChange={(value) =>
              setLanding((prev) =>
                prev
                  ? {
                      ...prev,
                      footer: {
                        ...prev.footer,
                        descripcion: value,
                      },
                    }
                  : prev,
              )
            }
          />

          <CampoArea
            label="Frase"
            value={landing.footer.frase}
            onChange={(value) =>
              setLanding((prev) =>
                prev
                  ? {
                      ...prev,
                      footer: {
                        ...prev.footer,
                        frase: value,
                      },
                    }
                  : prev,
              )
            }
          />

          <CampoTexto
            label="Correo de contacto"
            value={landing.footer.correo}
            onChange={(value) =>
              setLanding((prev) =>
                prev
                  ? {
                      ...prev,
                      footer: {
                        ...prev.footer,
                        correo: value,
                      },
                    }
                  : prev,
              )
            }
          />

          <CampoTexto
            label="URL de Facebook"
            value={landing.footer.facebook_url}
            placeholder="https://facebook.com/..."
            onChange={(value) =>
              setLanding((prev) =>
                prev
                  ? {
                      ...prev,
                      footer: {
                        ...prev.footer,
                        facebook_url: value,
                      },
                    }
                  : prev,
              )
            }
          />

          <CampoTexto
            label="URL de Instagram"
            value={landing.footer.instagram_url}
            placeholder="https://instagram.com/..."
            onChange={(value) =>
              setLanding((prev) =>
                prev
                  ? {
                      ...prev,
                      footer: {
                        ...prev.footer,
                        instagram_url: value,
                      },
                    }
                  : prev,
              )
            }
          />
        </CardContent>
      </Card>

      {/* GUARDADO FIJO */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E5E7EB] bg-white/95 px-4 py-4 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="hidden text-sm text-[#6B7280] sm:block">
            Los cambios se aplicarán al contenido de la
            página principal.
          </p>

          <Button
            type="button"
            onClick={guardarCambios}
            disabled={saving}
            className="ml-auto min-w-[180px]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>

      </div>
        <SuccessDialog
      open={showSuccessDialog}
      onOpenChange={setShowSuccessDialog}
      title="Landing Page actualizada"
      description="Los cambios ya están disponibles para los visitantes del sitio."
      onView={() => window.open("/", "_blank")}
    />
    </div>
    
  )
}

function CampoTexto({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = "",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {multiline ? (
        <Textarea
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
        />
      ) : (
        <Input
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
        />
      )}
    </div>
  )
}

function CampoArea({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#374151]">
        {label}
      </label>

      <Textarea
        className="mt-2 min-h-[110px] resize-none"
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </div>
  )
}

function VistaPreviaTexto({
  titulo,
  descripcion,
  frase,
}: {
  titulo: string
  descripcion: string
  frase: string
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">
        Vista previa del contenido
      </p>

      <h3 className="mt-4 text-2xl font-extrabold text-[#1F2937]">
        {titulo}
      </h3>

      <p className="mt-3 max-w-2xl leading-relaxed text-[#6B7280]">
        {descripcion}
      </p>

     <p className="mt-5 font-semibold italic text-[#374151]">
  “{(frase || "").replaceAll("“", "").replaceAll("”", "")}”
</p>
    </div>
  )
}

function SeccionItems({
  icon,
  iconBg,
  title,
  description,
  items,
  onChange,
  showNumber = false,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  description: string
  items: LandingContenidoItem[]
  onChange: (
    index: number,
    field: keyof LandingContenidoItem,
    value: string,
  ) => void
  showNumber?: boolean
}) {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${iconBg}`}
          >
            {icon}
          </div>

          <div>
            <CardTitle>{title}</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-5"
          >
            {showNumber && (
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#2563EB]">
                Paso {String(index + 1).padStart(2, "0")}
              </p>
            )}

            <div className="space-y-4">
  <CampoTexto
    label="Título"
    value={item.titulo}
    placeholder={getPlaceholderTitulo(title, index)}
    onChange={(value) =>
      onChange(index, "titulo", value)
    }
  />

  <CampoArea
    label="Descripción"
    value={item.descripcion}
    placeholder={getPlaceholderDescripcion(title, index)}
    onChange={(value) =>
      onChange(
        index,
        "descripcion",
        value,
      )
    }
  />
</div>
          </div>
        ))}
      </CardContent>
    </Card>
    
  )
}

function getPlaceholderTitulo(
  sectionTitle: string,
  index: number,
) {
  const placeholders: Record<string, string[]> = {
    "Propósito de Conecta Huellas": [
      "Dar una segunda oportunidad",
      "Fomentar la tenencia responsable",
      "Crear conciencia",
    ],

    "Proceso de adopción": [
      "Explora los animales disponibles",
      "Encuentra a tu compañero ideal",
      "Ponte en contacto",
      "Comienza una nueva historia",
    ],

    Concientización: [
      "Adopción responsable",
      "No al abandono",
      "Cuidado y compromiso",
    ],
  }

  return placeholders[sectionTitle]?.[index] || ""
}

function getPlaceholderDescripcion(
  sectionTitle: string,
  index: number,
) {
  const placeholders: Record<string, string[]> = {
    "Propósito de Conecta Huellas": [
      "Promovemos la adopción responsable y el cuidado de cada animal bajo nuestro resguardo.",
      "Adoptar es un compromiso para toda la vida, lleno de amor, cuidado y responsabilidad.",
      "Pequeñas acciones generan grandes cambios para los animales y el medio ambiente.",
    ],

    "Proceso de adopción": [
      "Navega el catálogo de animales bajo resguardo y encuentra a quien conecte contigo.",
      "Conoce su historia, características y necesidades antes de tomar una decisión.",
      "Comunícate con la Coordinación para iniciar el proceso de adopción responsable.",
      "Abre las puertas de tu hogar y dale una segunda oportunidad a una vida que lo necesita.",
    ],

    Concientización: [
      "Adoptar a un animal es una decisión de vida. Implica tiempo, dedicación, atención veterinaria y amor incondicional.",
      "Abandonar a una mascota es una forma de maltrato. Antes de adoptar, reflexiona si estás preparado para este compromiso.",
      "Una mascota necesita alimentación, atención veterinaria, ejercicio y mucho afecto. El cuidado es un acto diario de amor.",
    ],
  }

  
  return placeholders[sectionTitle]?.[index] || ""
}
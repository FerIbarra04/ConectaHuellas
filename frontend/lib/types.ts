export type MultimediaItem = {
  type: "image" | "video"
  url: string
}

export interface AnimalFormData {
  nombre: string
  edad: string
  tamaño: "pequeño" | "mediano" | "grande"
  convivencia_perros: boolean
  descripcion: string
  estado: "disponible" | "adoptado"
  fecha_alta_coordinacion?: string
  tags: string[]
  multimedia: MultimediaItem[]
}

export interface AnimalFilters {
  search?: string
  tamaño?: string
  edad?: string
  estado?: "disponible" | "adoptado"
  tags?: string[]
}

export const TAMAÑOS = [
  { value: "pequeño", label: "Pequeño" },
  { value: "mediano", label: "Mediano" },
  { value: "grande", label: "Grande" },
]

export const ESTADOS = [
  { value: "disponible", label: "Disponible" },
  { value: "adoptado", label: "Adoptado" },
]

export const TAGS_DISPONIBLES: string[] = []

export interface Animal {
  id: number
  nombre: string
  edad: string
  tamaño: "pequeño" | "mediano" | "grande"
  descripcion: string
  estado: "disponible" | "adoptado"
  tags: string[]
  multimedia: MultimediaItem[] | string[]
  fecha_registro: string
  fecha_alta_coordinacion?: string
  fecha_adopcion?: string
  convivencia_perros?: boolean
  origen?: "coordinacion" | "solicitud_externa"
  solicitud_origen_id?: number | null
}
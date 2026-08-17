"use client"

import { useEffect, useState } from "react"
import {
  getTags,
  deleteTag,
  updateTag,
  getAnimales,
} from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Pencil, Check, X } from "lucide-react"

interface Tag {
  id: number
  nombre: string
  usadoPor: number
}

interface AnimalTag {
  id: number
  nombre: string
  estado: string
  edad: string | number
  tags?: string[]
}

export function TagsTable() {
  const [tags, setTags] = useState<Tag[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingNombre, setEditingNombre] = useState("")

  const [modalOpen, setModalOpen] = useState(false)
  const [tagSeleccionado, setTagSeleccionado] = useState("")
  const [animalesDelTag, setAnimalesDelTag] = useState<AnimalTag[]>([])

  const cargarTags = async () => {
    try {
      const data = await getTags()

      setTags(Array.isArray(data) ? (data as Tag[]) : [])
    } catch (error) {
      console.error("Error cargando tags:", error)
      setTags([])
    }
  }

  useEffect(() => {
    cargarTags()
  }, [])

  const handleDelete = async (id: number, usadoPor: number) => {
    if (usadoPor > 0) {
      alert(
        `No se puede eliminar este tag porque está siendo usado por ${usadoPor} animal(es).`
      )
      return
    }

    const confirmar = window.confirm("¿Eliminar este tag?")

    if (!confirmar) return

    try {
      await deleteTag(id)

      setTags((prev) => prev.filter((tag) => tag.id !== id))
    } catch (error) {
      console.error("Error eliminando tag:", error)
    }
  }

  const startEdit = (id: number, nombre: string) => {
    setEditingId(id)
    setEditingNombre(nombre)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingNombre("")
  }

  const saveEdit = async (id: number) => {
    const nuevoNombre = editingNombre.trim().toLowerCase()

    if (!nuevoNombre) return

    try {
      await updateTag(id, nuevoNombre)

      setTags((prev) =>
        prev.map((tag) =>
          tag.id === id
            ? { ...tag, nombre: nuevoNombre }
            : tag
        )
      )

      cancelEdit()
    } catch (error) {
      console.error("Error actualizando tag:", error)
    }
  }

  const abrirModalAnimales = async (nombreTag: string) => {
    try {
      const data = await getAnimales()

      const animales = Array.isArray(data)
        ? (data as AnimalTag[])
        : []

      const filtrados = animales.filter(
        (animal) =>
          Array.isArray(animal.tags) &&
          animal.tags.includes(nombreTag)
      )

      setTagSeleccionado(nombreTag)
      setAnimalesDelTag(filtrados)
      setModalOpen(true)
    } catch (error) {
      console.error("Error cargando animales del tag:", error)
      setAnimalesDelTag([])
    }
  }

  return (
    <>
      <table className="w-full rounded-lg border">
        <thead>
          <tr className="border-b bg-muted">
            <th className="p-3 text-left">Nombre</th>
            <th className="p-3 text-center">Usado por</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id} className="border-b">
              <td className="p-3 font-medium">
                {editingId === tag.id ? (
                  <Input
                    value={editingNombre}
                    onChange={(event) =>
                      setEditingNombre(event.target.value)
                    }
                    className="max-w-xs"
                  />
                ) : (
                  tag.nombre
                )}
              </td>

              <td className="p-3 text-center">
                <button
                  type="button"
                  onClick={() =>
                    abrirModalAnimales(tag.nombre)
                  }
                  className="font-medium text-primary hover:underline"
                >
                  {tag.usadoPor}
                </button>
              </td>

              <td className="p-3">
                <div className="flex justify-center gap-2">
                  {editingId === tag.id ? (
                    <>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => saveEdit(tag.id)}
                      >
                        <Check size={16} />
                      </Button>

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={cancelEdit}
                      >
                        <X size={16} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          startEdit(tag.id, tag.nombre)
                        }
                      >
                        <Pencil size={16} />
                      </Button>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() =>
                          handleDelete(tag.id, tag.usadoPor)
                        }
                      >
                        <Trash2 size={16} />
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Animales con tag: {tagSeleccionado}
              </h2>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                <X size={18} />
              </Button>
            </div>

            {animalesDelTag.length > 0 ? (
              <ul className="space-y-2">
                {animalesDelTag.map((animal) => (
                  <li
                    key={animal.id}
                    className="rounded-md border p-3"
                  >
                    <p className="font-medium">
                      {animal.nombre}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {animal.estado} · {animal.edad}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                Ningún animal usa este tag.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
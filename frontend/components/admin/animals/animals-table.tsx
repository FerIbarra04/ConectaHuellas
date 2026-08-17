"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, Pencil, Play, Trash2, TriangleAlert, X } from "lucide-react";

import { deleteAnimal, getAnimales } from "@/lib/api";
import type { Animal } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ApiError } from "@/lib/api";
import { toast } from "sonner";

export function AnimalsTable() {
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  useState<{
    id: number;
    folio: string;
  } | null>(null);

  // =========================
  // FETCH DATA FROM API
  // =========================
  const loadAnimales = async () => {
    try {
      setLoading(true);

      const data = await getAnimales();

      setAnimales(data);
    } catch (error) {
      console.error("Error loading animals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnimales();
  }, []);

  // =========================
  // OPEN DELETE MODAL
  // =========================
  const handleDelete = (animal: Animal) => {
    setAnimalToDelete(animal);
    setDeleteModalOpen(true);
  };

  // =========================
  // CLOSE DELETE MODAL
  // =========================
  const closeDeleteModal = () => {
    if (isDeleting) return;

    setDeleteModalOpen(false);
    setAnimalToDelete(null);
  };

// =========================
// CONFIRM DELETE
// =========================
const confirmDelete = async () => {
  if (!animalToDelete) return;

  try {
    setIsDeleting(true);

    await deleteAnimal(animalToDelete.id);

    setAnimales((prev) =>
      prev.filter((animal) => animal.id !== animalToDelete.id),
    );

    if (selectedAnimal?.id === animalToDelete.id) {
      setSelectedAnimal(null);
    }

    setDeleteModalOpen(false);
    setAnimalToDelete(null);

    toast.success("Animal eliminado correctamente.");
  } catch (error) {
    console.error("Error al eliminar el animal:", error);

    toast.error(
      error instanceof Error
        ? error.message
        : "No se pudo eliminar el animal",
    );
  } finally {
    setIsDeleting(false);
  }
};

  // =========================
  // FILTER SEARCH
  // =========================
  const filtered = animales.filter((animal) =>
    animal.nombre.toLowerCase().includes(search.toLowerCase()),
  );

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Card className="space-y-4 p-4">
        {/* ANIMAL DETAILS MODAL */}
        {selectedAnimal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-5 shadow-xl">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-3 top-3 z-10"
                aria-label="Cerrar detalles"
                onClick={() => setSelectedAnimal(null)}
              >
                <X size={18} />
              </Button>

              <h3 className="mb-4 pr-12 text-2xl font-bold">
                {selectedAnimal.nombre}
              </h3>

              {(() => {
                const mediaItems =
                  selectedAnimal.multimedia
                    ?.map((media) =>
                      typeof media === "string"
                        ? {
                            type: "image" as const,
                            url: media,
                          }
                        : media,
                    )
                    .filter((media) => media.url.trim() !== "") || [];

                const currentMedia = mediaItems[currentMediaIndex];

                return (
                  <div className="space-y-4">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                      {currentMedia ? (
                        currentMedia.type === "video" ||
                        currentMedia.url.includes("/video/") ? (
                          <video
                            src={currentMedia.url}
                            controls
                            playsInline
                            preload="metadata"
                            className="h-full w-full bg-black object-contain"
                          >
                            Tu navegador no soporta video.
                          </video>
                        ) : (
                          <Image
                            src={currentMedia.url}
                            alt={selectedAnimal.nombre}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 672px"
                          />
                        )
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          Sin multimedia
                        </div>
                      )}
                    </div>

                    {mediaItems.length > 1 && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {mediaItems.map((media, index) => {
                          const isVideo =
                            media.type === "video" ||
                            media.url.includes("/video/");

                          return (
                            <button
                              key={`${media.url}-${index}`}
                              type="button"
                              aria-label={`Mostrar multimedia ${index + 1}`}
                              onClick={() => setCurrentMediaIndex(index)}
                              className={`relative h-16 w-16 overflow-hidden rounded-md border-2 transition ${
                                currentMediaIndex === index
                                  ? "border-primary"
                                  : "border-transparent opacity-70 hover:opacity-100"
                              }`}
                            >
                              {isVideo ? (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                  <Play size={20} />
                                </div>
                              ) : (
                                <Image
                                  src={media.url}
                                  alt={`Miniatura ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="mt-5 grid gap-2 text-sm">
                <p>
                  <strong>Edad:</strong> {selectedAnimal.edad}
                </p>

                <p>
                  <strong>Tamaño:</strong> {selectedAnimal.tamaño}
                </p>

                <p>
                  <strong>Estado:</strong>{" "}
                  {selectedAnimal.estado === "disponible"
                    ? "🐾 Disponible"
                    : "❤️ Adoptado"}
                </p>

                {selectedAnimal.tags && selectedAnimal.tags.length > 0 && (
                  <p>
                    <strong>Tags:</strong> {selectedAnimal.tags.join(", ")}
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <Link href={`/admin/animales/${selectedAnimal.id}`}>
                  <Button variant="outline">
                    <Pencil size={16} className="mr-2" />
                    Editar
                  </Button>
                </Link>

                <Link
                  href={`/animales/${selectedAnimal.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">🌐 Ver página pública</Button>
                </Link>

                <Button onClick={() => setSelectedAnimal(null)}>Cerrar</Button>
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Animales</h2>

          <Link href="/admin/animales/nuevo">
            <Button>Agregar</Button>
          </Link>
        </div>

        {/* SEARCH */}
        <Input
          placeholder="Buscar animal..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Origen</th>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Edad</th>
                <th className="p-2 text-left">Tamaño</th>
                <th className="p-2 text-left">Registro Sistema</th>
                <th className="p-2 text-left">Fecha Alta de Llegada</th>
                <th className="p-2 text-left">Fecha Adopción</th>
                <th className="p-2 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((animal) => (
                <tr key={animal.id} className="border-b">
                  {/* ORIGEN */}
                  <td className="p-2">
                    {animal.origen === "solicitud_externa" ? (
                      <div className="flex flex-col items-start gap-1">
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                          Solicitud externa
                        </span>

                        {animal.solicitud_origen_id && (
                          <span className="text-xs text-muted-foreground">
                            Solicitud #{animal.solicitud_origen_id}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
                        Coordinación
                      </span>
                    )}
                  </td>
                  {/* FOTO + NOMBRE */}
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={
                            animal.multimedia
                              ?.map((media) =>
                                typeof media === "string"
                                  ? {
                                      type: "image" as const,
                                      url: media,
                                    }
                                  : media,
                              )
                              .find(
                                (media) =>
                                  media.type === "image" &&
                                  !media.url.includes("/video/"),
                              )?.url ||
                            "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop"
                          }
                          alt={animal.nombre}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>

                      <div>
                        <p className="font-medium">{animal.nombre}</p>

                        <p
                          className={`text-xs ${
                            animal.estado === "disponible"
                              ? "text-green-600"
                              : "text-rose-500"
                          }`}
                        >
                          {animal.estado === "disponible"
                            ? "🐾 Disponible"
                            : "❤️ Adoptado"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* EDAD */}
                  <td className="p-2">{animal.edad}</td>

                  {/* TAMAÑO */}
                  <td className="p-2">{animal.tamaño}</td>

                  {/* FECHA REGISTRO */}
                  <td className="p-2">
                    {animal.fecha_registro
                      ? new Date(animal.fecha_registro).toLocaleDateString(
                          "es-MX",
                        )
                      : "-"}
                  </td>

                  {/* FECHA COORDINACIÓN */}
                  <td className="p-2">
                    {animal.fecha_alta_coordinacion
                      ? new Date(
                          animal.fecha_alta_coordinacion,
                        ).toLocaleDateString("es-MX")
                      : "-"}
                  </td>

                  {/* FECHA ADOPCIÓN */}
                  <td className="p-2">
                    {animal.fecha_adopcion
                      ? new Date(animal.fecha_adopcion).toLocaleDateString(
                          "es-MX",
                        )
                      : "-"}
                  </td>

                  {/* ACCIONES */}
                  <td className="p-2">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        aria-label={`Ver detalles de ${animal.nombre}`}
                        onClick={() => {
                          setSelectedAnimal(animal);
                          setCurrentMediaIndex(0);
                        }}
                      >
                        <Eye size={16} />
                      </Button>

                      <Link href={`/admin/animales/${animal.id}`}>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          aria-label={`Editar a ${animal.nombre}`}
                        >
                          <Pencil size={16} />
                        </Button>
                      </Link>

                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        aria-label={`Eliminar a ${animal.nombre}`}
                        onClick={() => handleDelete(animal)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="py-6 text-center text-muted-foreground">
              No hay animales
            </p>
          )}
        </div>
      </Card>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && animalToDelete && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-animal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border bg-background shadow-2xl">
            <div className="px-6 pb-4 pt-7 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <TriangleAlert className="h-8 w-8 text-red-600" />
              </div>

              <h2
                id="delete-animal-title"
                className="mt-4 text-xl font-bold text-foreground"
              >
                ¿Eliminar a {animalToDelete.nombre}?
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="px-6 pb-6">
              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-center text-sm leading-6 text-red-900">
                  Se eliminará la información de{" "}
                  <span className="font-semibold">{animalToDelete.nombre}</span>
                  , así como sus fotografías y video dentro de Conecta Huellas.
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={isDeleting}
                  onClick={closeDeleteModal}
                >
                  Cancelar
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  className="flex-1"
                  disabled={isDeleting}
                  onClick={confirmDelete}
                >
                  {isDeleting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Sí, eliminar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

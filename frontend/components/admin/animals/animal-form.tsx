"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  createAnimal,
  createTag,
  getSolicitudById,
  getTags,
  registrarSolicitudComoAnimal,
  uploadFile,
  type SolicitudAdmin,
} from "@/lib/api";

import type { Animal, AnimalFormData, MultimediaItem } from "@/lib/types";
import { ESTADOS, TAMAÑOS } from "@/lib/types";
import { getTagStyle } from "@/lib/tag-styles";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createPortal } from "react-dom";

interface AnimalFormProps {
  animal?: Animal;
  isEditing?: boolean;
  onSubmit?: (data: AnimalFormData) => Promise<void>;
}

const DRAFT_KEY = "conecta-huellas-animal-draft";

export function AnimalForm({
  animal,
  isEditing = false,
  onSubmit,
}: AnimalFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const solicitudId = searchParams.get("solicitudId");

  const multimediaNormalizada: MultimediaItem[] = Array.isArray(
    animal?.multimedia,
  )
    ? animal.multimedia.map((item) =>
        typeof item === "string"
          ? {
              type: "image" as const,
              url: item,
            }
          : item,
      )
    : [];
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSolicitud, setLoadingSolicitud] = useState(false);
  const [solicitudCargada, setSolicitudCargada] = useState(false);
  const [errorSolicitud, setErrorSolicitud] = useState("");

  const [draftAvailable, setDraftAvailable] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [draftDismissed, setDraftDismissed] = useState(false);

  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const [savedAnimalId, setSavedAnimalId] = useState<number | null>(
    animal?.id || null,
  );

  const [formData, setFormData] = useState<AnimalFormData>({
    nombre: animal?.nombre || "",
    edad: animal?.edad || "",
    tamaño: animal?.tamaño || "mediano",
    convivencia_perros: animal?.convivencia_perros ?? false,
    descripcion: animal?.descripcion || "",
    estado: animal?.estado || "disponible",
    tags: animal?.tags || [],
    fecha_alta_coordinacion:
      animal?.fecha_alta_coordinacion?.split("T")[0] || "",
    multimedia: multimediaNormalizada,
  });

  const [nuevoTag, setNuevoTag] = useState("");
  const [tagsDisponibles, setTagsDisponibles] = useState<string[]>([]);

  const [fotos, setFotos] = useState<MultimediaItem[]>(
    multimediaNormalizada.filter((item) => item.type === "image") || [],
  );

  const [video, setVideo] = useState<MultimediaItem | null>(
    multimediaNormalizada.find((item) => item.type === "video") || null,
  );

  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState<number | null>(
    null,
  );
  const aplicarDatosSolicitud = useCallback((solicitud: SolicitudAdmin) => {
    let multimediaOriginal: unknown = solicitud.multimedia;

    if (typeof multimediaOriginal === "string") {
      try {
        multimediaOriginal = JSON.parse(multimediaOriginal);
      } catch {
        multimediaOriginal = [];
      }
    }

    const multimedia: MultimediaItem[] = Array.isArray(multimediaOriginal)
      ? multimediaOriginal
          .map((item: any): MultimediaItem | null => {
            if (typeof item === "string") {
              const esVideo = /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(item);

              return {
                type: esVideo ? "video" : "image",
                url: item,
              };
            }

            const url =
              item?.url || item?.secure_url || item?.src || item?.archivo_url;

            if (!url) return null;

            const tipoOriginal = String(
              item?.type || item?.tipo || "",
            ).toLowerCase();

            const esVideo =
              tipoOriginal === "video" ||
              tipoOriginal === "videos" ||
              /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);

            return {
              type: esVideo ? "video" : "image",
              url,
            };
          })
          .filter((item): item is MultimediaItem => item !== null)
      : [];

    const fotosSolicitud = multimedia
      .filter((item) => item.type === "image")
      .slice(0, 3);

    const videoSolicitud =
      multimedia.find((item) => item.type === "video") || null;

    setFormData((prev) => ({
      ...prev,
      nombre: solicitud.nombre_animal || "",
      edad: solicitud.edad_aproximada || "",
      tamaño: solicitud.tamano || "mediano",
      descripcion: solicitud.descripcion || "",
      estado: "disponible",
      multimedia,
    }));

    setFotos(fotosSolicitud);
    setVideo(videoSolicitud);
  }, []);

  useEffect(() => {
    if (!solicitudId || isEditing || solicitudCargada) return;

    let mounted = true;

    const cargarSolicitud = async () => {
      try {
        setLoadingSolicitud(true);
        setErrorSolicitud("");

        const solicitud = await getSolicitudById(solicitudId);

        if (!mounted) return;

        aplicarDatosSolicitud(solicitud);
        setSolicitudCargada(true);

        localStorage.removeItem(DRAFT_KEY);
        setDraftAvailable(false);
        setDraftDismissed(true);
      } catch (error) {
        console.error("Error cargando solicitud:", error);

        if (mounted) {
          setErrorSolicitud(
            "No se pudieron precargar los datos de la solicitud.",
          );
        }
      } finally {
        if (mounted) {
          setLoadingSolicitud(false);
        }
      }
    };

    cargarSolicitud();

    return () => {
      mounted = false;
    };
  }, [solicitudId, isEditing, solicitudCargada, aplicarDatosSolicitud]);

  useEffect(() => {
    let mounted = true;

    const cargarTags = async () => {
      try {
        const data = await getTags();

        if (!mounted) return;

        const tags = Array.isArray(data) ? (data as { nombre: string }[]) : [];

        setTagsDisponibles(tags.map((tag) => tag.nombre));
      } catch (error) {
        console.error("Error cargando tags:", error);
      }
    };

    cargarTags();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isEditing || solicitudId) {
      setDraftLoaded(true);
      return;
    }

    const savedDraft = localStorage.getItem(DRAFT_KEY);

    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);

        if (hasDraftData(parsedDraft)) {
          setDraftAvailable(true);
        } else {
          localStorage.removeItem(DRAFT_KEY);
        }
      } catch {
        localStorage.removeItem(DRAFT_KEY);
      }
    }

    setDraftLoaded(true);
  }, [isEditing, solicitudId]);

  useEffect(() => {
    if (
      isEditing ||
      solicitudId ||
      !draftLoaded ||
      draftDismissed ||
      draftAvailable
    ) {
      return;
    }

    const draftData = {
      nombre: formData.nombre,
      edad: formData.edad,
      tamaño: formData.tamaño,
      convivencia_perros: formData.convivencia_perros,
      descripcion: formData.descripcion,
      estado: formData.estado,
      tags: formData.tags,
      fecha_alta_coordinacion: formData.fecha_alta_coordinacion,
    };

    if (!hasDraftData(draftData)) {
      localStorage.removeItem(DRAFT_KEY);
      return;
    }

    localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
  }, [
    formData,
    isEditing,
    solicitudId,
    draftLoaded,
    draftDismissed,
    draftAvailable,
  ]);

  const reorderFotos = (fromIndex: number, toIndex: number) => {
    setFotos((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);

      updated.splice(toIndex, 0, movedItem);

      return updated;
    });
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((item) => item !== tag)
        : [...prev.tags, tag],
    }));
  };

  const agregarNuevoTag = async () => {
    const tag = nuevoTag.trim().toLowerCase();

    if (!tag) return;

    try {
      await createTag(tag);

      setTagsDisponibles((prev) => {
        if (prev.includes(tag)) return prev;

        return [...prev, tag];
      });

      setFormData((prev) => {
        if (prev.tags.includes(tag)) return prev;

        return {
          ...prev,
          tags: [...prev.tags, tag],
        };
      });

      setNuevoTag("");
    } catch (error) {
      console.error("Error creando tag:", error);
      alert("No se pudo crear la característica.");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (fotos.length < 2) {
      alert("Debes agregar mínimo 2 fotos.");
      setIsLoading(false);
      return;
    }

    if (fotos.length > 3) {
      alert("Solo puedes agregar máximo 3 fotos.");
      setIsLoading(false);
      return;
    }

    const multimediaUrls: MultimediaItem[] = [
      ...fotos,
      ...(video ? [video] : []),
    ];

    const dataToSubmit: AnimalFormData = {
      ...formData,
      multimedia: multimediaUrls,
    };

    try {
      let result: { id?: number } | null = null;

      if (isEditing && onSubmit) {
        await onSubmit(dataToSubmit);
        setSavedAnimalId(animal?.id || null);
      } else {
        const response = await createAnimal(dataToSubmit);

result =
  response && typeof response === "object"
    ? (response as { id?: number })
    : null;

const nuevoAnimalId = result?.id;

if (!nuevoAnimalId) {
  throw new Error("No se recibió el ID del animal creado.");
}

setSavedAnimalId(nuevoAnimalId);

// Si el animal proviene de una solicitud aprobada,
// la marcamos como registrada y la vinculamos.
if (solicitudId) {
  await registrarSolicitudComoAnimal(
    Number(solicitudId),
    nuevoAnimalId,
  );
}}

      localStorage.removeItem(DRAFT_KEY);
      setSuccessModalOpen(true);
    } catch (error) {
      console.error("Error guardando animal:", error);
alert(
  error instanceof Error
    ? error.message
    : "No se pudo guardar el animal.",
);    } finally {
      setIsLoading(false);
    }
  };

  const cancelarHref = solicitudId
    ? `/admin/solicitudes/${solicitudId}`
    : "/admin/animales";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing
              ? "Editar Animal"
              : solicitudId
                ? "Registrar animal desde solicitud"
                : "Agregar Animal"}
          </h1>

          <p className="text-muted-foreground">
            {solicitudId
              ? "Revisa y completa la información antes de publicar al animal."
              : "Administra la información del animal"}
          </p>
        </div>
      </div>

      {loadingSolicitud && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <Spinner className="h-4 w-4" />
            Cargando información de la solicitud...
          </div>
        </div>
      )}

      {errorSolicitud && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-medium">No fue posible cargar la solicitud</p>

          <p className="mt-1">{errorSolicitud}</p>
        </div>
      )}

      {solicitudId &&
        solicitudCargada &&
        !loadingSolicitud &&
        !errorSolicitud && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <p className="font-medium">
              Datos precargados desde la solicitud #{solicitudId}
            </p>

            <p className="mt-1">
              Revisa la información y completa los campos necesarios antes de
              guardar.
            </p>
          </div>
        )}

      {draftAvailable && !isEditing && !solicitudId && (
        <div className="rounded-lg border bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-medium">Se encontró un borrador anterior.</p>

          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const savedDraft = localStorage.getItem(DRAFT_KEY);

                if (!savedDraft) return;

                try {
                  const parsedDraft = JSON.parse(savedDraft);

                  setFormData((prev) => ({
                    ...prev,
                    ...parsedDraft,
                  }));

                  setDraftAvailable(false);
                } catch {
                  localStorage.removeItem(DRAFT_KEY);
                  setDraftAvailable(false);
                }
              }}
            >
              Restaurar
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                localStorage.removeItem(DRAFT_KEY);
                setDraftAvailable(false);
                setDraftDismissed(true);
              }}
            >
              Descartar
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Información básica</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Nombre</FieldLabel>

                <Input
                  value={formData.nombre}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      nombre: event.target.value,
                    }))
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Edad</FieldLabel>

                <Input
                  value={formData.edad}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      edad: event.target.value,
                    }))
                  }
                />
              </Field>

              <Field>
                <FieldLabel>Tamaño</FieldLabel>

                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      tamaño: value as "pequeño" | "mediano" | "grande",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tamaño" />
                  </SelectTrigger>

                  <SelectContent>
                    {TAMAÑOS.map((tamano) => (
                      <SelectItem key={tamano.value} value={tamano.value}>
                        {tamano.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Estado</FieldLabel>

                <Select
                  value={formData.estado}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      estado: value as AnimalFormData["estado"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {ESTADOS.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Convivencia con perros</FieldLabel>

                <Select
                  value={formData.convivencia_perros ? "si" : "no"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      convivencia_perros: value === "si",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="si">Sí</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Fecha Alta de Llegada</FieldLabel>

                <Input
                  type="date"
                  value={formData.fecha_alta_coordinacion}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      fecha_alta_coordinacion: event.target.value,
                    }))
                  }
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>

          <CardContent>
            <Field>
              <Textarea
                rows={5}
                placeholder="Describe la personalidad, comportamiento y detalles importantes del animal..."
                value={formData.descripcion}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    descripcion: event.target.value,
                  }))
                }
              />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Características</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <Field>
              <FieldLabel>Selecciona características</FieldLabel>

              <div className="flex flex-wrap gap-2">
                {[...new Set([...tagsDisponibles, ...formData.tags])].length ===
                0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aún no hay características registradas. Agrega una nueva
                    para que aparezca aquí.
                  </p>
                ) : (
                  [...new Set([...tagsDisponibles, ...formData.tags])].map(
                    (tag, index) => (
                      <Badge
                        key={tag}
                        className={`cursor-pointer transition-all ${
                          formData.tags.includes(tag)
                            ? getTagStyle(index)
                            : "border border-dashed bg-background text-muted-foreground hover:bg-muted"
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ),
                  )
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Agregar nueva característica"
                  value={nuevoTag}
                  onChange={(event) => setNuevoTag(event.target.value)}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={agregarNuevoTag}
                >
                  Agregar
                </Button>
              </div>
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multimedia</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Fotografías</p>

                  <p className="text-xs text-muted-foreground">
                    {fotos.length} / 3 fotos agregadas
                  </p>
                </div>

                <span
                  className={`text-xs font-medium ${
                    fotos.length >= 2 ? "text-[#3CB371]" : "text-amber-600"
                  }`}
                >
                  {fotos.length >= 2 ? "Requisito completo" : "Faltan fotos"}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min((fotos.length / 3) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            <Field>
              <FieldLabel>Fotografías (mínimo 2 y máximo 3)</FieldLabel>

              <Input
                type="file"
                accept="image/*"
                multiple
                disabled={isLoading || loadingSolicitud}
                onChange={async (event) => {
                  const files = Array.from(event.target.files || []);

                  if (fotos.length + files.length > 3) {
                    alert("Solo puedes agregar máximo 3 fotos.");
                    event.target.value = "";
                    return;
                  }

                  setIsLoading(true);

                  try {
                    for (const file of files) {
                      const uploaded = await uploadFile(file);

                      setFotos((prev) => [
                        ...prev,
                        {
                          type: "image",
                          url: uploaded.url,
                        },
                      ]);
                    }
                  } catch (error) {
                    console.error("Error subiendo fotografías:", error);
                    alert("No se pudieron subir las fotografías.");
                  } finally {
                    setIsLoading(false);
                    event.target.value = "";
                  }
                }}
              />

              <div className="mt-3 space-y-2">
                {fotos.map((foto, index) => (
                  <div
                    key={`${foto.url}-${index}`}
                    draggable
                    onDragStart={() => setDraggedPhotoIndex(index)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      if (draggedPhotoIndex === null) return;

                      reorderFotos(draggedPhotoIndex, index);
                      setDraggedPhotoIndex(null);
                    }}
                    onDragEnd={() => setDraggedPhotoIndex(null)}
                    className={`flex cursor-move items-center justify-between gap-3 rounded-md border p-2 text-sm transition-all ${
                      draggedPhotoIndex === index ? "opacity-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                        <img
                          src={foto.url}
                          alt={`Foto ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div>
                        <span className="font-medium">Foto {index + 1}</span>

                        {index === 0 && (
                          <p className="text-xs text-muted-foreground">
                            ⭐ Portada principal
                          </p>
                        )}

                        <p className="text-xs text-muted-foreground">
                          Arrastra para reordenar
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                      onClick={() =>
                        setFotos((prev) =>
                          prev.filter((_, photoIndex) => photoIndex !== index),
                        )
                      }
                    >
                      Quitar
                    </Button>
                  </div>
                ))}
              </div>
            </Field>

            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Video</p>

                  <p className="text-xs text-muted-foreground">
                    {video ? "Video agregado correctamente" : "Video opcional"}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium ${
                    video ? "text-[#3CB371]" : "text-muted-foreground"
                  }`}
                >
                  {video ? "Agregado" : "Opcional"}
                </span>
              </div>
            </div>

            <Field>
              <FieldLabel>Video (opcional, máximo 1)</FieldLabel>

              <Input
                type="file"
                accept="video/*"
                disabled={isLoading || loadingSolicitud}
                onChange={async (event) => {
                  const file = event.target.files?.[0];

                  if (!file) return;

                  setIsLoading(true);

                  try {
                    const uploaded = await uploadFile(file);

                    setVideo({
                      type: "video",
                      url: uploaded.url,
                    });
                  } catch (error) {
                    console.error("Error subiendo video:", error);
                    alert("No se pudo subir el video.");
                  } finally {
                    setIsLoading(false);
                    event.target.value = "";
                  }
                }}
              />

              {video && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-md border p-3 text-sm">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-[360px] w-[203px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black">
                      <video
                        src={video.url}
                        controls
                        playsInline
                        preload="metadata"
                        className="block h-full w-full"
                        style={{
                          objectFit: "contain",
                          objectPosition: "center",
                        }}
                      >
                        Tu navegador no puede reproducir este video.
                      </video>
                    </div>

                    <span>Video agregado</span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => setVideo(null)}
                  >
                    Quitar
                  </Button>
                </div>
              )}
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex justify-end gap-3">
              <Link href={cancelarHref}>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={
                  isLoading || loadingSolicitud || Boolean(errorSolicitud)
                }
                className="min-w-[160px]"
              >
                {isLoading || loadingSolicitud ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />

                    {loadingSolicitud ? "Cargando..." : "Guardando..."}
                  </>
                ) : solicitudId ? (
                  "Registrar animal"
                ) : (
                  "Guardar animal"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      {successModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#3CB371]/10">
                  <span className="text-2xl">🐾</span>
                </div>

                <h2 className="text-xl font-bold">
                  {solicitudId
                    ? "Animal registrado en Conecta Huellas"
                    : "Animal guardado correctamente"}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {solicitudId
                    ? "El animal fue creado y la solicitud quedó marcada como registrada."
                    : "La información del animal se guardó exitosamente."}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {savedAnimalId && (
                  <Link href={`/animales/${savedAnimalId}`} target="_blank">
                    <Button type="button" variant="outline" className="w-full">
                      🌐 Ver ficha pública
                    </Button>
                  </Link>
                )}

                {!solicitudId && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSuccessModalOpen(false);
                      router.push("/admin/animales/nuevo");
                      router.refresh();
                    }}
                  >
                    ➕ Agregar otro animal
                  </Button>
                )}

                {solicitudId && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSuccessModalOpen(false);
                      router.push("/admin/solicitudes");
                      router.refresh();
                    }}
                  >
                    Volver a solicitudes
                  </Button>
                )}

                <Button
                  type="button"
                  className="w-full"
                  onClick={() => {
                    setSuccessModalOpen(false);
                    router.push("/admin/animales");
                    router.refresh();
                  }}
                >
                  Ir a gestión de animales
                </Button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function hasDraftData(data: Partial<AnimalFormData>) {
  return Boolean(
    data.nombre?.trim() ||
    data.edad?.trim() ||
    data.descripcion?.trim() ||
    data.tags?.length ||
    data.fecha_alta_coordinacion,
  );
}

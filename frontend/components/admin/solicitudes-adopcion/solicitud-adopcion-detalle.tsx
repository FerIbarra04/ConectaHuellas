"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Phone, User, Calendar, Heart } from "lucide-react";
import Link from "next/link";

import {
  getSolicitudAdopcionById,
  actualizarEstadoSolicitudAdopcion,
  type SolicitudAdopcion,
} from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  id: string;
}

const estadoTexto = {
  nueva: "Nueva",
  contactado: "Contactado",
  finalizada: "Finalizada",
} as const;

const estadoColor = {
  nueva: "bg-amber-100 text-amber-700 border-amber-200",
  contactado: "bg-blue-100 text-blue-700 border-blue-200",
  finalizada: "bg-green-100 text-green-700 border-green-200",
} as const;

export function SolicitudAdopcionDetalle({ id }: Props) {
  const [solicitud, setSolicitud] = useState<SolicitudAdopcion | null>(null);

  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      const data = await getSolicitudAdopcionById(id);

      setSolicitud(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function cambiarEstado() {
    if (!solicitud) return;

    let nuevoEstado = solicitud.estado;

    if (estado === "nueva") {
      nuevoEstado = "contactado";
    } else if (estado === "contactado") {
      nuevoEstado = "finalizada";
    }

    try {
      setGuardando(true);

      await actualizarEstadoSolicitudAdopcion(solicitud.id, nuevoEstado);

      await cargar();
    } finally {
      setGuardando(false);
    }
  }

  if (!solicitud) {
    return <div className="py-16 text-center">Cargando...</div>;
  }

  const imagen =
    solicitud.multimedia.find((item) => item.type === "image")?.url ||
    "/placeholder.svg";

  const estado = solicitud.estado.trim().toLowerCase();

  console.log("Estado:", `"${solicitud.estado}"`);
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/solicitudes-adopcion">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Regresar
            </Button>
          </Link>

          <p className="text-sm font-semibold uppercase tracking-widest text-[#2563EB]">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-bold">Solicitud de adopción</h1>

          <p className="mt-2 text-muted-foreground">
            Consulta la información del ciudadano interesado y administra el
            seguimiento de la solicitud.
          </p>
        </div>

        <Badge variant="outline" className={estadoColor[solicitud.estado]}>
          {estadoTexto[solicitud.estado]}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="relative mx-auto h-56 w-full overflow-hidden rounded-2xl">
              <Image
                src={imagen}
                alt={solicitud.nombre_animal}
                fill
                className="object-cover"
              />
            </div>

            <div className="mt-6 text-center">
              <h2 className="text-2xl font-bold">{solicitud.nombre_animal}</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Animal seleccionado para adopción
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl lg:col-span-2">
          <CardContent className="space-y-8 p-8">
            <div>
              <h2 className="text-xl font-bold">Información del ciudadano</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Nombre completo
                </p>

                <div className="flex items-center gap-3 rounded-xl border p-4">
                  <User className="h-5 w-5 text-blue-600" />

                  <span className="font-medium">
                    {solicitud.nombre_completo}
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Teléfono
                </p>

                <div className="flex items-center gap-3 rounded-xl border p-4">
                  <Phone className="h-5 w-5 text-green-600" />

                  <span className="font-medium">{solicitud.telefono}</span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  Fecha de solicitud
                </p>

                <div className="flex items-center gap-3 rounded-xl border p-4">
                  <Calendar className="h-5 w-5 text-orange-600" />

                  <span>
                    {new Date(solicitud.fecha_solicitud).toLocaleDateString(
                      "es-MX",
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* ==========================
    Seguimiento de la solicitud
========================== */}

            {/* ==========================
    Seguimiento de la solicitud
========================== */}

            <div>
              <h2 className="mb-8 text-xl font-bold">
                Seguimiento de la solicitud
              </h2>

              <div className="flex w-full items-start">
                {/* Nueva */}
                <div className="flex w-24 flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-white ${
                      solicitud.estado === "nueva" ||
                      solicitud.estado === "contactado" ||
                      solicitud.estado === "finalizada"
                        ? "bg-amber-500"
                        : "bg-gray-300"
                    }`}
                  >
                    1
                  </div>

                  <p className="mt-3 text-center text-sm font-medium">Nueva</p>
                </div>

                <div className="mt-6 h-1 flex-1 rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      solicitud.estado === "nueva"
                        ? "w-0 bg-amber-500"
                        : solicitud.estado === "contactado"
                          ? "w-full bg-amber-500"
                          : "w-full bg-green-500"
                    }`}
                  />
                </div>

                {/* Contactado */}
                <div className="flex w-24 flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-white ${
                      solicitud.estado === "contactado" ||
                      solicitud.estado === "finalizada"
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  >
                    2
                  </div>

                  <p className="mt-3 text-center text-sm font-medium">
                    Contactado
                  </p>
                </div>

                <div className="mt-6 h-1 flex-1 rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      solicitud.estado === "finalizada"
                        ? "w-full bg-green-500"
                        : "w-0"
                    }`}
                  />
                </div>

                {/* Finalizada */}
                <div className="flex w-24 flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-white ${
                      solicitud.estado === "finalizada"
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                  >
                    3
                  </div>

                  <p className="mt-3 text-center text-sm font-medium">
                    Finalizada
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              {solicitud.estado !== "finalizada" ? (
                <Button
                  onClick={cambiarEstado}
                  disabled={guardando}
                  className="w-full h-12 text-base"
                >
                  <Heart className="mr-2 h-5 w-5" />

                  {guardando
                    ? "Actualizando..."
                    : estado === "nueva"
                      ? "Marcar como Contactado"
                      : "Marcar como Finalizada"}
                </Button>
              ) : (
                <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                  <Heart className="mx-auto mb-3 h-10 w-10 text-green-600" />

                  <h3 className="text-lg font-semibold text-green-700">
                    Solicitud finalizada
                  </h3>

                  <p className="mt-2 text-sm text-green-600">
                    El seguimiento de esta solicitud ha concluido correctamente.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

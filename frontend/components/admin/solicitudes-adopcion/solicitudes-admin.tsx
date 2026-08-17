"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Search, Eye, Heart, Phone, User, Loader2, Trash2 } from "lucide-react";

import {
  getSolicitudesAdopcion,
  eliminarSolicitudAdopcion,
  type SolicitudAdopcion,
} from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

export function SolicitudesAdopcionAdmin() {
  const [solicitudes, setSolicitudes] = useState<SolicitudAdopcion[]>([]);

  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");

  const [estadoFiltro, setEstadoFiltro] = useState<
    "todas" | "nueva" | "contactado" | "finalizada"
  >("todas");

  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true);

        const data = await getSolicitudesAdopcion();

        console.log("SOLICITUDES ADOPCIÓN:", data);

        setSolicitudes(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, []);

  async function eliminarSolicitud() {
    if (!solicitudEliminar) return;

    try {
      setEliminando(true);

      await eliminarSolicitudAdopcion(solicitudEliminar.id);

      setSolicitudes((prev) =>
        prev.filter((s) => s.id !== solicitudEliminar.id),
      );

      // Cierra el AlertDialog
      setSolicitudEliminar(null);
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar la solicitud.");
    } finally {
      setEliminando(false);
    }
  }

  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter((solicitud) => {
      const coincideBusqueda =
        solicitud.nombre_animal
          .toLowerCase()
          .includes(busqueda.toLowerCase()) ||
        solicitud.nombre_completo
          .toLowerCase()
          .includes(busqueda.toLowerCase());

      const coincideEstado =
        estadoFiltro === "todas" ? true : solicitud.estado === estadoFiltro;

      return coincideBusqueda && coincideEstado;
    });
  }, [solicitudes, busqueda, estadoFiltro]);

  const total = solicitudes.length;

  const nuevas = solicitudes.filter((s) => s.estado === "nueva").length;

  const contactadas = solicitudes.filter(
    (s) => s.estado === "contactado",
  ).length;

  const finalizadas = solicitudes.filter(
    (s) => s.estado === "finalizada",
  ).length;

  const [solicitudEliminar, setSolicitudEliminar] =
    useState<SolicitudAdopcion | null>(null);

  const [eliminando, setEliminando] = useState(false);

  return (
    <div className="space-y-8">
      {/* ENCABEZADO */}

      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2563EB]">
          Administración
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#1F2937]">
          Solicitudes de adopción
        </h1>

        <p className="mt-2 text-[#6B7280]">
          Consulta y da seguimiento a los ciudadanos interesados en adoptar uno
          de los animales del catálogo.
        </p>
      </div>

      {/* TARJETAS */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <Heart className="h-8 w-8 text-rose-500" />

            <p className="mt-4 text-3xl font-bold">{total}</p>

            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="h-3 w-3 rounded-full bg-amber-500" />

            <p className="mt-4 text-3xl font-bold">{nuevas}</p>

            <p className="text-sm text-muted-foreground">Nuevas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Phone className="h-8 w-8 text-blue-500" />

            <p className="mt-4 text-3xl font-bold">{contactadas}</p>

            <p className="text-sm text-muted-foreground">Contactadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <User className="h-8 w-8 text-green-600" />

            <p className="mt-4 text-3xl font-bold">{finalizadas}</p>

            <p className="text-sm text-muted-foreground">Finalizadas</p>
          </CardContent>
        </Card>
      </div>
      {/* BUSCADOR */}

      <Card className="rounded-3xl">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                className="pl-10"
                placeholder="Buscar por animal o ciudadano..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={estadoFiltro === "todas" ? "default" : "outline"}
                onClick={() => setEstadoFiltro("todas")}
              >
                Todas
              </Button>

              <Button
                variant={estadoFiltro === "nueva" ? "default" : "outline"}
                onClick={() => setEstadoFiltro("nueva")}
              >
                Nueva
              </Button>

              <Button
                variant={estadoFiltro === "contactado" ? "default" : "outline"}
                onClick={() => setEstadoFiltro("contactado")}
              >
                Contactado
              </Button>

              <Button
                variant={estadoFiltro === "finalizada" ? "default" : "outline"}
                onClick={() => setEstadoFiltro("finalizada")}
              >
                Finalizada
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LOADING */}

      {loading && (
        <Card className="rounded-3xl">
          <CardContent className="flex items-center justify-center p-16">
            <div className="text-center">
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#2563EB]" />

              <p className="mt-4 text-sm text-muted-foreground">
                Cargando solicitudes...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SIN REGISTROS */}

      {!loading && solicitudesFiltradas.length === 0 && (
        <Card className="rounded-3xl">
          <CardContent className="p-16 text-center">
            <Heart className="mx-auto h-12 w-12 text-gray-300" />

            <h3 className="mt-5 text-xl font-bold">No hay solicitudes</h3>

            <p className="mt-2 text-muted-foreground">
              Las solicitudes de adopción aparecerán aquí cuando los ciudadanos
              envíen el formulario.
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && solicitudesFiltradas.length > 0 && (
        <Card className="rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="border-b">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Animal
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Ciudadano
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Teléfono
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Estado
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Fecha
                  </th>

                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody>
                {solicitudesFiltradas.map((solicitud) => (
                  <tr
                    key={solicitud.id}
                    className="border-b transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl border bg-slate-100">
                          <Image
                            src={
                              solicitud.multimedia?.find(
                                (item) => item.type === "image",
                              )?.url || "/placeholder.svg"
                            }
                            alt={solicitud.nombre_animal}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {solicitud.nombre_animal}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium">{solicitud.nombre_completo}</p>
                    </td>

                    <td className="px-6 py-4">
                      <p>{solicitud.telefono}</p>
                    </td>

                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={estadoColor[solicitud.estado]}
                      >
                        {estadoTexto[solicitud.estado]}
                      </Badge>
                    </td>

                    <td className="px-6 py-4">
                      {new Date(solicitud.fecha_solicitud).toLocaleDateString(
                        "es-MX",
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/solicitudes-adopcion/${solicitud.id}`}
                        >
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                          </Button>
                        </Link>

                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => setSolicitudEliminar(solicitud)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      <AlertDialog
        open={!!solicitudEliminar}
        onOpenChange={(open) => {
          if (!open) {
            setSolicitudEliminar(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Eliminar solicitud de adopción?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Se eliminará permanentemente la solicitud de{" "}
              <strong>{solicitudEliminar?.nombre_completo}</strong>.
              <br />
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={eliminarSolicitud}
                disabled={eliminando}
              >
                {eliminando ? "Eliminando..." : "Eliminar"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

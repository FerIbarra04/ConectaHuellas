"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  XCircle,
  PawPrint,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  getSolicitudById,
  updateSolicitudEstado,
  eliminarSolicitud,
  type SolicitudAdmin,
} from "@/lib/api";

interface SolicitudDetalleProps {
  id: string;
}

export function SolicitudDetalle({ id }: SolicitudDetalleProps) {
  const [solicitud, setSolicitud] = useState<SolicitudAdmin | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [actualizandoEstado, setActualizandoEstado] = useState(false);

  const [modalRechazoOpen, setModalRechazoOpen] = useState(false);

  const [motivoRechazo, setMotivoRechazo] = useState("");

  useEffect(() => {
    const cargarSolicitud = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSolicitudById(id);

        setSolicitud(data);
      } catch (error) {
        console.error(error);

        setError("No se pudo cargar la solicitud.");
      } finally {
        setLoading(false);
      }
    };

    cargarSolicitud();
  }, [id]);

  const cambiarEstado = async (
    nuevoEstado: SolicitudAdmin["estado_solicitud"],
  ) => {
    if (!solicitud || actualizandoEstado) return;

    try {
      setActualizandoEstado(true);

      await updateSolicitudEstado(solicitud.id, {
        estado_solicitud: nuevoEstado,
        observaciones_admin: solicitud.observaciones_admin,
        comentario_resolucion: solicitud.comentario_resolucion,
      });

      setSolicitud((prev) =>
        prev
          ? {
              ...prev,
              estado_solicitud: nuevoEstado,
            }
          : prev,
      );
    } catch (error) {
      console.error("Error actualizando solicitud:", error);

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la solicitud.",
      );
    } finally {
      setActualizandoEstado(false);
    }
  };

  const rechazarSolicitud = async () => {
    if (!solicitud || actualizandoEstado) {
      return;
    }

    const motivo = motivoRechazo.trim();

    if (!motivo) {
      alert("Escribe el motivo del rechazo.");

      return;
    }

    try {
      setActualizandoEstado(true);

      await updateSolicitudEstado(solicitud.id, {
        estado_solicitud: "rechazada",
        observaciones_admin: solicitud.observaciones_admin,
        comentario_resolucion: motivo,
      });

      setSolicitud((prev) =>
        prev
          ? {
              ...prev,
              estado_solicitud: "rechazada",
              comentario_resolucion: motivo,
            }
          : prev,
      );

      setModalRechazoOpen(false);
      setMotivoRechazo("");
    } catch (error) {
      console.error("Error rechazando solicitud:", error);

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo rechazar la solicitud.",
      );
    } finally {
      setActualizandoEstado(false);
    }
  }
  const eliminar = async () => {
  if (!solicitud) return;

  if (
    !confirm(
      "¿Eliminar esta solicitud rechazada? Esta acción no se puede deshacer."
    )
  ) {
    return;
  }

  try {
    await eliminarSolicitud(solicitud.id);

    alert("Solicitud eliminada correctamente.");

    window.location.href = "/admin/solicitudes";
  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar la solicitud.");
  }
}
  ;

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-10 text-center text-[#6B7280]">
        Cargando solicitud...
      </div>
    );
  }

  if (error || !solicitud) {
    return (
      <div className="space-y-6">
        <Button asChild variant="ghost" className="px-0">
          <Link href="/admin/solicitudes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a solicitudes
          </Link>
        </Button>

        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error || "No se encontró la solicitud."}
        </div>
      </div>
    );
  }

  const solicitudRegistrada = solicitud.estado_solicitud === "registrada";

  const solicitudRechazada = solicitud.estado_solicitud === "rechazada";

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Button asChild variant="ghost" className="mb-4 px-0">
              <Link href="/admin/solicitudes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a solicitudes
              </Link>
            </Button>

            <p className="text-sm font-semibold uppercase tracking-widest text-[#2563EB]">
              {solicitud.folio}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#1F2937]">
              Detalle de solicitud
            </h1>

            <p className="mt-2 text-[#6B7280]">
              Revisa la información enviada antes de tomar una decisión.
            </p>
          </div>

          {!solicitudRegistrada && !solicitudRechazada && (
            <div className="flex flex-wrap gap-2">
              {solicitud.estado_solicitud === "pendiente" && (
                <Button
                  variant="outline"
                  disabled={actualizandoEstado}
                  onClick={() => cambiarEstado("en_revision")}
                >
                  <Clock3 className="mr-2 h-4 w-4" />

                  {actualizandoEstado ? "Actualizando..." : "Pasar a revisión"}
                </Button>
              )}
              {solicitud.estado_solicitud === "en_revision" && (
                <Button
                  className="bg-[#16A34A] hover:bg-[#15803D]"
                  disabled={actualizandoEstado}
                  onClick={() => cambiarEstado("aprobada")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />

                  {actualizandoEstado ? "Aprobando..." : "Aprobar solicitud"}
                </Button>
              )}

              {solicitud.estado_solicitud === "aprobada" && (
                <Button asChild className="bg-[#7C3AED] hover:bg-[#6D28D9]">
                  <Link
                    href={`/admin/animales/nuevo?solicitudId=${solicitud.id}`}
                  >
                    <PawPrint className="mr-2 h-4 w-4" />
                    Registrar en Conecta Huellas
                  </Link>
                </Button>
              )}

              <Button
                variant="destructive"
                disabled={actualizandoEstado}
                onClick={() => setModalRechazoOpen(true)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Rechazar
              </Button>
            </div>
            
          )
          
          }
        </div>
        {solicitudRechazada && (
  <div className="flex justify-end">
    <Button
      variant="destructive"
      onClick={eliminar}
    >
      Eliminar solicitud
    </Button>
  </div>
)}

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
              <h2 className="text-xl font-bold text-[#1F2937]">
                Información del animal
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InfoItem
                  label="Nombre"
                  value={solicitud.nombre_animal || "Sin nombre"}
                />

                <InfoItem
                  label="Tipo"
                  value={formatearTexto(solicitud.tipo_animal)}
                />

                <InfoItem label="Sexo" value={formatearTexto(solicitud.sexo)} />

                <InfoItem
                  label="Edad aproximada"
                  value={solicitud.edad_aproximada || "No especificada"}
                />

                <InfoItem
                  label="Tamaño"
                  value={formatearTexto(solicitud.tamano)}
                />

                <InfoItem
                  label="Esterilizado"
                  value={formatearEsterilizado(solicitud.esterilizado)}
                />
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-[#6B7280]">
                  Descripción
                </p>

                <p className="mt-2 whitespace-pre-line text-[#1F2937]">
                  {solicitud.descripcion || "Sin descripción."}
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
              <h2 className="text-xl font-bold text-[#1F2937]">
                Fotografías y documentos
              </h2>

              {solicitud.multimedia?.length > 0 ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {solicitud.multimedia.map((media, index) => (
                    <div
                      key={`${media.url}-${index}`}
                      className="overflow-hidden rounded-2xl border border-[#E5E7EB]"
                    >
                      {media.type === "image" ? (
                        <img
                          src={media.url}
                          alt={`Multimedia ${index + 1}`}
                          className="h-64 w-full object-cover"
                        />
                      ) : (
                        <video
                          src={media.url}
                          controls
                          className="h-64 w-full bg-black object-contain"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-[#D1D5DB] bg-[#F8FAFC] p-10 text-center">
                  <FileText className="mx-auto h-8 w-8 text-[#9CA3AF]" />

                  <p className="mt-3 font-medium text-[#1F2937]">
                    No hay multimedia disponible
                  </p>
                </div>
              )}

              {solicitud.cartilla_vacunacion_url && (
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <a
                      href={solicitud.cartilla_vacunacion_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Ver cartilla de vacunación
                    </a>
                  </Button>
                </div>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
              <h2 className="text-xl font-bold text-[#1F2937]">Solicitante</h2>

              <div className="mt-6 space-y-5">
                <ContactItem
                  icon={<User className="h-5 w-5" />}
                  label="Nombre"
                  value={solicitud.solicitante_nombre}
                />

                {solicitud.solicitante_responsable && (
                  <ContactItem
                    icon={<User className="h-5 w-5" />}
                    label="Responsable"
                    value={solicitud.solicitante_responsable}
                  />
                )}

                <ContactItem
                  icon={<Phone className="h-5 w-5" />}
                  label="Teléfono"
                  value={solicitud.solicitante_telefono || "No proporcionado"}
                />

                <ContactItem
                  icon={<Mail className="h-5 w-5" />}
                  label="Correo"
                  value={solicitud.solicitante_correo || "No proporcionado"}
                />

                <ContactItem
                  icon={<MapPin className="h-5 w-5" />}
                  label="Lugar de estancia"
                  value={solicitud.lugar_estancia}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
              <h2 className="text-xl font-bold text-[#1F2937]">
                Información administrativa
              </h2>

              <div className="mt-6 space-y-4">
                <InfoItem
                  label="Estado"
                  value={formatearEstado(solicitud.estado_solicitud)}
                />

                <InfoItem
                  label="Fecha de solicitud"
                  value={new Date(solicitud.fecha_solicitud).toLocaleDateString(
                    "es-MX",
                  )}
                />

                {solicitud.fecha_revision && (
                  <InfoItem
                    label="Fecha de revisión"
                    value={new Date(
                      solicitud.fecha_revision,
                    ).toLocaleDateString("es-MX")}
                  />
                )}

                {solicitud.fecha_registro_animal && (
                  <InfoItem
                    label="Fecha de registro del animal"
                    value={new Date(
                      solicitud.fecha_registro_animal,
                    ).toLocaleDateString("es-MX")}
                  />
                )}
              </div>
            </section>

            {solicitud.comentario_resolucion && (
              <section className="rounded-3xl border border-red-200 bg-red-50 p-6">
                <h2 className="text-lg font-bold text-red-800">
                  Motivo de resolución
                </h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-red-700">
                  {solicitud.comentario_resolucion}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>

      {modalRechazoOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div>
              <h2 className="text-xl font-bold text-[#1F2937]">
                Rechazar solicitud
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                Escribe el motivo por el que esta solicitud no será incorporada
                a Conecta Huellas.
              </p>
            </div>

            <Textarea
              className="mt-5 min-h-[140px] resize-none"
              placeholder="Escribe el motivo del rechazo..."
              value={motivoRechazo}
              onChange={(event) => setMotivoRechazo(event.target.value)}
              maxLength={500}
            />

            <div className="mt-2 text-right text-xs text-[#9CA3AF]">
              {motivoRechazo.length} / 500
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={actualizandoEstado}
                onClick={() => {
                  setModalRechazoOpen(false);
                  setMotivoRechazo("");
                }}
              >
                Cancelar
              </Button>

              <Button
                type="button"
                variant="destructive"
                disabled={actualizandoEstado || !motivoRechazo.trim()}
                onClick={rechazarSolicitud}
              >
                {actualizandoEstado ? "Rechazando..." : "Confirmar rechazo"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#6B7280]">{label}</p>

      <p className="mt-1 text-[#1F2937]">{value}</p>
    </div>
  );
}

function ContactItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-[#2563EB]">{icon}</div>

      <div>
        <p className="text-sm font-semibold text-[#6B7280]">{label}</p>

        <p className="mt-1 text-[#1F2937]">{value}</p>
      </div>
    </div>
  );
}

function formatearTexto(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1).replaceAll("_", " ");
}

function formatearEstado(estado: string) {
  const estados: Record<string, string> = {
    pendiente: "Pendiente",
    en_revision: "En revisión",
    aprobada: "Aprobada",
    registrada: "Registrada",
    historial: "Historial",
    rechazada: "Rechazada",
  };

  return estados[estado] || estado;
}

function formatearEsterilizado(valor: string) {
  const valores: Record<string, string> = {
    si: "Sí",
    no: "No",
    no_se_sabe: "No se sabe",
  };

  return valores[valor] || valor;
}

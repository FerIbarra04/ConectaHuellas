"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Eye,
  FileCheck2,
  Search,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  getSolicitudes,
  restaurarSolicitud,
  type SolicitudAdmin,
} from "@/lib/api";

import { eliminarSolicitud } from "@/lib/api";

const estados = [
  { value: "todas", label: "Todas" },
  { value: "pendiente", label: "Pendientes" },
  { value: "en_revision", label: "En revisión" },
  { value: "aprobada", label: "Aprobadas" },
  { value: "registrada", label: "Registradas" },
  { value: "rechazada", label: "Rechazadas" },
];

export function SolicitudesAdmin() {
  const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(""); 
  const [estado, setEstado] = useState("todas");

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSolicitudes();
      setSolicitudes(data);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar las solicitudes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const restaurar = async (id: number) => {
    if (!confirm("¿Deseas restaurar esta solicitud?")) return;

    try {
      await restaurarSolicitud(id);
      await cargarSolicitudes();
setEstado("todas");

      alert("Solicitud restaurada correctamente.");
    } catch (error) {
      console.error(error);
      alert("No se pudo restaurar la solicitud.");
    }
  };

  const filtradas = useMemo(() => {
    return solicitudes.filter((solicitud) => {
      const coincideEstado =
        estado === "todas" || solicitud.estado_solicitud === estado;

      const texto = search.toLowerCase().trim();

      const coincideBusqueda =
        texto === "" ||
        solicitud.folio?.toLowerCase().includes(texto) ||
        solicitud.nombre_animal?.toLowerCase().includes(texto) ||
        solicitud.solicitante_nombre?.toLowerCase().includes(texto);

      return coincideEstado && coincideBusqueda;
    });
  }, [solicitudes, search, estado]);

  const historial = filtradas.filter((s) => s.estado_solicitud === "historial");

  const solicitudesActivas = filtradas.filter(
    (s) => s.estado_solicitud !== "historial",
  );

  const pendientes = solicitudes.filter(
    (s) => s.estado_solicitud === "pendiente",
  ).length;

  const enRevision = solicitudes.filter(
    (s) => s.estado_solicitud === "en_revision",
  ).length;

  const aprobadas = solicitudes.filter(
    (s) => s.estado_solicitud === "aprobada",
  ).length;

  const registradas = solicitudes.filter(
    (s) => s.estado_solicitud === "registrada",
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-[#2563EB]">
          Administración
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#1F2937]">
          Solicitudes de incorporación
        </h1>

        <p className="mt-2 text-[#6B7280]">
          Revisa y gestiona las solicitudes enviadas por personas y
          agrupaciones.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pendientes"
          value={pendientes}
          icon={<Clock3 className="h-5 w-5 text-[#D97706]" />}
          bg="bg-[#FEF3C7]"
        />

        <StatCard
          label="En revisión"
          value={enRevision}
          icon={<AlertCircle className="h-5 w-5 text-[#2563EB]" />}
          bg="bg-[#DBEAFE]"
        />

        <StatCard
          label="Aprobadas"
          value={aprobadas}
          icon={<CheckCircle2 className="h-5 w-5 text-[#16A34A]" />}
          bg="bg-[#DCFCE7]"
        />

        <StatCard
          label="Registradas"
          value={registradas}
          icon={<FileCheck2 className="h-5 w-5 text-[#7C3AED]" />}
          bg="bg-[#EDE9FE]"
        />
      </div>

      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />

            <Input
              className="pl-9"
              placeholder="Buscar por folio, animal o solicitante..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {estados.map((item) => (
              <Button
                key={item.value}
                type="button"
                variant={estado === item.value ? "default" : "outline"}
                onClick={() => setEstado(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-10 text-center text-[#6B7280]">
          Cargando solicitudes...
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      )}
      {!loading &&
  !error &&
  solicitudesActivas.length === 0 &&
  historial.length === 0 && (
    <div className="rounded-3xl border border-[#E5E7EB] bg-white p-10 text-center">
      <p className="font-semibold text-[#1F2937]">
        No hay solicitudes para mostrar
      </p>

      <p className="mt-2 text-sm text-[#6B7280]">
        Las solicitudes enviadas aparecerán aquí.
      </p>
    </div>
)}

      {!loading && !error && filtradas.length > 0 && (
        <div className="space-y-10">
          <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                      Folio
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                      Animal
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                      Solicitante
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                      Estado
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                      Fecha
                    </th>

                    <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                      Restauraciones
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#6B7280]">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E5E7EB]">
                  {solicitudesActivas.map((solicitud) => (
                    <tr
                      key={solicitud.id}
                      className="transition-colors hover:bg-[#F8FAFC]"
                    >
                      <td className="px-5 py-4 font-semibold text-[#2563EB]">
                        {solicitud.folio}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#1F2937]">
                          {solicitud.nombre_animal || "Sin nombre"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-[#1F2937]">
                          {solicitud.solicitante_nombre}
                        </p>

                        <p className="mt-1 text-xs text-[#6B7280]">
                          {solicitud.tipo_solicitante === "agrupacion"
                            ? "Agrupación"
                            : "Persona particular"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <EstadoBadge estado={solicitud.estado_solicitud} />

                          {solicitud.estado_solicitud === "aprobada" &&
                            solicitud.fue_registrada &&
                            solicitud.veces_restaurada > 0 && (
                              <span className="inline-flex w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                🔄 Registrada anteriormente
                              </span>
                            )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#6B7280]">
                        {solicitud.fecha_solicitud
                          ? new Date(
                              solicitud.fecha_solicitud,
                            ).toLocaleDateString("es-MX")
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex min-w-8 items-center justify-center rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#2563EB]">
                          {solicitud.veces_restaurada}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/solicitudes/${solicitud.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Revisar
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
<div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
            <div className="border-b border-[#E5E7EB] px-6 py-4">
              <h2 className="text-lg font-bold text-[#1F2937]">🗂 Historial</h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                Solicitudes que anteriormente fueron registradas como animales externos y cuyos registros fueron eliminados del catálogo. Estas solicitudes pueden restaurarse para volver a registrarlas cuando sea necesario.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F9FAFB]"><tr>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6B7280]">Folio</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6B7280]">Animal</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6B7280]">Solicitante</th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#6B7280]">Fecha</th>
                  <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#6B7280]">Restauraciones</th>
                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#6B7280]">Acción</th>
                </tr></thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {historial.length===0?(
                    <tr><td colSpan={6} className="px-5 py-10 text-center text-[#6B7280]">No hay solicitudes en el historial.</td></tr>
                  ):(
                    historial.map((solicitud)=>(
                      <tr key={solicitud.id} className="transition-colors hover:bg-[#F8FAFC]">
                        <td className="px-5 py-4 font-semibold text-[#2563EB]">{solicitud.folio}</td>
                        <td className="px-5 py-4">{solicitud.nombre_animal||"Sin nombre"}</td>
                        <td className="px-5 py-4">{solicitud.solicitante_nombre}</td>
                        <td className="px-5 py-4 text-sm text-[#6B7280]">{solicitud.fecha_solicitud?new Date(solicitud.fecha_solicitud).toLocaleDateString("es-MX"):"—"}</td>
                        <td className="px-5 py-4 text-center"><span className="inline-flex min-w-8 items-center justify-center rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#2563EB]">{solicitud.veces_restaurada}</span></td>
                        <td className="px-5 py-4"><div className="flex justify-end gap-2">
                          <Button asChild variant="outline" size="sm"><Link href={`/admin/solicitudes/${solicitud.id}`}><Eye className="mr-2 h-4 w-4" />Ver</Link></Button>
                          <Button size="sm" onClick={()=>restaurar(solicitud.id)} disabled={loading}>Restaurar</Button>
                        </div></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function StatCard({
  label,
  value,
  icon,
  bg,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${bg}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-3xl font-bold text-[#1F2937]">{value}</p>

      <p className="mt-1 text-sm text-[#6B7280]">{label}</p>
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const styles: Record<string, string> = {
    pendiente: "bg-[#FEF3C7] text-[#B45309]",
    en_revision: "bg-[#DBEAFE] text-[#1D4ED8]",
    aprobada: "bg-[#DCFCE7] text-[#15803D]",
    registrada: "bg-[#EDE9FE] text-[#6D28D9]",
    historial: "bg-slate-100 text-slate-700",
    rechazada: "bg-red-100 text-red-700",
  };

  const labels: Record<string, string> = {
    pendiente: "Pendiente",
    en_revision: "En revisión",
    aprobada: "Aprobada",
    registrada: "Registrada",
    historial: "Historial",
    rechazada: "Rechazada",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[estado] ?? "bg-[#F3F4F6] text-[#4B5563]"
      }`}
    >
      {labels[estado] || estado}
    </span>
  );
}
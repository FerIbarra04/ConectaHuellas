import { SolicitudDetalle } from "@/components/admin/solicitudes/solicitud-detalle"

interface SolicitudDetallePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SolicitudDetallePage({
  params,
}: SolicitudDetallePageProps) {
  const { id } = await params

  return <SolicitudDetalle id={id} />
}
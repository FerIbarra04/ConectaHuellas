import { SolicitudAdopcionDetalle } from "@/components/admin/solicitudes-adopcion/solicitud-adopcion-detalle";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SolicitudAdopcionDetalle id={id} />
  );
}
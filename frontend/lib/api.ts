import type { Animal } from "./types";

const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.API_URL || "http://127.0.0.1:3001"
    : process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("La URL de la API no está configurada");
}

const ADMIN_TOKEN_KEY = "conecta-huellas-admin-token";
export async function eliminarSolicitud(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/solicitudes/${id}`, {
    method: "DELETE",
    headers: {
      ...getAdminAuthHeaders(),
    },
  });

  await handleResponse(res);
}

/* ======================================================
   🔐 AUTENTICACIÓN ADMINISTRATIVA
====================================================== */

function getAdminAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

/* ======================================================
   ERROR PERSONALIZADO DE LA API
====================================================== */

export class ApiError extends Error {
  status: number;
  code?: string;
  solicitudId?: number;
  folio?: string;

  constructor(
    message: string,
    datos: {
      status: number;
      code?: string;
      solicitudId?: number;
      folio?: string;
    },
  ) {
    super(message);

    this.name = "ApiError";
    this.status = datos.status;
    this.code = datos.code;
    this.solicitudId = datos.solicitudId;
    this.folio = datos.folio;
  }
}

/* ======================================================
   RESPUESTA GENERAL DE LA API
====================================================== */

const handleResponse = async <T = unknown>(res: Response): Promise<T> => {
  const contentType = res.headers.get("content-type");

  if (!res.ok) {
    let errorData: {
      error?: unknown;
      message?: string;
      code?: string;
      solicitud_id?: number;
      folio?: string;
    } | null = null;

    if (contentType?.includes("application/json")) {
      errorData = await res.json().catch(() => null);
    }

    let message = "Ocurrió un error en la API.";

    if (typeof errorData?.message === "string") {
      message = errorData.message;
    } else if (typeof errorData?.error === "string") {
      message = errorData.error;
    } else if (errorData?.error) {
      message = JSON.stringify(errorData.error);
    }
    console.error("STATUS:", res.status);

    const texto = await res.clone().text();

    console.error("RESPUESTA DEL BACKEND:", texto);
    throw new ApiError(message, {
      status: res.status,
      code: errorData?.code,
      solicitudId: errorData?.solicitud_id,
      folio: errorData?.folio,
    });
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
};
/* ======================================================
   🐶 GET TODOS LOS ANIMALES
====================================================== */

export async function getAnimales(): Promise<Animal[]> {
  const res = await fetch(`${API_BASE_URL}/animales`, {
    cache: "no-store",
  });

  return handleResponse<Animal[]>(res);
}

/* ======================================================
   🐶 GET ANIMAL POR ID
====================================================== */

export async function getAnimalById(id: number): Promise<Animal | null> {
  const res = await fetch(`${API_BASE_URL}/animales/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

/* ======================================================
   ➕ CREAR ANIMAL
====================================================== */

export async function createAnimal(data: Partial<Animal>) {
  const res = await fetch(`${API_BASE_URL}/animales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

/* ======================================================
   ✏️ ACTUALIZAR ANIMAL
====================================================== */

export async function updateAnimal(id: number, data: Partial<Animal>) {
  const res = await fetch(`${API_BASE_URL}/animales/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

/* ======================================================
   ❌ ELIMINAR ANIMAL
====================================================== */

export async function deleteAnimal(id: number) {
  const res = await fetch(`${API_BASE_URL}/animales/${id}`, {
    method: "DELETE",
  });

  return handleResponse(res);
}

/* ======================================================
   🏷 CREAR TAG
====================================================== */

export async function createTag(nombre: string) {
  const res = await fetch(`${API_BASE_URL}/tags`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre }),
  });

  return handleResponse(res);
}

/* ======================================================
   🏷 GET TAGS
====================================================== */

export async function getTags() {
  const res = await fetch(`${API_BASE_URL}/tags`, {
    cache: "no-store",
  });

  return handleResponse(res);
}

/* ======================================================
   🗑 ELIMINAR TAG
====================================================== */

export async function deleteTag(id: number) {
  const res = await fetch(`${API_BASE_URL}/tags/${id}`, {
    method: "DELETE",
  });

  return handleResponse(res);
}

/* ======================================================
   ✏️ EDITAR TAG
====================================================== */

export async function updateTag(id: number, nombre: string) {
  const res = await fetch(`${API_BASE_URL}/tags/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nombre }),
  });

  return handleResponse(res);
}

/* ======================================================
   📷 MULTIMEDIA
====================================================== */

export async function uploadFile(file: File): Promise<{
  url: string;
}> {
  const formData = new FormData();

  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  return handleResponse<{ url: string }>(res);
}

/* ======================================================
   SOLICITANTES
====================================================== */

export interface CreateSolicitanteData {
  tipo_solicitante: "persona" | "agrupacion";
  nombre: string;
  responsable?: string | null;
  telefono?: string | null;
  correo?: string | null;
  ubicacion: string;
  comprobante_domicilio_url?: string | null;
  ine_url?: string | null;
  observaciones?: string | null;
}

export interface Solicitante {
  id: number;
  tipo_solicitante: "persona" | "agrupacion";
  nombre: string;
  responsable: string | null;
  telefono: string | null;
  correo: string | null;
  ubicacion: string;
  comprobante_domicilio_url: string | null;
  ine_url: string | null;
  estado: "activo" | "inactivo";
}

export async function createSolicitante(data: CreateSolicitanteData): Promise<{
  id: number;
  message: string;
}> {
  const res = await fetch(`${API_BASE_URL}/solicitantes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);

    throw new Error(
      error?.message ||
        error?.error?.message ||
        error?.error ||
        "No se pudo registrar al solicitante.",
    );
  }

  return res.json();
}

export async function buscarSolicitantes(
  query: string,
): Promise<Solicitante[]> {
  const res = await fetch(
    `${API_BASE_URL}/solicitantes/buscar?q=${encodeURIComponent(query)}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("No se pudieron buscar los solicitantes.");
  }

  return res.json();
}

/* ======================================================
   SOLICITUDES DE INCORPORACIÓN
====================================================== */

export interface CreateSolicitudData {
  solicitante_id: number;
  nombre_animal?: string | null;
  tipo_animal: "perro" | "gato";
  sexo: "macho" | "hembra" | "desconocido";
  edad_aproximada?: string | null;
  tamano: "pequeño" | "mediano" | "grande";
  esterilizado: "si" | "no" | "no_se_sabe";
  descripcion?: string | null;
  lugar_estancia: string;
  multimedia: Array<{
    type: "image" | "video";
    url: string;
  }>;
  cartilla_vacunacion_url?: string | null;
}

export interface SolicitudAdmin {
  id: number;
  folio: string;
  solicitante_id: number;
  animal_id: number | null;
  fue_registrada: boolean;
  veces_restaurada: number;
  nombre_animal: string | null;
  tipo_animal: "perro" | "gato";
  sexo: "macho" | "hembra" | "desconocido";
  edad_aproximada: string | null;
  tamano: "pequeño" | "mediano" | "grande";
  esterilizado: "si" | "no" | "no_se_sabe";
  descripcion: string | null;
  lugar_estancia: string;
  multimedia: Array<{
    type: "image" | "video";
    url: string;
  }>;
  cartilla_vacunacion_url: string | null;
  estado_solicitud:
    | "pendiente"
    | "en_revision"
    | "aprobada"
    | "registrada"
    | "historial"
    | "rechazada";
  observaciones_admin: string | null;
  comentario_resolucion: string | null;
  fecha_solicitud: string;
  fecha_revision: string | null;
  fecha_registro_animal: string | null;
  tipo_solicitante: "persona" | "agrupacion";
  solicitante_nombre: string;
  solicitante_responsable: string | null;
  solicitante_telefono: string | null;
  solicitante_correo: string | null;
}

export async function createSolicitud(data: CreateSolicitudData): Promise<{
  id: number;
  folio: string;
  message: string;
}> {
  const res = await fetch(`${API_BASE_URL}/solicitudes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);

    throw new Error(
      error?.message ||
        error?.error?.message ||
        error?.error ||
        "No se pudo enviar la solicitud.",
    );
  }

  return res.json();
}

export async function getSolicitudes(): Promise<SolicitudAdmin[]> {
  const res = await fetch(`${API_BASE_URL}/solicitudes`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("No se pudieron obtener las solicitudes.");
  }

  return res.json();
}

export async function getSolicitudById(
  id: string | number,
): Promise<SolicitudAdmin> {
  const res = await fetch(`${API_BASE_URL}/solicitudes/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("No se pudo obtener la solicitud.");
  }

  return res.json();
}

export async function registrarSolicitudComoAnimal(
  solicitudId: string | number,
  animalId: string | number,
): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/solicitudes/${solicitudId}/registrar`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAdminAuthHeaders(),
      },
      body: JSON.stringify({
        animal_id: animalId,
      }),
    },
  );

  await handleResponse(res);
}
export async function updateSolicitudEstado(
  id: string | number,
  data: {
    estado_solicitud:
      | "pendiente"
      | "en_revision"
      | "aprobada"
      | "registrada"
      | "historial"
      | "rechazada";
    observaciones_admin?: string | null;
    comentario_resolucion?: string | null;
  },
): Promise<void> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(ADMIN_TOKEN_KEY)
      : null;

  if (!token) {
    throw new Error(
      "No se encontró una sesión administrativa. Inicia sesión nuevamente.",
    );
  }

  const res = await fetch(`${API_BASE_URL}/solicitudes/${id}/estado`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);

    throw new Error(
      error?.error || "No se pudo actualizar el estado de la solicitud.",
    );
  }
}
/* ======================================================
   LANDING PAGE
====================================================== */

export interface LandingHero {
  titulo: string;
  descripcion: string;
  frase: string;
}

export interface LandingContenidoItem {
  titulo: string;
  descripcion: string;
}

export interface LandingFooter {
  descripcion: string;
  frase: string;
  correo: string;
  facebook_url: string;
  instagram_url: string;
}

export interface LandingAnimalDestacado {
  id: number;
  animal_id: number;
  imagen_sin_fondo_url: string;
  orden: number;
  nombre: string;
  edad: string | null;
  tamaño: string | null;
  estado: string | null;
}

export interface LandingConfig {
  id: number;
  hero: LandingHero;
  proposito: LandingContenidoItem[];
  proceso_adopcion: LandingContenidoItem[];
  concientizacion: LandingContenidoItem[];
  footer: LandingFooter;
  fecha_actualizacion: string;
  animales_destacados: LandingAnimalDestacado[];
}

export interface UpdateLandingData {
  hero: LandingHero;
  proposito: LandingContenidoItem[];
  proceso_adopcion: LandingContenidoItem[];
  concientizacion: LandingContenidoItem[];
  footer: LandingFooter;
}

/* ======================================================
   GET LANDING PÚBLICO
====================================================== */

export async function getLanding(): Promise<LandingConfig> {
  const url = `${API_BASE_URL}/landing`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);

    throw new Error(
      error?.error ||
        error?.message ||
        "No se pudo obtener el contenido del landing.",
    );
  }

  return res.json();
}

/* ======================================================
   ACTUALIZAR CONTENIDO DEL LANDING
====================================================== */

export async function updateLanding(data: UpdateLandingData) {
  const url = `${API_BASE_URL}/landing`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  const textoRespuesta = await res.text();

  console.log("URL LANDING:", url);
  console.log("STATUS LANDING:", res.status);
  console.log("RESPUESTA LANDING:", textoRespuesta);

  let respuesta: {
    error?: string;
    message?: string;
  } | null = null;

  try {
    respuesta = textoRespuesta ? JSON.parse(textoRespuesta) : null;
  } catch {
    respuesta = null;
  }

  if (!res.ok) {
    throw new Error(
      respuesta?.error ||
        respuesta?.message ||
        textoRespuesta ||
        `No se pudo actualizar el landing. Código HTTP: ${res.status}`,
    );
  }

  return respuesta;
}

/* ======================================================
   AGREGAR ANIMAL DESTACADO
====================================================== */

export async function addLandingDestacado(data: {
  animal_id: number;
  imagen_sin_fondo_url: string;
  orden: number;
}): Promise<{ id: number }> {
  const res = await fetch(`${API_BASE_URL}/landing/destacados`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);

    throw new Error(
      error?.error ||
        error?.message ||
        "No se pudo agregar el animal destacado.",
    );
  }

  return res.json();
}

/* ======================================================
   ACTUALIZAR ANIMAL DESTACADO
====================================================== */

export async function updateLandingDestacado(
  id: number,
  data: {
    imagen_sin_fondo_url: string;
    orden: number;
  },
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/landing/destacados/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);

    throw new Error(
      error?.error ||
        error?.message ||
        "No se pudo actualizar el animal destacado.",
    );
  }
}

/* ======================================================
   ELIMINAR ANIMAL DESTACADO
====================================================== */

export async function deleteLandingDestacado(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/landing/destacados/${id}`, {
    method: "DELETE",
    headers: {
      ...getAdminAuthHeaders(),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);

    throw new Error(
      error?.error ||
        error?.message ||
        "No se pudo quitar el animal destacado.",
    );
  }
}

export async function restaurarSolicitud(id: number) {
  const res = await fetch(`${API_BASE_URL}/solicitudes/${id}/restaurar`, {
    method: "PUT",
    headers: {
      ...getAdminAuthHeaders(),
    },
  });

  return handleResponse(res);
}

/* ======================================================
   SOLICITUDES DE ADOPCIÓN
====================================================== */

export interface SolicitudAdopcion {
  id: number;
  animal_id: number;

  nombre_animal: string;
  multimedia: {
  url: string;
  type: "image" | "video";
}[];

  nombre_completo: string;
  telefono: string;

  estado: "nueva" | "contactado" | "finalizada";

  fecha_solicitud: string;
}

export async function getSolicitudesAdopcion(): Promise<SolicitudAdopcion[]> {
  const res = await fetch(`${API_BASE_URL}/solicitudes-adopcion`, {
    cache: "no-store",
    headers: {
      ...getAdminAuthHeaders(),
    },
  });

  return handleResponse<SolicitudAdopcion[]>(res);
}

export async function getSolicitudAdopcionById(
  id: number | string,
): Promise<SolicitudAdopcion> {
  const res = await fetch(`${API_BASE_URL}/solicitudes-adopcion/${id}`, {
    cache: "no-store",
    headers: {
      ...getAdminAuthHeaders(),
    },
  });

  return handleResponse<SolicitudAdopcion>(res);
}

export async function actualizarEstadoSolicitudAdopcion(
  id: number,
  estado: "nueva" | "contactado" | "finalizada",
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/solicitudes-adopcion/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify({
      estado,
    }),
  });

  await handleResponse(res);
}

export async function eliminarSolicitudAdopcion(
  id: number,
): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/solicitudes-adopcion/${id}`,
    {
      method: "DELETE",
      headers: {
        ...getAdminAuthHeaders(),
      },
    },
  );

  await handleResponse(res);
}
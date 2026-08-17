"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, PawPrint } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SolicitanteForm } from "@/components/solicitud/solicitante-form";
import { AnimalSolicitudForm } from "@/components/solicitud/animal-solicitud-form";
import { DocumentosSolicitudForm } from "@/components/solicitud/documentos-solicitud-form";
import { ResumenSolicitud } from "@/components/solicitud/resumen-solicitud";

import { createSolicitante, createSolicitud, uploadFile } from "@/lib/api";

import {
  compressVideo,
  type VideoCompressionProgress,
} from "@/lib/compress-video";

export type SolicitudFormData = {
  solicitante: {
    solicitanteId: number | null;
    solicitanteSeleccionado: string;
    tipo: "persona" | "agrupacion" | "";
    agrupacionExistente: "si" | "no" | "";
    nombre: string;
    responsable: string;
    telefono: string;
    correo: string;
    ubicacion: string;
    ineFile: File | null;
    comprobanteFile: File | null;
    busquedaAgrupacion: string;
  };

  animal: {
    nombre: string;
    edad: string;
    tipo: string;
    sexo: string;
    tamano: string;
    esterilizado: string;
  };

  documentos: {
    lugarEstancia: string;
    descripcion: string;
    fotos: File[];
    video: File | null;
    cartilla: File | null;
  };
};

const initialFormData: SolicitudFormData = {
  solicitante: {
    solicitanteId: null,
    solicitanteSeleccionado: "",
    tipo: "",
    agrupacionExistente: "",
    nombre: "",
    responsable: "",
    telefono: "",
    correo: "",
    ubicacion: "",
    ineFile: null,
    comprobanteFile: null,
    busquedaAgrupacion: "",
  },

  animal: {
    nombre: "",
    edad: "",
    tipo: "",
    sexo: "desconocido",
    tamano: "",
    esterilizado: "no_se_sabe",
  },

  documentos: {
    lugarEstancia: "",
    descripcion: "",
    fotos: [],
    video: null,
    cartilla: null,
  },
};

const steps = [
  {
    id: 1,
    title: "Solicitante",
    description: "Información de la persona o agrupación",
  },
  {
    id: 2,
    title: "Animal",
    description: "Datos generales del animal",
  },
  {
    id: 3,
    title: "Documentos",
    description: "Evidencia, cartilla y ubicación",
  },
  {
    id: 4,
    title: "Resumen",
    description: "Revisa antes de enviar",
  },
  {
    id: 5,
    title: "Enviado",
    description: "Confirmación de solicitud",
  },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function obtenerTamanoMB(file: File) {
  return (file.size / (1024 * 1024)).toFixed(1);
}

function validarArchivo(file: File, tipoArchivo: string) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `${tipoArchivo} "${file.name}" pesa ${obtenerTamanoMB(file)} MB. El tamaño máximo permitido es de 10 MB.`,
    );
  }
}

export function SolicitudWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepValid, setStepValid] = useState(false);

  const [formData, setFormData] = useState<SolicitudFormData>(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const [folioGenerado, setFolioGenerado] = useState("");

  const [submitStatus, setSubmitStatus] = useState("");

  const [compressionProgress, setCompressionProgress] = useState(0);

  const progress = (currentStep / steps.length) * 100;

  const current = steps.find((step) => step.id === currentStep);

  const updateSolicitante = (
    data: Partial<SolicitudFormData["solicitante"]>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      solicitante: {
        ...prev.solicitante,
        ...data,
      },
    }));
  };

  const updateAnimal = (data: Partial<SolicitudFormData["animal"]>) => {
    setFormData((prev) => ({
      ...prev,
      animal: {
        ...prev.animal,
        ...data,
      },
    }));
  };

  const updateDocumentos = (data: Partial<SolicitudFormData["documentos"]>) => {
    setFormData((prev) => ({
      ...prev,
      documentos: {
        ...prev.documentos,
        ...data,
      },
    }));
  };

  const validarArchivosSolicitud = () => {
    const { ineFile, comprobanteFile } = formData.solicitante;

    const { fotos, cartilla } = formData.documentos;

    if (ineFile) {
      validarArchivo(ineFile, "La identificación oficial");
    }

    if (comprobanteFile) {
      validarArchivo(comprobanteFile, "El comprobante de domicilio");
    }

    fotos.forEach((foto, index) => {
      validarArchivo(foto, `La fotografía ${index + 1}`);
    });

    if (cartilla) {
      validarArchivo(cartilla, "La cartilla de vacunación");
    }
  };
  const handleCompressionProgress = (progress: VideoCompressionProgress) => {
    setCompressionProgress(progress.progress);

    if (progress.stage === "loading") {
      setSubmitStatus(
        progress.progress < 100
          ? "Preparando el compresor de video..."
          : "Compresor preparado.",
      );

      return;
    }

    if (progress.stage === "compressing") {
      setSubmitStatus(`Adaptando video para reducir su tamaño... ${progress.progress}%`);

      return;
    }

    setSubmitStatus("Verificando el tamaño del video...");
  };
  const handleSubmitSolicitud = async () => {
    if (!stepValid || currentStep !== 4 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitStatus("Preparando solicitud...");
    setCompressionProgress(0);

    try {
      validarArchivosSolicitud();

      let solicitanteId = formData.solicitante.solicitanteId;

      if (!solicitanteId) {
        if (
          formData.solicitante.tipo === "agrupacion" &&
          formData.solicitante.agrupacionExistente === "si"
        ) {
          throw new Error(
            "Debes seleccionar una agrupación registrada en el buscador.",
          );
        }

        if (!formData.solicitante.ineFile) {
          throw new Error("Debes agregar la identificación oficial.");
        }

        if (!formData.solicitante.comprobanteFile) {
          throw new Error("Debes agregar el comprobante de domicilio.");
        }
        setSubmitStatus("Subiendo documentos del solicitante...");

        const [ineUploaded, comprobanteUploaded] = await Promise.all([
          uploadFile(formData.solicitante.ineFile),
          uploadFile(formData.solicitante.comprobanteFile),
        ]);

        const solicitanteCreado = await createSolicitante({
          tipo_solicitante: formData.solicitante.tipo as
            | "persona"
            | "agrupacion",

          nombre: formData.solicitante.nombre,

          responsable:
            formData.solicitante.tipo === "agrupacion"
              ? formData.solicitante.responsable || null
              : null,

          telefono: formData.solicitante.telefono || null,

          correo: formData.solicitante.correo || null,

          ubicacion: formData.solicitante.ubicacion,

          ine_url: ineUploaded.url,

          comprobante_domicilio_url: comprobanteUploaded.url,
        });

        solicitanteId = solicitanteCreado.id;
      }

      if (!solicitanteId) {
        throw new Error("No se pudo identificar al solicitante.");
      }

      setSubmitStatus("Subiendo fotografías del animal...");
      const fotosSubidas = await Promise.all(
        formData.documentos.fotos.map(async (foto) => {
          const uploaded = await uploadFile(foto);

          return {
            type: "image" as const,
            url: uploaded.url,
          };
        }),
      );

      let videoSubido: {
        type: "video";
        url: string;
      } | null = null;

      if (formData.documentos.video) {
        const originalVideo = formData.documentos.video;

        let videoToUpload = originalVideo;

        if (originalVideo.size > MAX_FILE_SIZE) {
          videoToUpload = await compressVideo(originalVideo, {
            onProgress: handleCompressionProgress,
          });
        }

        setSubmitStatus("Subiendo video...");

        const uploaded = await uploadFile(videoToUpload);

        videoSubido = {
          type: "video",
          url: uploaded.url,
        };
      }

      let cartillaUrl: string | null = null;

      if (formData.documentos.cartilla) {
        const uploaded = await uploadFile(formData.documentos.cartilla);

        cartillaUrl = uploaded.url;
      }

      const multimedia = [
        ...fotosSubidas,
        ...(videoSubido ? [videoSubido] : []),
      ];

      setSubmitStatus("Guardando la solicitud...");
      const solicitudCreada = await createSolicitud({
        solicitante_id: solicitanteId,

        nombre_animal: formData.animal.nombre || null,

        tipo_animal: formData.animal.tipo as "perro" | "gato",

        sexo: formData.animal.sexo as "macho" | "hembra" | "desconocido",

        edad_aproximada: formData.animal.edad || null,

        tamano: formData.animal.tamano as "pequeño" | "mediano" | "grande",

        esterilizado: formData.animal.esterilizado as
          | "si"
          | "no"
          | "no_se_sabe",

        descripcion: formData.documentos.descripcion || null,

        lugar_estancia: formData.documentos.lugarEstancia,

        multimedia,

        cartilla_vacunacion_url: cartillaUrl,
      });

      setFolioGenerado(solicitudCreada.folio);

      setSubmitStatus("");
      setCompressionProgress(0);
      setCurrentStep(5);
      setStepValid(false);
    } catch (error) {
      setSubmitStatus("");
      setCompressionProgress(0);
      console.error("Error enviando solicitud:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al enviar la solicitud.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const goNext = () => {
    if (!stepValid && currentStep < 5) {
      alert("Completa la información requerida para continuar.");

      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);

      setStepValid(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);

      setStepValid(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <section className="mx-auto max-w-5xl px-3 py-5 sm:px-6 sm:py-10 lg:px-8">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#2563EB] sm:mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm sm:rounded-3xl">
          <div className="bg-gradient-to-r from-[#DBEAFE] to-[#DCFCE7] px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
            <div className="flex items-start gap-3 sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm sm:h-12 sm:w-12 sm:rounded-2xl">
                <PawPrint className="h-5 w-5 text-[#2563EB] sm:h-6 sm:w-6" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB] sm:text-sm sm:tracking-widest">
                  Solicitud de incorporación
                </p>

                <h1 className="mt-1 text-xl font-extrabold leading-tight text-[#1F2937] sm:mt-0 sm:text-3xl">
                  Registro de caso animal
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#4B5563]">
              Completa la información solicitada para que la Coordinación de
              Medio Ambiente y Protección Animal revise el caso.
            </p>
          </div>

          <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-10">
            <div className="mb-6 sm:mb-8">
              <div className="mb-3 flex items-center justify-between gap-4 text-sm">
                <div>
                  <p className="font-medium text-[#1F2937]">
                    Paso {currentStep} de {steps.length}
                  </p>

                  <p className="mt-0.5 text-xs font-semibold text-[#2563EB] sm:hidden">
                    {current?.title}
                  </p>
                </div>

                <span className="hidden text-[#6B7280] sm:block">
                  {current?.title}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
                <div
                  className="h-full rounded-full bg-[#2563EB] transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            <div className="mb-10 hidden gap-3 sm:grid sm:grid-cols-5">
              {steps.map((step) => {
                const isActive = step.id === currentStep;

                const isCompleted = step.id < currentStep;

                return (
                  <div
                    key={step.id}
                    className={`rounded-2xl border p-3 transition-all ${
                      isActive
                        ? "border-[#2563EB] bg-[#DBEAFE]/60"
                        : isCompleted
                          ? "border-[#22C55E]/30 bg-[#DCFCE7]/60"
                          : "border-[#E5E7EB] bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                          isCompleted
                            ? "bg-[#22C55E] text-white"
                            : isActive
                              ? "bg-[#2563EB] text-white"
                              : "bg-[#F3F4F6] text-[#6B7280]"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          step.id
                        )}
                      </div>

                      <span className="text-xs font-semibold text-[#1F2937]">
                        {step.title}
                      </span>
                    </div>

                    <p className="mt-2 hidden text-xs leading-relaxed text-[#6B7280] lg:block">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="min-h-[280px] rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4 sm:rounded-3xl sm:p-8">
              {currentStep === 1 && (
                <SolicitanteForm
                  data={formData.solicitante}
                  onChange={updateSolicitante}
                  onValidChange={setStepValid}
                />
              )}

              {currentStep === 2 && (
                <AnimalSolicitudForm
                  data={formData.animal}
                  onChange={updateAnimal}
                  onValidChange={setStepValid}
                />
              )}

              {currentStep === 3 && (
                <DocumentosSolicitudForm
                  data={formData.documentos}
                  onChange={updateDocumentos}
                  onValidChange={setStepValid}
                />
              )}

              {currentStep === 4 && (
                <ResumenSolicitud
                  data={formData}
                  onValidChange={setStepValid}
                />
              )}

              {currentStep === 5 && (
                <div className="py-4 text-center sm:py-6">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7]">
                    <CheckCircle2 className="h-8 w-8 text-[#22C55E]" />
                  </div>

                  <h2 className="text-xl font-bold text-[#1F2937]">
                    Solicitud enviada
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#6B7280]">
                    Tu solicitud fue enviada correctamente y será revisada por
                    la Coordinación de Medio Ambiente y Protección Animal.
                  </p>

                  {folioGenerado && (
                    <div className="mx-auto mt-5 w-fit max-w-full rounded-2xl border border-[#BBF7D0] bg-white px-4 py-3 sm:px-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]">
                        Folio de seguimiento
                      </p>

                      <p className="mt-1 break-all text-lg font-extrabold text-[#15803D]">
                        {folioGenerado}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isSubmitting && submitStatus && (
              <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-blue-800">
                    {submitStatus}
                  </p>

                  {submitStatus.includes("Adaptando video") && (
                    <span className="text-xs font-bold text-blue-700">
                      {compressionProgress}%
                    </span>
                  )}
                </div>

                {submitStatus.includes("Adaptando video") && (
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100">
                    <div
                      className="h-full rounded-full bg-[#2563EB] transition-all duration-300"
                      style={{
                        width: `${compressionProgress}%`,
                      }}
                    />
                  </div>
                )}

                <p className="mt-2 text-xs leading-relaxed text-blue-700">
                  No cierres esta página mientras se procesa la solicitud.
                </p>
              </div>
            )}
            {submitError && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
              {currentStep < 5 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={currentStep === 1 || isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Anterior
                </Button>
              ) : (
                <div />
              )}

              {currentStep === 4 ? (
                <Button
                  type="button"
                  onClick={handleSubmitSolicitud}
                  disabled={!stepValid || isSubmitting}
                  className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isSubmitting ? "Enviando solicitud..." : "Enviar solicitud"}
                </Button>
              ) : currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={goNext}
                  disabled={!stepValid || isSubmitting}
                  className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  asChild
                  className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] sm:w-auto"
                >
                  <Link href="/">Volver al inicio</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

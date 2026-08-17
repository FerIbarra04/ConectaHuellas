"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, PawPrint, Phone, User } from "lucide-react";

import type { Animal } from "@/lib/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AdoptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal: Animal;
}

export function AdoptionModal({
  open,
  onOpenChange,
  animal,
}: AdoptionModalProps) {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================
  // Imagen principal del animal
  // ==========================

  const imagenPrincipal = (() => {
    if (!animal.multimedia?.length) {
      return "/placeholder.svg";
    }

    const primerElemento = animal.multimedia[0];

    if (typeof primerElemento === "string") {
      return primerElemento;
    }

const imagen = animal.multimedia.find(
  (item): item is Exclude<typeof item, string> =>
    typeof item !== "string" && item.type === "image",
);

return imagen?.url ?? "/placeholder.svg";
})();

    // ==========================
  // Enviar solicitud
  // ==========================

  const enviarSolicitud = async () => {
    if (!nombreCompleto.trim()) {
      alert("Ingresa tu nombre completo.");
      return;
    }

    if (!telefono.trim()) {
      alert("Ingresa un número telefónico.");
      return;
    }

    if (!/^[0-9]{10}$/.test(telefono)) {
      alert("El teléfono debe contener 10 dígitos.");
      return;
    }

    try {
      setLoading(true);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${apiUrl}/solicitudes-adopcion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          animal_id: animal.id,
          nombre_completo: nombreCompleto,
          telefono,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      toast.success("Solicitud enviada correctamente", {
        description: "Nos pondremos en contacto contigo muy pronto.",
      });

      setNombreCompleto("");
      setTelefono("");

      onOpenChange(false);
    } catch (error) {
      console.error(error);

      toast.error("No fue posible enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <PawPrint className="h-6 w-6 text-primary" />
            Solicitud de adopción
          </DialogTitle>

          <DialogDescription className="text-base leading-relaxed">
            Completa la siguiente información y la Coordinación de Medio
            Ambiente y Protección Animal se pondrá en contacto contigo para dar
            seguimiento a tu interés de adopción.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          {/* ====================== */}
          {/* Animal seleccionado */}
          {/* ====================== */}

          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-green-50 p-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-700">
              Animal seleccionado
            </p>

            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-white bg-white shadow-md">
                {" "}
                <Image
                  src={imagenPrincipal}
                  alt={animal.nombre}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800">
                  {" "}
                  {animal.nombre}
                </h3>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm">
                    📅 {animal.edad}
                  </span>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm">
                    📏 {animal.tamaño}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Esta solicitud quedará vinculada automáticamente con este
                  animal para dar seguimiento a tu interés de adopción.
                </p>
              </div>
            </div>
          </div>

          {/* ====================== */}
          {/* Nombre */}
          {/* ====================== */}

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre completo</Label>

            <div className="relative">
              <User className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

              <Input
                id="nombre"
                className="pl-10"
                placeholder="Ej. Fernanda Ibarra Anchondo"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
              />
            </div>
          </div>
          {/* ====================== */}
          {/* Teléfono */}
          {/* ====================== */}

          <div className="space-y-2">
            <Label htmlFor="telefono">Número telefónico</Label>

            <div className="relative">
              <Phone className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />

              <Input
                id="telefono"
                className="pl-10"
                placeholder="Ej. 6141234567"
                maxLength={10}
                value={telefono}
                onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Ingresa un número telefónico donde podamos comunicarnos contigo.
            </p>
          </div>

          {/* ====================== */}
          {/* Aviso */}
          {/* ====================== */}

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm leading-relaxed text-amber-800">
              Al enviar esta solicitud aceptas que la
              <span className="font-semibold">
                {" "}
                Coordinación de Medio Ambiente y Protección Animal{" "}
              </span>
              pueda contactarte para brindarte información sobre el proceso de
              adopción del animal seleccionado.
            </p>
          </div>

          {/* ====================== */}
          {/* Botón */}
          {/* ====================== */}

          <Button
            className="h-12 w-full gap-2 text-base font-semibold"
            onClick={enviarSolicitud}
            disabled={loading}
          >
            <Heart className="h-5 w-5" />

            {loading ? "Enviando solicitud..." : "Enviar solicitud de adopción"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

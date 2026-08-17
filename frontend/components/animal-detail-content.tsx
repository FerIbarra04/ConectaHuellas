"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  PawPrint,
  Calendar,
  Ruler,
  Dog,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Animal } from "@/lib/types";
import { ScrollReveal, FadeInScale } from "@/components/page-transition";
import { getTagStyle } from "@/lib/tag-styles";
import type { MultimediaItem } from "@/lib/types";
import { AdoptionModal } from "@/components/adoption/adoption-modal";

interface AnimalDetailContentProps {
  animal: Animal;
}
export function AnimalDetailContent({ animal }: AnimalDetailContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [openAdoptionModal, setOpenAdoptionModal] = useState(false);

  const defaultImage =
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop";

  const mediaItems: MultimediaItem[] =
    animal.multimedia
      ?.map(
        (media): MultimediaItem =>
          typeof media === "string" ? { type: "image", url: media } : media,
      )
      .filter(
        (media) =>
          media.url.trim() !== "" &&
          (media.type === "image" || media.type === "video"),
      ) || [];

  const currentMedia = mediaItems[currentIndex];

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const estadoLabel =
    animal.estado === "disponible"
      ? {
          text: "En adopción",
          icon: PawPrint,
          className: "bg-secondary text-secondary-foreground",
        }
      : { text: "Adoptado", icon: Heart, className: "bg-rose-500 text-white" };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
      {/* Back Link */}
      <ScrollReveal delay={0}>
        <Link
          href="/animales"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>
      </ScrollReveal>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Media Section */}
        <div className="space-y-4">
          <FadeInScale delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
              {currentMedia ? (
                currentMedia.type === "image" &&
                !currentMedia.url.includes("/video/") ? (
                  <Image
                    src={currentMedia.url}
                    alt={animal.nombre}
                    fill
                    className="cursor-zoom-in object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    onClick={() => setIsFullscreen(true)}
                  />
                ) : (
                  <video
                    src={currentMedia.url}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-full w-full bg-black object-contain"
                  >
                    Tu navegador no soporta video.
                  </video>
                )
              ) : (
                <Image
                  src={defaultImage}
                  alt={animal.nombre}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}

              {/* Status Badge */}
              <motion.div
                className="absolute top-4 left-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Badge
                  className={`${estadoLabel.className} gap-1.5 font-medium text-sm px-3 py-1`}
                >
                  <estadoLabel.icon className="h-4 w-4" />
                  {estadoLabel.text}
                </Badge>
              </motion.div>

              {/* Flechas */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevMedia}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextMedia}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Contador */}
              {mediaItems.length > 1 && (
                <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                  {currentIndex + 1} / {mediaItems.length}
                </div>
              )}

              {/* Indicador video */}
              {currentMedia?.type === "video" && (
                <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs text-white flex items-center gap-1">
                  <Play className="h-3 w-3" />
                  Video
                </div>
              )}
            </div>
          </FadeInScale>

          {/* Puntitos del carrusel */}
          {mediaItems.length > 1 && (
            <div className="flex justify-center gap-2">
              {mediaItems.map((media, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    currentIndex === index
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Ver archivo ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          {/* Name and Basic Info */}
          <ScrollReveal delay={0.15} direction="right">
            <div>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                {animal.nombre}
              </h1>
              <div className="mt-4 flex flex-wrap gap-4 text-muted-foreground">
                <motion.span
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Calendar className="h-5 w-5" />
                  {animal.edad}
                </motion.span>
                <motion.span
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <Ruler className="h-5 w-5" />
                  {animal.tamaño.charAt(0).toUpperCase() +
                    animal.tamaño.slice(1)}
                </motion.span>
                <motion.span
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <Dog className="h-5 w-5" />
                  {animal.convivencia_perros
                    ? "Convive con perros"
                    : "Prefiere ser único"}
                </motion.span>
              </div>
            </div>
          </ScrollReveal>

          {/* Tags */}
          {animal.tags && animal.tags.length > 0 && (
            <ScrollReveal delay={0.25} direction="up">
              <div className="flex flex-wrap gap-2">
                {animal.tags.map((tag, index) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getTagStyle(
                      index,
                    )}`}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* Description */}
          <ScrollReveal delay={0.35} direction="up">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Sobre {animal.nombre}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {animal.descripcion}
              </p>
            </div>
          </ScrollReveal>

          {/* Details Card */}
          <ScrollReveal delay={0.45} direction="up">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-card-foreground mb-3">
                  Información Adicional
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Estado</dt>
                    <dd
                      className={
                        animal.estado === "disponible"
                          ? "text-secondary font-medium"
                          : "text-rose-500 font-medium"
                      }
                    >
                      {animal.estado === "disponible"
                        ? "Disponible para adopción"
                        : "Ya fue adoptado"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      Convivencia con perros
                    </dt>
                    <dd className="flex items-center gap-1">
                      {animal.convivencia_perros ? (
                        <>
                          <Check className="h-4 w-4 text-secondary" />
                          <span className="text-secondary">Sí</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-rose-500" />
                          <span className="text-rose-500">No</span>
                        </>
                      )}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Adoption CTA */}
          {animal.estado === "disponible" && (
            <ScrollReveal delay={0.55} direction="up">
              <div className="space-y-4 pt-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="w-full gap-2 text-base"
                    onClick={() => setOpenAdoptionModal(true)}
                  >
                    <Heart className="h-5 w-5" />
                    Postularse para adopción
                  </Button>
                </motion.div>
                <p className="text-xs text-center text-muted-foreground">
                  Al postularte, nuestro equipo se pondrá en contacto contigo
                  para iniciar el proceso de adopción responsable.
                </p>
              </div>
            </ScrollReveal>
          )}

          {animal.estado === "adoptado" && (
            <ScrollReveal delay={0.55} direction="up">
              <div className="rounded-lg bg-rose-50 p-4 text-center">
                <p className="text-rose-700 font-medium">
                  Este animal ya encontró un hogar
                </p>
                <p className="text-sm text-rose-600 mt-1">
                  Pero hay muchos más esperando por ti
                </p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4"
                >
                  <Button asChild variant="outline">
                    <Link href="/animales">Ver más animales</Link>
                  </Button>
                </motion.div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
      {/*MODAL PANTALLA COMPLETA*/}
      {isFullscreen && currentMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4">
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {mediaItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>

              <button
                type="button"
                onClick={nextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <div className="relative h-[80vh] w-full max-w-5xl">
            {currentMedia.type === "image" &&
            !currentMedia.url.includes("/video/") ? (
              <Image
                src={currentMedia.url}
                alt={animal.nombre}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            ) : (
              <video
                src={currentMedia.url}
                controls
                playsInline
                autoPlay
                className="h-full w-full object-contain"
              >
                Tu navegador no soporta video.
              </video>
            )}
          </div>

          {mediaItems.length > 1 && (
            <div className="absolute bottom-6 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
              {currentIndex + 1} / {mediaItems.length}
            </div>
          )}
        </div>
      )}
      <AdoptionModal
        open={openAdoptionModal}
        onOpenChange={setOpenAdoptionModal}
        animal={animal}
      />
    </div>
  );
}

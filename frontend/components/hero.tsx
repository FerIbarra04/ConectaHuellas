"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";

import type { LandingAnimalDestacado, LandingHero } from "@/lib/api";

interface HeroProps {
  hero: LandingHero;
  animalesDestacados: LandingAnimalDestacado[];
}

const INTERVAL_MS = 4000;

export function Hero({ hero, animalesDestacados }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const destacadosOrdenados = [...animalesDestacados].sort(
    (a, b) => a.orden - b.orden,
  );

  const tieneDestacados = destacadosOrdenados.length > 0;

  const goToNext = useCallback(() => {
    if (destacadosOrdenados.length <= 1) {
      return;
    }

    setVisible(false);

    window.setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % destacadosOrdenados.length);

      setVisible(true);
    }, 350);
  }, [destacadosOrdenados.length]);

  useEffect(() => {
    if (destacadosOrdenados.length <= 1) {
      return;
    }

    const timer = window.setInterval(goToNext, INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [goToNext, destacadosOrdenados.length]);

  useEffect(() => {
    if (activeIndex >= destacadosOrdenados.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, destacadosOrdenados.length]);

  const current = tieneDestacados ? destacadosOrdenados[activeIndex] : null;

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden bg-white pt-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[#F8FAFC]/60"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 select-none overflow-hidden"
        aria-hidden="true"
      >
        {[
          {
            top: "12%",
            left: "6%",
            size: 28,
            opacity: 0.07,
            rotate: -18,
          },
          {
            top: "72%",
            left: "3%",
            size: 20,
            opacity: 0.05,
            rotate: 12,
          },
          {
            top: "30%",
            left: "48%",
            size: 16,
            opacity: 0.05,
            rotate: 5,
          },
          {
            top: "88%",
            left: "60%",
            size: 22,
            opacity: 0.06,
            rotate: -8,
          },
        ].map((p, i) => (
          <PawBackground
            key={i}
            size={p.size}
            opacity={p.opacity}
            rotate={p.rotate}
            style={{
              top: p.top,
              left: p.left,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-6">
          {/* CONTENIDO */}
          <div className="flex max-w-xl flex-col gap-7">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/60 px-4 py-1.5">
              <span className="inline-block h-2 w-2 rounded-full bg-[#2563EB]" />

              <span className="text-xs font-semibold uppercase tracking-wide text-[#2563EB]">
                Gobierno Municipal de Chihuahua
              </span>
            </div>

            <h1 className="text-balance text-[2.6rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem] text-[#1F2937]">
              {hero.titulo}
            </h1>

            <p className="max-w-[540px] text-lg leading-relaxed text-[#6B7280]">
              {hero.descripcion}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/animales"
                className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#2563EB]/20 transition-all duration-200 hover:bg-[#1d4ed8] active:scale-95"
              >
                <PawIcon size={18} color="white" />
                Ver animales disponibles
              </Link>

              <Link
                href="/solicitud-incorporacion"
                className="inline-flex items-center gap-2 rounded-full bg-[#FBBF24] px-7 py-3.5 text-sm font-semibold text-[#1F2937] shadow-md shadow-[#FBBF24]/25 transition-all duration-200 hover:bg-[#f59e0b] active:scale-95"
              >
                <HeartIcon size={18} color="#1F2937" />
                Solicitar incorporación
              </Link>
            </div>

            <p className="border-l-2 border-[#DBEAFE] pl-4 text-base italic leading-relaxed text-[#6B7280]">
              "{hero.frase}"
            </p>
          </div>

          {/* ANIMAL DESTACADO */}
          <div className="relative flex min-h-[430px] items-center justify-center lg:justify-end">
            <div
              className="absolute h-[420px] w-[420px] rounded-[60%_40%_55%_45%/50%_60%_40%_50%] bg-[#DBEAFE] opacity-70 sm:h-[500px] sm:w-[500px]"
              aria-hidden="true"
              style={{
                transform: "rotate(-6deg)",
              }}
            />

            <div
              className="absolute h-[360px] w-[360px] rounded-[45%_55%_60%_40%/60%_40%_55%_45%] bg-[#DBEAFE]/40 sm:h-[440px] sm:w-[440px]"
              aria-hidden="true"
              style={{
                transform: "rotate(12deg)",
              }}
            />

            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
            >
              {[
                {
                  top: "8%",
                  right: "12%",
                  size: 24,
                  opacity: 0.18,
                  rotate: 20,
                },
                {
                  top: "75%",
                  right: "6%",
                  size: 18,
                  opacity: 0.14,
                  rotate: -10,
                },
                {
                  top: "20%",
                  left: "8%",
                  size: 20,
                  opacity: 0.13,
                  rotate: 35,
                },
                {
                  top: "65%",
                  left: "5%",
                  size: 16,
                  opacity: 0.12,
                  rotate: -25,
                },
              ].map((p, i) => (
                <PawBackground
                  key={i}
                  size={p.size}
                  opacity={p.opacity}
                  rotate={p.rotate}
                  style={{
                    top: p.top,
                    right: "right" in p ? p.right : undefined,
                    left: "left" in p ? p.left : undefined,
                  }}
                />
              ))}
            </div>

            {current ? (
              <>
                <div
                  className={`relative z-10 transition-all duration-500 ${visible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"}`}
                  style={{
                    filter: "drop-shadow(0 24px 40px rgba(37,99,235,0.18))",
                  }}
                >
                  <img
                    src={current.imagen_sin_fondo_url}
                    alt={`${current.nombre}, animal disponible en adopción`}
                    className="h-[330px] w-[300px] select-none object-contain sm:h-[420px] sm:w-[380px]"
                  />
                </div>

                <div
                  className={`absolute bottom-8 right-8 z-20 rounded-2xl border border-[#E5E7EB] bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-sm transition-all duration-500 ${visible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
                >
                  <p className="mb-0.5 text-xs font-semibold uppercase leading-none tracking-widest text-[#6B7280]">
                    Conoce a
                  </p>

                  <p className="text-base font-bold leading-tight text-[#1F2937]">
                    {current.nombre}
                  </p>
                </div>

                {destacadosOrdenados.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                    {destacadosOrdenados.map((animal, index) => (
                      <button
                        key={animal.id}
                        type="button"
                        onClick={() => {
                          window.setTimeout(() => {
                            setActiveIndex(index);
                          }, 200);
                        }}
                        aria-label={`Mostrar a ${animal.nombre}`}
                        className={`h-2.5 rounded-full transition-all ${
                          activeIndex === index
                            ? "w-7 bg-[#2563EB]"
                            : "w-2.5 bg-[#BFDBFE] hover:bg-[#93C5FD]"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="relative z-10 flex h-[330px] w-[300px] items-center justify-center sm:h-[420px] sm:w-[380px]">
                <div className="rounded-3xl border border-dashed border-[#93C5FD] bg-white/60 px-8 py-10 text-center backdrop-blur-sm">
                  <span className="text-5xl">🐾</span>

                  <p className="mt-4 font-bold text-[#1F2937]">Próximamente</p>

                  <p className="mt-2 text-sm text-[#6B7280]">
                    Conoce a nuestros animales disponibles.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
            fill="#F8FAFC"
          />
        </svg>
      </div>
    </section>
  );
}

function PawIcon({
  size = 20,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true"
    >
      <circle cx="5.5" cy="7.5" r="1.8" />
      <circle cx="10.5" cy="5" r="1.8" />
      <circle cx="15.5" cy="5" r="1.8" />
      <circle cx="20" cy="7.5" r="1.8" />
      <ellipse cx="12.5" cy="16" rx="6" ry="6.5" />
    </svg>
  );
}

function HeartIcon({
  size = 20,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function PawBackground({
  size,
  opacity,
  rotate,
  style,
}: {
  size: number;
  opacity: number;
  rotate: number;
  style: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#2563EB"
      style={{
        position: "absolute",
        opacity,
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
      aria-hidden="true"
    >
      <circle cx="6" cy="6" r="2" />
      <circle cx="12" cy="4" r="2" />
      <circle cx="18" cy="6" r="2" />
      <ellipse cx="12" cy="15" rx="5" ry="6" />
    </svg>
  );
}

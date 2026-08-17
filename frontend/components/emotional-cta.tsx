import { ScrollReveal } from "@/components/page-transition"
import Image from "next/image"
import Link from "next/link"

export function EmotionalCTA() {
  return (
    <section className="relative overflow-hidden bg-white py-0">
      <div className="relative h-[420px] w-full sm:h-[520px] lg:h-[600px]">
        <Image
          src="/images/adoption-hero.png"
          alt="Animal adoptado en un ambiente cálido y familiar"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />

        <div
          className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/20"
          aria-hidden="true"
        />

        <div className="absolute inset-0 flex items-center">
          <ScrollReveal className="mx-auto w-full max-w-7xl px-6 lg:px-10">
            <div className="max-w-lg">
              <span className="mb-4 inline-block text-xs font-bold uppercase tracking-widest text-[#22C55E]">
                Tu momento de actuar
              </span>

              <h2 className="text-balance mb-5 text-3xl font-extrabold leading-tight text-[#1F2937] sm:text-4xl lg:text-5xl">
                Tu mejor amigo podría estar esperándote.
              </h2>

              <p className="mb-8 max-w-md text-base leading-relaxed text-[#6B7280]">
                Cada adopción cambia dos vidas: la del animal y la de quien
                decide abrirle las puertas de su hogar.
              </p>

              <Link
                href="/animales"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#FBBF24] px-8 py-4 text-sm font-bold text-[#1F2937] shadow-lg shadow-[#FBBF24]/30 transition-all duration-200 hover:bg-[#f59e0b] active:scale-95"
              >
                🐾 Conocer animales
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
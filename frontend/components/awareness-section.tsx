import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/page-transition"
import type { LandingContenidoItem } from "@/lib/api"

interface AwarenessSectionProps {
  items: LandingContenidoItem[]
}

const topicVisuals = [
  {
    accent: "#2563EB",
    bg: "#DBEAFE",
    emoji: "🐾",
  },
  {
    accent: "#E05555",
    bg: "#FFF0F0",
    emoji: "🚫",
  },
  {
    accent: "#22C55E",
    bg: "#DCFCE7",
    emoji: "❤️",
  },
]

export function AwarenessSection({
  items,
}: AwarenessSectionProps) {
  return (
    <section
      id="concientizacion"
      className="bg-[#F8FAFC] py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <ScrollReveal>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-[#22C55E]">
              Concientización
            </span>

            <h2 className="text-balance text-3xl font-extrabold leading-tight text-[#1F2937] sm:text-4xl">
              Adoptar es decidir con amor
            </h2>

            <p className="mt-4 text-base leading-relaxed text-[#6B7280]">
              Informarte antes de adoptar es el primer acto de responsabilidad
              hacia un ser que dependerá de ti.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item, index) => {
            const visual =
              topicVisuals[index] ||
              topicVisuals[0]

            return (
              <StaggerItem key={`${item.titulo}-${index}`}>
                <article
                  className="group flex flex-col gap-5 rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: visual.bg,
                    }}
                  >
                    {visual.emoji}
                  </div>

                  <div>
                    <span
                      className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
                      style={{
                        backgroundColor: visual.bg,
                        color: visual.accent,
                      }}
                    >
                      {item.titulo}
                    </span>
                  </div>

                  <p className="flex-1 text-sm leading-relaxed text-[#6B7280]">
                    {item.descripcion}
                  </p>

                  <div
                    className="flex items-center gap-1.5 text-xs font-semibold"
                    style={{
                      color: visual.accent,
                    }}
                  >
                    Saber más <span>→</span>
                  </div>
                </article>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
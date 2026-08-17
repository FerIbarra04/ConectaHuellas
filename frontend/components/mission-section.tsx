import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/page-transition"
import type { LandingContenidoItem } from "@/lib/api"

interface MissionSectionProps {
  items: LandingContenidoItem[]
}

const cardVisuals = [
  {
    icon: "🏠",
    bg: "bg-blue-100",
  },
  {
    icon: "❤️",
    bg: "bg-green-100",
  },
  {
    icon: "🌎",
    bg: "bg-blue-100",
  },
]

export function MissionSection({
  items,
}: MissionSectionProps) {
  return (
    <section
      id="mision"
      className="bg-[#F8FAFC] py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <ScrollReveal>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-1 inline-block text-xs font-bold uppercase tracking-widest text-[#2563EB]">
              Nuestra misión
            </span>

            <h2 className="text-balance text-3xl font-extrabold leading-tight text-[#1F2937] sm:text-4xl">
              Comprometidos con cada vida animal
            </h2>

            <p className="mt-4 text-base leading-relaxed text-[#6B7280]">
              Desde la Coordinación de Medio Ambiente y Protección Animal
              trabajamos cada día para transformar vidas.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item, index) => {
            const visual =
              cardVisuals[index] ||
              cardVisuals[0]

            return (
              <StaggerItem key={`${item.titulo}-${index}`}>
                <article
                  className="group relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="absolute left-0 right-0 top-0 h-1 rounded-t-3xl bg-[#2563EB]" />

                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-105 ${visual.bg}`}
                  >
                    {visual.icon}
                  </div>

                  <h3 className="mb-3 text-lg font-bold leading-snug text-[#1F2937]">
                    {item.titulo}
                  </h3>

                  <p className="text-sm leading-relaxed text-[#6B7280]">
                    {item.descripcion}
                  </p>
                </article>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
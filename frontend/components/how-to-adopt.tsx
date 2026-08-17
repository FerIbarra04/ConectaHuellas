import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/page-transition"
import type { LandingContenidoItem } from "@/lib/api"

interface HowToAdoptProps {
  items: LandingContenidoItem[]
}

const stepVisuals = [
  {
    number: "01",
    icon: "🔎",
  },
  {
    number: "02",
    icon: "❤️",
  },
  {
    number: "03",
    icon: "📞",
  },
  {
    number: "04",
    icon: "🐾",
  },
]

export function HowToAdopt({
  items,
}: HowToAdoptProps) {
  return (
    <section
      id="como-adoptar"
      className="bg-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <ScrollReveal>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-[#2563EB]">
              Proceso de adopción
            </span>

            <h2 className="text-balance text-3xl font-extrabold leading-tight text-[#1F2937] sm:text-4xl">
              ¿Cómo adoptar?
            </h2>

            <p className="mt-4 text-base leading-relaxed text-[#6B7280]">
              Cuatro pasos sencillos que pueden cambiar la vida de un animal y la
              tuya para siempre.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          <div
            className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-[#DBEAFE] lg:block"
            aria-hidden="true"
          />

          <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => {
              const visual =
                stepVisuals[index] ||
                stepVisuals[0]

              return (
                <StaggerItem key={`${item.titulo}-${index}`}>
                  <article
                    className="group relative rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                  >
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#2563EB] text-2xl shadow-md shadow-[#2563EB]/25 transition-transform duration-300 group-hover:scale-110">
                      {visual.icon}
                    </div>

                    <span className="mb-2 block text-xs font-extrabold uppercase tracking-widest text-[#93C5FD]">
                      Paso {visual.number}
                    </span>

                    <h3 className="mb-2 text-base font-bold leading-snug text-[#1F2937]">
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
      </div>
    </section>
  )
}
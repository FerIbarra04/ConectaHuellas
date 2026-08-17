const topics = [
  {
    label: "Adopción responsable",
    description:
      "Adoptar a un animal es una decisión de vida. Implica tiempo, dedicación, atención veterinaria y amor incondicional.",
    accent: "#2563EB",
    bg: "#DBEAFE",
    emoji: "🐾",
  },
  {
    label: "No al abandono",
    description:
      "Abandonar a una mascota es una forma de maltrato. Antes de adoptar, reflexiona si estás preparado para este compromiso.",
    accent: "#E05555",
    bg: "#FFF0F0",
    emoji: "🚫",
  },
  {
    label: "Cuidado y compromiso",
    description:
      "Una mascota necesita alimentación, atención veterinaria, ejercicio y mucho afecto. El cuidado es un acto diario de amor.",
    accent: "#22C55E",
    bg: "#DCFCE7",
    emoji: "❤️",
  },
]

export function AwarenessSection() {
  return (
    <section id="concientizacion" className="bg-[#F8FAFC] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {topics.map((topic) => (
            <article
              key={topic.label}
              className="group flex flex-col gap-5 rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: topic.bg }}
              >
                {topic.emoji}
              </div>

              <div>
                <span
                  className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest"
                  style={{
                    backgroundColor: topic.bg,
                    color: topic.accent,
                  }}
                >
                  {topic.label}
                </span>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-[#6B7280]">
                {topic.description}
              </p>

              <div
                className="flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: topic.accent }}
              >
                Saber más
                <span>→</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
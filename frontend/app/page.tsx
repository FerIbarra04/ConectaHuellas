import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { MissionSection } from "@/components/mission-section"
import { HowToAdopt } from "@/components/how-to-adopt"
import { AwarenessSection } from "@/components/awareness-section"
import { EmotionalCTA } from "@/components/emotional-cta"
import { Footer } from "@/components/footer"

import { getLanding } from "@/lib/api"

export default async function HomePage() {
  const landing = await getLanding()

  return (
    <main>
      <Header />

      <Hero
        hero={landing.hero}
        animalesDestacados={landing.animales_destacados}
      />

      <MissionSection
        items={landing.proposito}
      />

      <HowToAdopt
        items={landing.proceso_adopcion}
      />

      <AwarenessSection
        items={landing.concientizacion}
      />

      <EmotionalCTA />

      <Footer
        footer={landing.footer}
      />
    </main>
  )
}
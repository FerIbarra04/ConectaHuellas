import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnimalCatalog } from "@/components/animal-catalog";
import { getAnimales } from "@/lib/api";
import type { Animal } from "@/lib/types";

export const metadata = {
  title: "Animales en Adopción | Conecta Huellas",
  description:
    "Explora nuestro catálogo de animales disponibles para adopción. Encuentra a tu nuevo compañero de vida.",
};

export default async function AnimalesPage() {
  let animals: Animal[] = [];

  try {
    animals = await getAnimales();
  } catch (error) {
    console.error("No se pudieron cargar los animales:", error);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="pt-32 sm:pt-36">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Animales en Adopción
            </h1>

            <p className="mt-2 text-lg text-muted-foreground">
              Encuentra a tu nuevo compañero de vida entre nuestros amigos
              peludos.
            </p>

            <div className="mt-8">
              <p className="mt-8 text-xl font-bold leading-relaxed sm:text-2xl">
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  🐾 También apoyamos
                </span>{" "}
                <span className="text-slate-800">
                  la búsqueda de un hogar para
                </span>{" "}
                <span className="text-emerald-600">
                  animales rescatados y reportados por la ciudadanía.
                </span>
              </p>
            </div>
          </div>

          <AnimalCatalog animals={animals} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

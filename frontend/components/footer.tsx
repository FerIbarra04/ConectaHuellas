import Image from "next/image"
import Link from "next/link"

import type { LandingFooter } from "@/lib/api"

interface FooterProps {
  footer?: LandingFooter
}

const navigation = [
  { name: "Inicio", href: "/", icon: "🏠" },
  { name: "Ver animales", href: "/animales", icon: "🐾" },
  {
    name: "Concientización",
    href: "/#concientizacion",
    icon: "🌱",
  },
  {
    name: "Adopción responsable",
    href: "/#como-adoptar",
    icon: "❤️",
  },
]

export function Footer({ footer }: FooterProps) {
  const contenido = {
    descripcion:
      "Conecta Huellas facilita el encuentro entre animales en adopción y familias responsables.",
    frase:
      "Adoptar es abrirle espacio en tu hogar a una nueva historia.",
    correo: "",
    facebook_url: "",
    instagram_url: "",
    ...footer,
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden">
      {/* ONDA SUPERIOR */}
      <div className="overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="h-20 w-full text-[#DBEAFE]"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M0,64L80,74.7C160,85,320,107,480,112C640,117,800,107,960,90.7C1120,75,1280,53,1360,42.7L1440,32L1440,120H0Z"
          />
        </svg>
      </div>

      <div className="relative bg-[#DBEAFE]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#DBEAFE] to-[#F8FAFC]" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
            {/* INSTITUCIONAL */}
            <div>
              <div className="flex flex-wrap items-center gap-8">
                <Image
                  src="/logos/logo-cmaypa.png"
                  alt="Logo CMAYPA"
                  width={120}
                  height={120}
                  className="h-auto w-[120px] object-contain"
                />

                <Image
                  src="/logos/logo-gobierno.png"
                  alt="Logo Gobierno Municipal de Chihuahua"
                  width={150}
                  height={120}
                  className="h-auto w-[150px] object-contain"
                />
              </div>

              <h3 className="mt-8 text-2xl font-extrabold text-[#1F2937]">
                Conecta Huellas
              </h3>

              <p className="mt-3 max-w-md leading-relaxed text-[#4B5563]">
                {contenido.descripcion}
              </p>

              {contenido.frase && (
                <p className="mt-5 max-w-md italic leading-relaxed text-[#6B7280]">
                  “
                  {contenido.frase
                    .replaceAll("“", "")
                    .replaceAll("”", "")}
                  ”
                </p>
              )}
            </div>

            {/* NAVEGACIÓN */}
            <div>
              <h4 className="mb-5 text-lg font-bold text-[#1F2937]">
                Navegación
              </h4>

              <ul className="space-y-4">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 text-[#4B5563] transition-all duration-200 hover:translate-x-1 hover:text-[#2563EB]"
                    >
                      <span>{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACTO */}
            <div>
              <h4 className="mb-5 text-lg font-bold text-[#1F2937]">
                Contacto
              </h4>

              <ul className="space-y-4 text-[#4B5563]">
                {contenido.correo && (
                  <li>
                    <a
                      href={`mailto:${contenido.correo}`}
                      className="transition-colors hover:text-[#2563EB]"
                    >
                      📧 {contenido.correo}
                    </a>
                  </li>
                )}

                {contenido.facebook_url && (
                  <li>
                    <a
                      href={contenido.facebook_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-[#2563EB]"
                    >
                      📘 Facebook
                    </a>
                  </li>
                )}

                {contenido.instagram_url && (
                  <li>
                    <a
                      href={contenido.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-[#2563EB]"
                    >
                      📷 Instagram
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="my-10 h-px bg-[#BFDBFE]" />

          <div className="flex flex-col gap-3 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
            <p className="text-sm text-[#6B7280]">
              © {currentYear} Conecta Huellas. Todos los derechos reservados.
            </p>

            <p className="text-sm text-[#6B7280]">
              Desarrollado para promover la adopción responsable en Chihuahua.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
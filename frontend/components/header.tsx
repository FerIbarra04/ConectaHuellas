"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigation = [
    { name: "Inicio", href: "/#inicio" },
    { name: "Concientización", href: "/#concientizacion" },
    { name: "Adopción responsable", href: "/#como-adoptar" },
  ];

  const isActive = (href: string) => {
    if (href === "/animales") return pathname.startsWith("/animales");
    if (href === "/#inicio") return pathname === "/";
    return false;
  };

  return (
    <motion.header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/85 py-3 shadow-[0_1px_24px_rgba(37,99,235,0.08)] backdrop-blur-xl"
          : "bg-white/60 py-5 backdrop-blur-md"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link
          href="/#inicio"
          aria-label="Ir al inicio de Conecta Huellas"
          className="group flex items-center"
        >
          <Image
            src="/logos/logo-conecta-huellas.png"
            alt="Conecta Huellas"
            width={260}
            height={90}
            priority
            className="h-20 w-auto object-contain sm:h-24"
          />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-[#2563EB] ${
                isActive(item.href) ? "text-[#2563EB]" : "text-[#6B7280]"
              }`}
            >
              {item.name}
            </Link>
          ))}

          <Button
            asChild
            className="rounded-full bg-[#2563EB] hover:bg-[#1d4ed8]"
          >
            <Link href="/animales">🐾 Ver animales disponibles</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-[#1F2937] hover:bg-[#F5F7FA] md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="border-t border-[#E5E7EB] bg-white/95 px-4 py-4 backdrop-blur-xl md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-[#6B7280] hover:bg-[#F5F7FA] hover:text-[#2563EB]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <Button
                asChild
                className="mt-2 w-full rounded-full bg-[#2563EB] hover:bg-[#1d4ed8]"
              >
                <Link href="/animales" onClick={() => setMobileMenuOpen(false)}>
                  🐾 Ver animales disponibles
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

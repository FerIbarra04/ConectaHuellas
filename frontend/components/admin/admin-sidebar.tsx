"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  LayoutDashboardIcon,
  PawPrintIcon,
  TagsIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  ClipboardListIcon,
  PanelsTopLeftIcon,
  Heart,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Landing Page",
    href: "/admin/landing",
    icon: PanelsTopLeftIcon,
  },
  {
    title: "Animales",
    href: "/admin/animales",
    icon: PawPrintIcon,
  },
  {
    title: "Solicitudes",
    href: "/admin/solicitudes",
    icon: ClipboardListIcon,
  },
  {
    title: "Tags",
    href: "/admin/tags",
    icon: TagsIcon,
  },
  {
  title: "Solicitudes de adopción",
  href: "/admin/solicitudes-adopcion",
  icon: Heart,
},
];

type Solicitud = {
  estado: string;
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const loadSolicitudesPendientes = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          console.error("NEXT_PUBLIC_API_URL no está configurada");
          return;
        }
        console.log("URL solicitudes sidebar:", `${apiUrl}/solicitudes`);
        const response = await fetch(`${apiUrl}/solicitudes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          const errorText = await response.text();

          throw new Error(
            `No se pudieron cargar las solicitudes. Estado: ${response.status}. ${errorText}`,
          );
        }

        const data = await response.json();

        // Permite que la API devuelva directamente un arreglo
        // o un objeto como { solicitudes: [...] }
        const solicitudes: Solicitud[] = Array.isArray(data)
          ? data
          : Array.isArray(data.solicitudes)
            ? data.solicitudes
            : [];

        const pendientes = solicitudes.filter(
          (solicitud) =>
            solicitud.estado === "pendiente" ||
            solicitud.estado === "en_revision",
        ).length;

        setPendingCount(pendientes);
      } catch (error) {
        console.error("Error revisando solicitudes:", error);
      }
    };

    loadSolicitudesPendientes();

    // Actualiza el contador automáticamente cada 30 segundos
    const interval = window.setInterval(loadSolicitudesPendientes, 30_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [pathname]);

  return (
    <>
      {/* Botón del menú móvil */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen((prev) => !prev)}
        aria-label={
          isMobileOpen
            ? "Cerrar menú de administración"
            : "Abrir menú de administración"
        }
      >
        {isMobileOpen ? (
          <XIcon className="h-5 w-5" />
        ) : (
          <MenuIcon className="h-5 w-5" />
        )}
      </Button>

      {/* Fondo oscuro en móvil */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Barra lateral */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card transition-transform duration-300 md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <Link
            href="/admin/dashboard"
            className="flex h-20 items-center border-b border-border px-5"
          >
            <Image
              src="/logos/logo-conecta-huellas-h.png"
              alt="Conecta Huellas"
              width={185}
              height={60}
              priority
              className="h-auto w-auto max-w-[185px] object-contain"
            />
          </Link>

          {/* Navegación */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              const isSolicitudes = item.href === "/admin/solicitudes";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span>{item.title}</span>
                  </div>

                  {isSolicitudes && pendingCount > 0 && (
                    <span
                      className={cn(
                        "flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold",
                        isActive
                          ? "bg-white text-primary"
                          : "bg-red-500 text-white",
                      )}
                    >
                      {pendingCount > 99 ? "99+" : pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Usuario */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                  <span className="text-sm font-medium text-foreground">
                    {user?.username?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {user?.username || "Admin"}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    Administrador
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Cerrar sesión"
              >
                <LogOutIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

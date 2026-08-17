"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import {
  HeartIcon,
  ClipboardListIcon,
  ShieldCheckIcon,
  Eye,
  EyeOff,
} from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const result = await login(username.trim(), password);

      if (!result.success) {
        setError(result.error || "No se pudo iniciar sesión.");

        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      setError("Ocurrió un error inesperado al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* PANEL IZQUIERDO */}
      <div className="relative hidden overflow-hidden bg-primary lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(47,111,237,1)_0%,rgba(37,99,235,1)_100%)]" />

        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-20 top-20 h-32 w-32 rounded-full border-4 border-white" />

          <div className="absolute right-32 top-40 h-20 w-20 rounded-full border-2 border-white" />

          <div className="absolute bottom-32 left-40 h-24 w-24 rounded-full border-2 border-white" />

          <div className="absolute bottom-20 right-20 h-40 w-40 rounded-full border-4 border-white" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white xl:px-20">
          <div className="mb-10 w-fit rounded-lg bg-white/90 p-[5px] shadow-lg">
  <Image
    src="/logos/logo-conecta-huellas-h.png"
    alt="Conecta Huellas"
    width={340}
    height={90}
    priority
    className="block h-auto w-[290px]"
  />
</div>

          <h1 className="mb-6 text-4xl font-bold leading-tight xl:text-5xl">
            Panel de administración
          </h1>

          <p className="mb-12 max-w-md text-lg text-white/80">
            Gestiona animales, solicitudes de incorporación y el contenido
            disponible en Conecta Huellas.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <HeartIcon className="h-5 w-5" />
              </div>

              <span className="text-white/90">
                Gestión completa de animales
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <ClipboardListIcon className="h-5 w-5" />
              </div>

              <span className="text-white/90">
                Control de solicitudes de incorporación
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <ShieldCheckIcon className="h-5 w-5" />
              </div>

              <span className="text-white/90">
                Acceso exclusivo para personal autorizado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO */}
      <div className="flex w-full items-center justify-center bg-white p-6 sm:p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* LOGO MÓVIL */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Image
              src="/logos/logo-conecta-huellas-h.png"
              alt="Conecta Huellas"
              width={300}
              height={90}
              priority
              className="h-auto w-full max-w-[260px] object-contain"
            />
          </div>

          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-bold text-foreground">
              Bienvenido de nuevo
            </h2>

            <p className="text-muted-foreground">
              Ingresa tus credenciales para acceder al panel administrativo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field>
              <FieldLabel
                htmlFor="username"
                className="font-medium text-foreground"
              >
                Usuario
              </FieldLabel>

              <Input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                disabled={isLoading}
                className="h-12 border border-[#E5E7EB] bg-[#F8FAFC] focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              />
            </Field>

            <Field>
              <FieldLabel
                htmlFor="password"
                className="font-medium text-foreground"
              >
                Contraseña
              </FieldLabel>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 border border-[#E5E7EB] bg-[#F8FAFC] pr-12 focus-visible:ring-2 focus-visible:ring-[#2563EB]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] transition-colors hover:text-[#2563EB]"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </Field>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-3">
                <p className="text-center text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="h-12 w-full bg-primary text-base font-medium hover:bg-primary/90"
              disabled={isLoading || !username.trim() || !password}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Panel de administración exclusivo para personal autorizado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

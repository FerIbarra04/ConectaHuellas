"use client";

import { useAnimals } from "@/lib/animals-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PawPrintIcon } from "lucide-react";

export function RecentActivity() {
  const { animales } = useAnimals();

  // Obtener los 5 animales agregados más recientemente
  const recentAnimales = [...animales]
    .sort(
      (a, b) =>
        new Date(b.fecha_registro || 0).getTime() -
        new Date(a.fecha_registro || 0).getTime(),
    )
    .slice(0, 5);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Actividad Reciente
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Últimos animales agregados al sistema
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAnimales.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay actividad reciente
            </p>
          ) : (
            recentAnimales.map((animal) => (
              <div
                key={animal.id}
                className="flex items-center justify-between gap-4 rounded-lg border bg-muted/40 p-3 transition-colors hover:bg-muted/70"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        animal.multimedia
                          ?.map((m) =>
                            typeof m === "string"
                              ? { type: "image" as const, url: m }
                              : m,
                          )
                          .find((m) => m.type === "image")?.url || ""
                      }
                      alt={animal.nombre}
                    />
                    <AvatarFallback className="bg-primary/10">
                      <PawPrintIcon className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {animal.nombre}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {animal.edad} - {animal.tamaño}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      animal.estado === "disponible" ? "default" : "secondary"
                    }
                    className={
                      animal.estado === "disponible"
                        ? "bg-[#3CB371] hover:bg-[#3CB371]/90 text-white"
                        : "bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20"
                    }
                  >
                    {animal.estado === "disponible"
                      ? "En adopción"
                      : "Adoptado"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {animal.fecha_registro
                      ? new Date(animal.fecha_registro).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

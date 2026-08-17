'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Filter, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { AnimalCard } from '@/components/animal-card'
import { Animal, AnimalFilters } from '@/lib/types'

import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
} from '@/components/page-transition'

interface AnimalCatalogProps {
  animals: Animal[]
}

// 👇 AHORA LOS TAGS SE GENERAN AUTOMÁTICAMENTE
const getAllTags = (animals: Animal[]) => {
  const tags = animals.flatMap((animal) => animal.tags || [])

  return [...new Set(tags)]
}

export function AnimalCatalog({ animals }: AnimalCatalogProps) {
  const [filters, setFilters] = useState<AnimalFilters>({
    tamaño: '',
    edad: '',
    estado: undefined,
    tags: [],
  })

  const [showFilters, setShowFilters] = useState(false)

  // 👇 TAGS DINÁMICOS DESDE DB
  const allTags = useMemo(() => getAllTags(animals), [animals])

  // 👇 SOLO MOSTRAR DISPONIBLES EN PÚBLICO
  const filteredAnimals = useMemo(() => {
  return animals.filter((animal) => {
    // TAMAÑO
    if (filters.tamaño && animal.tamaño !== filters.tamaño) {
      return false
    }

    // EDAD
    if (filters.edad) {
      const edadLower = animal.edad.toLowerCase()

      if (
        filters.edad === "cachorro" &&
        !edadLower.includes("mes") &&
        !edadLower.includes("1 año")
      ) {
        return false
      }

      if (
        filters.edad === "joven" &&
        !edadLower.includes("1 año") &&
        !edadLower.includes("2 año") &&
        !edadLower.includes("3 año")
      ) {
        return false
      }

      if (
        filters.edad === "adulto" &&
        (edadLower.includes("mes") || parseInt(animal.edad) < 4)
      ) {
        return false
      }

      if (
        filters.edad === "senior" &&
        parseInt(animal.edad) < 7
      ) {
        return false
      }
    }

    // ESTADO
    if (filters.estado && animal.estado !== filters.estado) {
      return false
    }

    // TAGS
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) =>
        animal.tags.includes(tag)
      )

      if (!hasMatchingTag) {
        return false
      }
    }

    return true
  })
}, [animals, filters])

  // 👇 LIMPIAR FILTROS
  const clearFilters = () => {
    setFilters({
      tamaño: '',
      edad: '',
      estado: undefined,
      tags: [],
    })
  }

  // 👇 ACTIVAR / DESACTIVAR TAG
  const toggleTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...(prev.tags || []), tag],
    }))
  }

  const hasActiveFilters =
    filters.tamaño ||
    filters.edad ||
    filters.estado ||
    (filters.tags && filters.tags.length > 0)

  const availableCount = animals.filter(
    (a) => a.estado === 'disponible'
  ).length

  const adoptedCount = animals.filter(
    (a) => a.estado === 'adoptado'
  ).length

  return (
    <div className="space-y-6">
      {/* STATS */}
      <ScrollReveal delay={0.1}>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span>{filteredAnimals.length} animales encontrados</span>

          <span className="h-1 w-1 rounded-full bg-muted-foreground" />

          <span className="text-secondary">
            {availableCount} disponibles
          </span>

          <span className="h-1 w-1 rounded-full bg-muted-foreground" />

          <span className="text-rose-500">
            {adoptedCount} adoptados
          </span>
        </div>
      </ScrollReveal>

      {/* FILTROS */}
      <ScrollReveal delay={0.2}>
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* MOBILE BUTTON */}
          <Button
            variant="outline"
            className="sm:hidden gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />

            Filtros

            {hasActiveFilters && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {(filters.tags?.length || 0) +
                  (filters.tamaño ? 1 : 0) +
                  (filters.edad ? 1 : 0) +
                  (filters.estado ? 1 : 0)}
              </Badge>
            )}
          </Button>

          {/* DESKTOP FILTERS */}
          <div className="hidden sm:flex gap-2">
            {/* TAMAÑO */}
            <Select
              value={filters.tamaño || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  tamaño: value === 'all' ? '' : value,
                }))
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Tamaño" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pequeño">Pequeño</SelectItem>
                <SelectItem value="mediano">Mediano</SelectItem>
                <SelectItem value="grande">Grande</SelectItem>
              </SelectContent>
            </Select>

            {/* ESTADO */}
            <Select
              value={filters.estado || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  estado:
                    value === 'all'
                      ? undefined
                      : (value as 'disponible' | 'adoptado'),
                }))
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  Todos</SelectItem>
                <SelectItem value="disponible">
                  En adopción
                </SelectItem>
                <SelectItem value="adoptado">
                  Adoptado
                </SelectItem>
              </SelectContent>
            </Select>

            {/* LIMPIAR */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFilters}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* MOBILE PANEL */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="sm:hidden space-y-4 p-4 rounded-lg bg-muted"
        >
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={filters.tamaño || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  tamaño: value === 'all' ? '' : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tamaño" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  Todos los tamaños
                </SelectItem>

                <SelectItem value="pequeño">
                  Pequeño
                </SelectItem>

                <SelectItem value="mediano">
                  Mediano
                </SelectItem>

                <SelectItem value="grande">
                  Grande
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.estado || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  estado:
                    value === 'all'
                      ? undefined
                      : (value as 'disponible' | 'adoptado'),
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>

                <SelectItem value="disponible">
                  En adopción
                </SelectItem>

                <SelectItem value="adoptado">
                  Adoptado
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="w-full"
            >
              Limpiar filtros
            </Button>
          )}
        </motion.div>
      )}

      {/* TAGS */}
      <ScrollReveal delay={0.3}>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Filtrar por características:
          </p>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, index) => (
              <motion.button
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.03,
                  duration: 0.3,
                }}
                onClick={() => toggleTag(tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filters.tags?.includes(tag)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* GRID */}
      {filteredAnimals.length > 0 ? (
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAnimals.map((animal) => (
            <StaggerItem key={animal.id}>
              <AnimalCard animal={animal} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <ScrollReveal className="py-16 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No se encontraron animales con estos filtros
          </p>

          <Button
            variant="outline"
            className="mt-4"
            onClick={clearFilters}
          >
            Limpiar filtros
          </Button>
        </ScrollReveal>
      )}
    </div>
  )
}
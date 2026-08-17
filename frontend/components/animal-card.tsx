import Image from 'next/image'
import Link from 'next/link'
import { Heart, PawPrint, Ruler, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Animal } from '@/lib/types'
import { getTagStyle } from "@/lib/tag-styles"


interface AnimalCardProps {
  animal: Animal
}

export function AnimalCard({ animal }: AnimalCardProps) {
const firstMedia = animal.multimedia?.[0]

const imageUrl =
  typeof firstMedia === 'string'
    ? firstMedia
    : firstMedia?.url ||
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop'
      
const estadoLabel =
    animal.estado === 'disponible'
      ? {
          text: '🐾 En adopción',
          icon: PawPrint,
          className: 'bg-green-500 text-white',
        }
      : {
          text: '❤️ Adoptado',
          icon: Heart,
          className: 'bg-rose-500 text-white',
        }

  const Icon = estadoLabel.icon

  return (
    <Link href={`/animales/${animal.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        
        {/* Imagen */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={animal.nombre}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Estado */}
          <div className="absolute top-3 left-3">
            <Badge className={`${estadoLabel.className} gap-1.5 font-medium`}>
              <Icon className="h-3.5 w-3.5" />
              {estadoLabel.text}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          
          {/* Nombre */}
          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {animal.nombre}
          </h3>

          {/* Detalles */}
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {animal.edad}
            </span>

            <span className="flex items-center gap-1.5">
              <Ruler className="h-4 w-4" />
              {animal.tamaño.charAt(0).toUpperCase() + animal.tamaño.slice(1)}
            </span>
          </div>

          {/* Tags */}
{animal.tags && animal.tags.length > 0 && (
  <div className="mt-3 flex flex-wrap gap-1.5">
    {animal.tags.slice(0, 3).map((tag, index) => (
      <span
        key={tag}
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTagStyle(index)}`}
      >
        {tag}
      </span>
    ))}
  </div>
)}
        </CardContent>
      </Card>
    </Link>
  )
}
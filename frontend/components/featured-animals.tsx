"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

import { Button } from "@/components/ui/button";
import { AnimalCard } from "@/components/animal-card";
import type { Animal } from "@/lib/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.96,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: index * 0.1,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
}

interface FeaturedAnimalsProps {
  animals: Animal[];
}

export function FeaturedAnimals({ animals }: FeaturedAnimalsProps) {
  const featuredAnimals = animals
    .filter((animal) => animal.estado === "disponible")
    .slice(0, 4);

  return (
    <section className="py-16 lg:py-24 bg-card">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="flex flex-col items-center text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl"
          >
            Animales Destacados
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed"
          >
            Conoce a algunos de nuestros amigos que están buscando un hogar
            lleno de amor.
          </motion.p>
        </motion.div>

        {/* Animals Grid */}
        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {featuredAnimals.map((animal, index) => (
            <motion.div key={animal.id} variants={cardVariants} custom={index}>
              <AnimalCard animal={animal} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/animales">
              Ver Todos los Animales
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

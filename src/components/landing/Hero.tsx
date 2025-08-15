"use client";

import { motion, Variants } from "framer-motion";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export function Hero() {
  const { data: session, status } = useSession();

  const title = "Plateforme d'Accréditation de l'ANSSI";
  const subtitle = "Bâtissons ensemble un espace numérique sécurisé en conformité avec les normes nationales.";

  const sentence: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 * i },
    }),
  };

  const letter: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
    },
  };

  return (
    <section className="bg-secondary py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-foreground"
          variants={sentence}
          initial="hidden"
          animate="visible"
        >
          {title.split(" ").map((word, index) => (
            <motion.span key={index} variants={letter} className="inline-block mr-2.5">
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="mt-4 text-md md:text-xl text-muted-foreground max-w-3xl mx-auto"
          variants={sentence}
          initial="hidden"
          animate="visible"
          custom={2} // Décalage pour l'animation
        >
          {subtitle.split(" ").map((word, index) => (
            <motion.span key={index} variants={letter} className="inline-block mr-1.5">
              {word}
            </motion.span>
          ))}
        </motion.p>
        {!session && (
            <div className="mt-8">
            <Button asChild size="lg">
                <Link href="/register">Commencer la procédure</Link>
            </Button>
            </div>
        )}
      </div>
    </section>
  );
}
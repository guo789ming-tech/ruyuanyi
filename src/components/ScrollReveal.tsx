"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function ScrollReveal({
  children,
  delay = 0,
  direction = "bottom",
  className,
}: {
  children: ReactNode;
  delay?: number;
  direction?: "top" | "bottom" | "left" | "right";
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...(direction === "top" ? { y: -24 }
          : direction === "right" ? { x: 24 }
          : direction === "left" ? { x: -24 }
          : { y: 24 }),
      }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BodhiLogo } from "./BodhiLogo";
import type { ReactNode, ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "ritual";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-gold text-xuan hover:bg-gold-light active:bg-gold-dark shadow-lg shadow-gold/20",
  secondary: "border border-gold/40 bg-transparent text-gold hover:border-gold/60 hover:bg-gold/10",
  ghost: "bg-transparent text-paper-dark hover:bg-gold/5 hover:text-gold",
  ritual: "bg-vermillion text-white hover:bg-vermillion-light active:bg-vermillion-dark shadow-lg shadow-vermillion/20 tracking-wider",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-4 text-base",
  md: "h-12 px-6 text-lg",
  lg: "h-14 px-8 text-xl",
};

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      disabled={loading || disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40 disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...(props as Record<string, unknown>)}
    >
      {loading ? (
        <BodhiLogo className="size-4 shrink-0 animate-taiji-spin" />
      ) : null}
      <span className={cn("contents", loading && "opacity-60")}>{children}</span>
    </motion.button>
  );
}

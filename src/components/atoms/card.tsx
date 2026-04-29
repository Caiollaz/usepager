import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type CardProps = ComponentPropsWithoutRef<"section">;

/** Bordered surface atom based on shadcn card styling. */
export function Card({ className, ...props }: CardProps) {
  return <section className={cn("rounded-lg border border-border bg-card shadow-card", className)} {...props} />;
}

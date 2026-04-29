import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type FieldProps = ComponentPropsWithoutRef<"label"> & {
  label: string;
  children: ReactNode;
};

/** Label + control molecule with predictable spacing from the Pencil spec. */
export function Field({ className, label, children, ...props }: FieldProps) {
  return (
    <label className={cn("grid gap-1.5 text-sm font-medium text-foreground", className)} {...props}>
      <span>{label}</span>
      {children}
    </label>
  );
}

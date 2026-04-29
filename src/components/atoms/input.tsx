import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type InputProps = ComponentPropsWithoutRef<"input">;

/** Native input atom aligned to the Pencil 44px input height. */
export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-border bg-card px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/10",
        className,
      )}
      {...props}
    />
  );
}

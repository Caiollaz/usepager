import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = ComponentPropsWithoutRef<"textarea">;

/** Native textarea atom. Use rows/height through native props or className. */
export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-20 w-full resize-y rounded-md border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/10",
        className,
      )}
      {...props}
    />
  );
}

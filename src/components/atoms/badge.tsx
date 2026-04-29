import type { ComponentPropsWithoutRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";

const badge = tv({
  base: "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
  variants: {
    tone: {
      default: "bg-primary text-primary-foreground",
      muted: "bg-muted text-muted-foreground",
      success: "bg-emerald-50 text-success",
      warning: "bg-amber-50 text-warning",
      outline: "border border-border bg-card text-foreground",
    },
  },
  defaultVariants: { tone: "muted" },
});

export type BadgeProps = ComponentPropsWithoutRef<"span"> & VariantProps<typeof badge>;

/** Small status/category atom that maps directly to `<span>`. */
export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badge({ tone }), className)} {...props} />;
}

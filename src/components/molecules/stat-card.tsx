import type { ComponentPropsWithoutRef } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/cn";
import { Card } from "@/components/atoms/card";

const value = tv({
  base: "text-[32px] font-bold leading-none tracking-tight",
  variants: {
    tone: {
      default: "text-foreground",
      success: "text-success",
      warning: "text-warning",
    },
  },
  defaultVariants: { tone: "default" },
});

export type StatCardProps = ComponentPropsWithoutRef<typeof Card> &
  VariantProps<typeof value> & {
    label: string;
    metric: string;
  };

/** Compact metric card reused by dashboard and admin screens. */
export function StatCard({ className, label, metric, tone, ...props }: StatCardProps) {
  return (
    <Card className={cn("grid min-h-26.5 gap-2 p-5", className)} {...props}>
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <strong className={value({ tone })}>{metric}</strong>
    </Card>
  );
}

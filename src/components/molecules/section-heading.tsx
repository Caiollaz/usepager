import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type SectionHeadingProps = ComponentPropsWithoutRef<"div"> & {
  title: string;
  description?: string;
};

/** Page heading used in app screens. Matches 28px desktop title from Pencil. */
export function SectionHeading({ className, title, description, ...props }: SectionHeadingProps) {
  return (
    <div className={cn("grid gap-1", className)} {...props}>
      <h1 className="text-2xl font-bold leading-tight text-foreground md:text-[28px]">{title}</h1>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}

import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type LogoProps = ComponentPropsWithoutRef<"div"> & {
  compact?: boolean;
};

/** Pro Pages brand mark used across auth, sidebar and app chrome. */
export function Logo({ className, compact = false, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)} {...props}>
      <span className="flex size-7 items-center justify-center rounded-sm bg-primary text-[15px] font-bold leading-none text-primary-foreground">
        P
      </span>
      {!compact ? <span className="text-lg font-bold text-foreground">Pro Pages</span> : null}
    </div>
  );
}

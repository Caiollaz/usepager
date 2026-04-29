import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

export type PlaceholderImageProps = ComponentPropsWithoutRef<"div">;

/** SVG-like image placeholder from the Pencil file; no generated imagery. */
export function PlaceholderImage({ className, ...props }: PlaceholderImageProps) {
  return (
    <div className={cn("flex items-center justify-center bg-placeholder text-zinc-400", className)} {...props}>
      <Icon name="image" size={32} />
    </div>
  );
}

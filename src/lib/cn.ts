import { twMerge } from "tailwind-merge";
import type { ClassValue } from "tailwind-variants";

function toClassName(input: ClassValue): string {
  if (!input) return "";

  if (typeof input === "string" || typeof input === "number") return String(input);

  if (Array.isArray(input)) return input.map(toClassName).filter(Boolean).join(" ");

  if (typeof input === "object") {
    return Object.entries(input)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([className]) => className)
      .join(" ");
  }

  return "";
}

/**
 * Merges conditional classes and resolves Tailwind conflicts.
 * Keep all public components using this helper so consumer `className` wins.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(inputs.map(toClassName).filter(Boolean).join(" "));
}

import type { ComponentPropsWithoutRef } from "react";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/cn";

export type EditorPreviewProps = ComponentPropsWithoutRef<"section">;

/** Static site preview composition used by the editor canvas. */
export function EditorPreview({ className, ...props }: EditorPreviewProps) {
  return (
    <section
      className={cn("flex h-full min-h-130 w-full max-w-205 flex-col overflow-hidden rounded-lg bg-card shadow-editor", className)}
      {...props}
    >
      <header className="flex h-15 items-center justify-between border-b border-border px-6">
        <strong className="text-lg font-bold text-foreground">TechCo</strong>
        <nav aria-label="Preview" className="hidden gap-6 text-sm text-muted-foreground sm:flex">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
        </nav>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-5 bg-secondary px-6 py-16 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-[40px]">Build faster with TechCo</h2>
        <p className="text-base text-muted-foreground sm:text-lg">The modern platform for teams who ship</p>
        <Button className="h-10 px-7 text-[15px]">Get Started</Button>
      </div>
    </section>
  );
}

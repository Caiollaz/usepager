import { SectionHeading } from "@/components/molecules/section-heading";
import { AppShell } from "@/components/organisms/app-shell";
import { createNavItems } from "@/lib/navigation";
import { requireSession } from "@/lib/session";

export default async function TemplatesPage() {
  await requireSession();

  return (
    <AppShell navItems={createNavItems("templates")}>
      <main className="min-w-0 flex-1 bg-secondary px-5 py-6 md:px-10 md:py-8">
        <div className="mx-auto grid max-w-295 gap-8">
          <SectionHeading description="Biblioteca de modelos completos para novos sites." title="Templates" />
          <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Nenhum template cadastrado ainda.
          </div>
        </div>
      </main>
    </AppShell>
  );
}

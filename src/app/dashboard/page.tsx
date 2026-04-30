import { Button } from "@/components/atoms/button";
import { Icon } from "@/components/atoms/icon";
import { AppShell } from "@/components/organisms/app-shell";
import { ProjectCard } from "@/components/molecules/project-card";
import { SectionHeading } from "@/components/molecules/section-heading";
import { StatCard } from "@/components/molecules/stat-card";
import { getProjectMetrics, getProjects } from "@/features/projects/queries";
import { createNavItems } from "@/lib/navigation";
import { requireSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await requireSession();
  const [metrics, projects] = await Promise.all([getProjectMetrics(session.user.id), getProjects(session.user.id)]);

  return (
    <AppShell navItems={createNavItems("projects")}>
      <main className="min-w-0 flex-1 bg-background px-5 py-6 md:px-10 md:py-8">
        <div className="mx-auto grid max-w-295 gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeading description="Gerencie seus sites e projetos" title="Projetos" />
            <Button asChild className="h-9.25 self-start px-5">
              <a href="/projects/new">
                <Icon name="plus" />
                Novo Projeto
              </a>
            </Button>
          </div>

          <section aria-label="Resumo dos projetos" className="grid gap-4 md:grid-cols-3">
            {metrics.map((metric) => (
              <StatCard key={metric.label} label={metric.label} metric={metric.value} tone={metric.tone} />
            ))}
          </section>

          <section aria-label="Projetos" className="grid gap-4 lg:grid-cols-2">
            {projects.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-secondary p-8 text-center text-sm text-muted-foreground lg:col-span-2">
                Nenhum projeto criado ainda. Use “Novo Projeto” para começar.
              </div>
            ) : null}
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>
        </div>
      </main>
    </AppShell>
  );
}

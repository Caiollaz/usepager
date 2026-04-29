import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Field } from "@/components/molecules/field";
import { SectionHeading } from "@/components/molecules/section-heading";
import { AppShell } from "@/components/organisms/app-shell";
import { createProjectAction } from "@/features/projects/project-actions";
import { createNavItems } from "@/lib/navigation";
import { requireSession } from "@/lib/session";

export default async function NewProjectPage() {
  await requireSession();

  return (
    <AppShell navItems={createNavItems("projects")}>
      <main className="min-w-0 flex-1 bg-secondary px-5 py-6 md:px-10 md:py-8">
        <div className="mx-auto grid max-w-180 gap-8">
          <SectionHeading description="Crie a base do site e abra direto no editor." title="Novo Projeto" />
          <Card className="p-6">
            <form action={createProjectAction} className="grid gap-5">
              <Field label="Nome do projeto">
                <Input name="name" placeholder="Landing Page - Cliente" required />
              </Field>
              <Field label="Subdomínio">
                <Input name="subdomain" placeholder="cliente" required />
              </Field>
              <Field label="Descrição">
                <Textarea name="description" placeholder="Descrição curta para SEO e briefing interno." />
              </Field>
              <Button className="h-11 w-fit px-6" type="submit">
                Criar e abrir editor
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </AppShell>
  );
}

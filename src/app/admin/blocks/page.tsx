import Form from "next/form";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { BlockCard } from "@/components/molecules/block-card";
import { Field } from "@/components/molecules/field";
import { SectionHeading } from "@/components/molecules/section-heading";
import { StatCard } from "@/components/molecules/stat-card";
import { AppShell } from "@/components/organisms/app-shell";
import { getBlockMetrics, getBlocks } from "@/db/queries";
import { createBlockAction, deleteBlockAction } from "@/features/blocks/block-actions";
import { requireAdmin } from "@/lib/authorization";
import { createNavItems } from "@/lib/navigation";

export default async function BlocksAdminPage() {
  await requireAdmin();
  const [metrics, blockItems] = await Promise.all([getBlockMetrics(), getBlocks()]);

  return (
    <AppShell navItems={createNavItems("blocks")}>
      <main className="min-w-0 flex-1 bg-canvas px-5 py-6 md:px-10 md:py-8">
        <div className="mx-auto grid max-w-295 gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeading description="Gerencie a biblioteca interna de blocos reutilizáveis." title="Admin — Blocos e Componentes" />
            <div className="flex gap-2">
              <Button disabled variant="secondary">Importar JSON</Button>
              <Button asChild><a href="#new-block">Novo Bloco</a></Button>
            </div>
          </div>

          <section aria-label="Resumo da biblioteca" className="grid gap-4 md:grid-cols-3">
            {metrics.map((metric) => (
              <StatCard key={metric.label} label={metric.label} metric={metric.value} tone={metric.tone} />
            ))}
          </section>

          <Form action="/admin/blocks" className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center">
            <Input className="h-10 sm:w-80" name="q" placeholder="Buscar bloco..." />
            <div className="flex flex-wrap gap-2">
              <Badge className="px-3 py-1.5" tone="default">Todos</Badge>
              <Badge className="px-3 py-1.5" tone="outline">Hero</Badge>
              <Badge className="px-3 py-1.5" tone="outline">Pricing</Badge>
              <Badge className="px-3 py-1.5" tone="outline">Footer</Badge>
            </div>
          </Form>

          <Card className="grid gap-5 p-5" id="new-block">
            <SectionHeading description="Cadastre HTML/CSS para aparecer no painel de blocos do editor." title="Novo Bloco" />
            <form action={createBlockAction} className="grid gap-4 lg:grid-cols-2">
              <Field label="Nome">
                <Input name="name" placeholder="Hero SaaS" required />
              </Field>
              <Field label="Categoria">
                <Input name="category" placeholder="Hero" required />
              </Field>
              <Field label="Status">
                <select className="h-11 w-full rounded-md border border-border bg-card px-3.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/10" name="status" defaultValue="active">
                  <option value="active">Ativo</option>
                  <option value="review">Em revisão</option>
                </select>
              </Field>
              <div />
              <Field className="lg:col-span-2" label="HTML">
                <Textarea name="html" placeholder="<section>...</section>" rows={7} />
              </Field>
              <Field className="lg:col-span-2" label="CSS">
                <Textarea name="css" placeholder=".hero { ... }" rows={7} />
              </Field>
              <Button className="h-11 w-fit px-6" type="submit">Salvar bloco</Button>
            </form>
          </Card>

          <section className="rounded-lg border border-border bg-card p-3" aria-label="Blocos cadastrados">
            <div className="grid gap-4 lg:grid-cols-2">
              {blockItems.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-secondary p-8 text-center text-sm text-muted-foreground lg:col-span-2">
                  Nenhum bloco cadastrado ainda.
                </div>
              ) : null}
              {blockItems.map((item) => (
                <BlockCard
                  actions={(
                    <form action={deleteBlockAction.bind(null, item.id)}>
                      <Button size="sm" type="submit" variant="destructive">Excluir</Button>
                    </form>
                  )}
                  item={item}
                  key={item.id}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}

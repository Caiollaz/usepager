import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { Icon } from "@/components/atoms/icon";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Field } from "@/components/molecules/field";
import { SectionHeading } from "@/components/molecules/section-heading";
import { AppShell } from "@/components/organisms/app-shell";
import { getProjectAssets, getProjectPages } from "@/db/queries";
import { deleteProjectAssetAction, uploadProjectAssetAction } from "@/features/assets/asset-actions";
import { requireProjectAccess } from "@/features/projects/project-access";
import { deleteProjectAction, updateProjectSettingsAction } from "@/features/projects/project-actions";
import { unpublishProjectAction } from "@/features/publishing/publish-project-action";
import { createNavItems } from "@/lib/navigation";
import { requireSession } from "@/lib/session";

type SettingsPageProps = {
  params: Promise<{ "project-id": string }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const session = await requireSession();
  const resolvedParams = await params;
  const project = await requireProjectAccess(resolvedParams["project-id"], session.user.id);
  const [projectPages, projectAssets] = await Promise.all([getProjectPages(project.id), getProjectAssets(project.id)]);
  const baseDomain = process.env.SITE_BASE_DOMAIN ?? "localhost";

  return (
    <AppShell navItems={createNavItems("settings", project.id)}>
      <main className="min-w-0 flex-1 bg-secondary px-5 py-6 md:px-10 md:py-8">
        <div className="mx-auto grid max-w-295 gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeading description={project.domain} title="Configurações do Projeto" />
            <Button asChild className="h-9.25 self-start px-5" variant="secondary">
              <Link href={`/editor/${project.id}/${projectPages[0]?.id ?? ""}`}>Abrir editor</Link>
            </Button>
          </div>

          <form action={updateProjectSettingsAction} className="grid gap-6">
            <input name="project_id" type="hidden" value={project.id} />
            <SettingsSection label="GERAL">
              <Field label="Nome do projeto">
                <Input defaultValue={project.name} name="name" required />
              </Field>
              <Field label="Subdomínio">
                <div className="grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-0">
                  <span className="flex h-10 items-center rounded-md border border-border bg-secondary px-3 text-sm text-muted-foreground sm:rounded-r-none">
                    https://
                  </span>
                  <Input className="h-10 rounded-md sm:rounded-none sm:border-x-0" defaultValue={project.subdomain} name="subdomain" required />
                  <span className="flex h-10 items-center rounded-md border border-border bg-secondary px-3 text-sm text-muted-foreground sm:rounded-l-none">
                    .{baseDomain}
                  </span>
                </div>
              </Field>
              <Field label="Domínio customizado">
                <Input defaultValue={project.customDomain ?? ""} name="custom_domain" placeholder="www.cliente.com.br" />
              </Field>
              <Field label="Descrição">
                <Textarea defaultValue={project.description ?? ""} name="description" />
              </Field>
            </SettingsSection>

            <SettingsSection label="SEO">
              <Field label="Meta título">
                <Input defaultValue={project.metaTitle ?? ""} name="meta_title" />
              </Field>
              <Field label="Meta descrição">
                <Textarea defaultValue={project.metaDescription ?? ""} name="meta_description" />
              </Field>
            </SettingsSection>

            <Button className="h-9.25 w-fit px-5" type="submit">Salvar Alterações</Button>
          </form>

          <SettingsSection label="PÁGINAS">
            <div className="grid gap-2">
              {projectPages.map((page) => (
                <Link className="flex items-center justify-between rounded-md border border-border bg-secondary px-3 py-2 text-sm" href={`/editor/${project.id}/${page.id}`} key={page.id}>
                  <span>{page.title}</span>
                  <span className="text-muted-foreground">/{page.slug === "index" ? "" : page.slug}</span>
                </Link>
              ))}
            </div>
          </SettingsSection>

          <SettingsSection label="ASSETS">
            <form action={uploadProjectAssetAction} className="grid gap-3 sm:grid-cols-[1fr_auto]" encType="multipart/form-data">
              <input name="project_id" type="hidden" value={project.id} />
              <input name="purpose" type="hidden" value="favicon" />
              <Input accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/x-icon" name="file" required type="file" />
              <Button className="h-11" type="submit">
                <Icon name="image" />
                Upload
              </Button>
            </form>
            <div className="grid gap-2">
              {projectAssets.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum asset enviado ainda.</p> : null}
              {projectAssets.map((asset) => (
                <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-secondary px-3 py-2 text-sm" key={asset.id}>
                  <a className="min-w-0 truncate" href={asset.url} target="_blank">{asset.fileName}</a>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-muted-foreground">{Math.ceil(asset.size / 1024)} KB</span>
                    <form action={deleteProjectAssetAction.bind(null, asset.id)}>
                      <Button className="h-8 px-3" type="submit" variant="ghost">Excluir</Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </SettingsSection>

          <div className="grid gap-3">
            <h2 className="text-xs font-semibold tracking-[0.15em] text-destructive">ZONA DE PERIGO</h2>
            {project.status === "published" ? (
              <Card className="flex flex-col gap-4 border-amber-300 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid gap-1">
                  <h3 className="text-sm font-semibold text-foreground">Despublicar site</h3>
                  <p className="text-[13px] text-muted-foreground">Remove os arquivos estáticos publicados e volta o projeto para rascunho.</p>
                </div>
                <form action={unpublishProjectAction.bind(null, project.id)}>
                  <Button type="submit" variant="secondary">Despublicar</Button>
                </form>
              </Card>
            ) : null}
            <Card className="flex flex-col gap-4 border-red-300 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid gap-1">
                <h3 className="text-sm font-semibold text-foreground">Excluir projeto</h3>
                <p className="text-[13px] text-muted-foreground">Esta ação é irreversível. O projeto será removido permanentemente.</p>
              </div>
              <form action={deleteProjectAction.bind(null, project.id)}>
                <Button type="submit" variant="destructive">Excluir</Button>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

function SettingsSection({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <section className="grid gap-3">
      <h2 className="text-xs font-semibold tracking-[0.15em] text-muted-foreground">{label}</h2>
      <Card className="grid gap-5 p-6">{children}</Card>
    </section>
  );
}

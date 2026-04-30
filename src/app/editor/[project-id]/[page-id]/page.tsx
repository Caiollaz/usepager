import { Button } from "@/components/atoms/button";
import { Icon } from "@/components/atoms/icon";
import { GrapesEditor } from "@/features/editor/grapes-editor";
import { requirePageAccess } from "@/features/projects/project-access";
import { publishProjectAction } from "@/features/publishing/publish-project-action";
import { getEditorBlockGroups } from "@/features/blocks/queries";
import { requireSession } from "@/lib/session";

type EditorPageProps = {
  params: Promise<{
    "project-id": string;
    "page-id": string;
  }>;
};

export default async function ProjectEditorPage({ params }: EditorPageProps) {
  const session = await requireSession();
  const resolvedParams = await params;
  const { page, project } = await requirePageAccess(resolvedParams["page-id"], session.user.id, resolvedParams["project-id"]);
  const groups = await getEditorBlockGroups();

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <header className="flex min-h-14 items-center justify-between border-b border-border bg-secondary px-4">
        <div className="flex items-center gap-3">
          <Button asChild aria-label="Voltar" className="size-8" size="icon" variant="ghost">
            <a href="/dashboard"><Icon name="arrow-left" size={20} /></a>
          </Button>
          <strong className="text-[15px] font-semibold">{project.name} / {page.title}</strong>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="h-8 px-3 text-[13px]" variant="secondary">
            <a href={`/preview/${project.id}/${page.id}`} target="_blank">
              <Icon name="eye" />
              Preview
            </a>
          </Button>
          <form action={publishProjectAction.bind(null, project.id)}>
            <Button className="h-8 px-4 text-[13px]" type="submit">
              <Icon name="globe" />
              Publicar
            </Button>
          </form>
        </div>
      </header>
      <GrapesEditor
        blocks={groups}
        initialCss={page.css}
        initialHtml={page.html}
        initialProjectData={page.grapesJson}
        pageId={page.id}
      />
    </main>
  );
}

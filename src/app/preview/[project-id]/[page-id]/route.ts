import { requirePageAccess } from "@/features/projects/project-access";
import { requireSession } from "@/lib/session";

type PreviewRouteProps = {
  params: Promise<{
    "project-id": string;
    "page-id": string;
  }>;
};

export async function GET(_request: Request, { params }: PreviewRouteProps) {
  const session = await requireSession();
  const resolvedParams = await params;
  const { page, project } = await requirePageAccess(resolvedParams["page-id"], session.user.id, resolvedParams["project-id"]);
  const title = escapeHtml(page.metaTitle ?? project.metaTitle ?? page.title ?? project.name);
  const description = escapeHtml(page.metaDescription ?? project.metaDescription ?? "");

  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${title}</title>${description ? `<meta name="description" content="${description}"/>` : ""}<style>${page.css}</style></head><body>${page.html}</body></html>`;

  return new Response(html, {
    headers: { "cache-control": "no-store", "content-type": "text/html; charset=utf-8", "x-content-type-options": "nosniff" },
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

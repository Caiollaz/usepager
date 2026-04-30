import { count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { assets, pages, projects } from "@/db/schema";

export async function getProjectMetrics(ownerId: string) {
  const [row] = await db
    .select({
      total: count(),
      published: count(sql`case when ${projects.status} = 'published' then 1 end`),
      drafts: count(sql`case when ${projects.status} = 'draft' then 1 end`),
    })
    .from(projects)
    .where(eq(projects.ownerId, ownerId));

  return [
    { label: "Total de Projetos", value: String(row?.total ?? 0) },
    { label: "Publicados", value: String(row?.published ?? 0), tone: "success" as const },
    { label: "Rascunhos", value: String(row?.drafts ?? 0), tone: "warning" as const },
  ];
}

export async function getProjects(ownerId: string) {
  return db
    .select({
      id: projects.id,
      name: projects.name,
      domain: projects.domain,
      status: projects.status,
      firstPageId: sql<string | null>`(
        select ${pages.id}
        from ${pages}
        where ${pages.projectId} = ${projects.id}
        order by ${pages.createdAt} asc
        limit 1
      )`,
    })
    .from(projects)
    .where(eq(projects.ownerId, ownerId))
    .orderBy(desc(projects.createdAt));
}

export async function getProjectPages(projectId: string) {
  return db
    .select({ id: pages.id, title: pages.title, slug: pages.slug })
    .from(pages)
    .where(eq(pages.projectId, projectId))
    .orderBy(pages.createdAt);
}

export async function getProjectAssets(projectId: string) {
  return db
    .select({ id: assets.id, fileName: assets.fileName, mimeType: assets.mimeType, size: assets.size, url: assets.url })
    .from(assets)
    .where(eq(assets.projectId, projectId))
    .orderBy(desc(assets.createdAt));
}

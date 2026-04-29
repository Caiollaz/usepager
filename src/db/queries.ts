import { and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { assets, blocks, pages, projects } from "@/db/schema";

export async function getProjectMetrics(ownerId: string) {
  const [total, published, drafts] = await Promise.all([
    db.select({ value: count() }).from(projects).where(eq(projects.ownerId, ownerId)),
    db.select({ value: count() }).from(projects).where(and(eq(projects.ownerId, ownerId), eq(projects.status, "published"))),
    db.select({ value: count() }).from(projects).where(and(eq(projects.ownerId, ownerId), eq(projects.status, "draft"))),
  ]);

  return [
    { label: "Total de Projetos", value: String(total[0]?.value ?? 0) },
    { label: "Publicados", value: String(published[0]?.value ?? 0), tone: "success" as const },
    { label: "Rascunhos", value: String(drafts[0]?.value ?? 0), tone: "warning" as const },
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

export async function getProjectBySlug(ownerId: string, slug: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.ownerId, ownerId), eq(projects.slug, slug)))
    .limit(1);

  return project ?? null;
}

export async function getBlockMetrics() {
  const [total, active, review] = await Promise.all([
    db.select({ value: count() }).from(blocks),
    db.select({ value: count() }).from(blocks).where(eq(blocks.status, "active")),
    db.select({ value: count() }).from(blocks).where(eq(blocks.status, "review")),
  ]);

  return [
    { label: "Total de Blocos", value: String(total[0]?.value ?? 0) },
    { label: "Ativos", value: String(active[0]?.value ?? 0), tone: "success" as const },
    { label: "Em Revisão", value: String(review[0]?.value ?? 0), tone: "warning" as const },
  ];
}

export async function getBlocks() {
  return db
    .select({
      id: blocks.id,
      name: blocks.name,
      category: blocks.category,
      status: blocks.status,
      usageCount: blocks.usageCount,
      html: blocks.html,
      css: blocks.css,
    })
    .from(blocks)
    .orderBy(desc(blocks.createdAt));
}

export async function getEditorBlockGroups() {
  const rows = await db
    .select({ category: blocks.category, name: blocks.name, html: blocks.html, css: blocks.css })
    .from(blocks)
    .where(eq(blocks.status, "active"))
    .orderBy(blocks.category, blocks.name);

  const groups = new Map<string, { name: string; html: string; css: string }[]>();

  for (const row of rows) {
    const items = groups.get(row.category) ?? [];
    items.push({ name: row.name, html: row.html, css: row.css });
    groups.set(row.category, items);
  }

  return Array.from(groups, ([title, items]) => ({ title: title.toUpperCase(), items }));
}

export async function getProjectAssets(projectId: string) {
  return db
    .select({ id: assets.id, fileName: assets.fileName, mimeType: assets.mimeType, size: assets.size, url: assets.url })
    .from(assets)
    .where(eq(assets.projectId, projectId))
    .orderBy(desc(assets.createdAt));
}

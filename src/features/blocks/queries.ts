import { count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { blocks } from "@/db/schema";

export async function getBlockMetrics() {
  const [row] = await db
    .select({
      total: count(),
      active: count(sql`case when ${blocks.status} = 'active' then 1 end`),
      review: count(sql`case when ${blocks.status} = 'review' then 1 end`),
    })
    .from(blocks);

  return [
    { label: "Total de Blocos", value: String(row?.total ?? 0) },
    { label: "Ativos", value: String(row?.active ?? 0), tone: "success" as const },
    { label: "Em Revisão", value: String(row?.review ?? 0), tone: "warning" as const },
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

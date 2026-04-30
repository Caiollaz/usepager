import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blocks } from "@/db/schema";

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

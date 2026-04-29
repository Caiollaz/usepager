import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { pages, projects } from "@/db/schema";

export async function requireProjectAccess(projectId: string, ownerId: string) {
  const [project] = await db.select().from(projects).where(and(eq(projects.id, projectId), eq(projects.ownerId, ownerId))).limit(1);

  if (!project) notFound();

  return project;
}

export async function requirePageAccess(pageId: string, ownerId: string, projectId?: string) {
  const where = projectId
    ? and(eq(pages.id, pageId), eq(projects.id, projectId), eq(projects.ownerId, ownerId))
    : and(eq(pages.id, pageId), eq(projects.ownerId, ownerId));

  const [row] = await db
    .select({ page: pages, project: projects })
    .from(pages)
    .innerJoin(projects, eq(pages.projectId, projects.id))
    .where(where)
    .limit(1);

  if (!row) notFound();

  return row;
}

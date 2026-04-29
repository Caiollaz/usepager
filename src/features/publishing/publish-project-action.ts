"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { assets, pages, projects, publications } from "@/db/schema";
import { requireProjectAccess } from "@/features/projects/project-access";
import { buildStaticSite, removeStaticSite } from "@/features/publishing/static-site-builder";
import { createId } from "@/lib/id";
import { requireSession } from "@/lib/session";

export async function publishProjectAction(projectId: string) {
  const session = await requireSession();
  const project = await requireProjectAccess(projectId, session.user.id);
  const [projectPages, projectAssets] = await Promise.all([
    db.select().from(pages).where(eq(pages.projectId, project.id)),
    db.select().from(assets).where(eq(assets.projectId, project.id)),
  ]);
  const publicationId = createId("publication");

  try {
    const targetPath = await buildStaticSite({ assets: projectAssets, project, pages: projectPages });
    const now = new Date();

    await db.transaction(async (tx) => {
      await tx.insert(publications).values({
        id: publicationId,
        projectId: project.id,
        status: "success",
        targetPath,
        publishedAt: now,
      });
      await tx.update(projects).set({ status: "published", publishedAt: now, updatedAt: now }).where(eq(projects.id, project.id));
    });
  } catch (error) {
    await db.insert(publications).values({
      id: publicationId,
      projectId: project.id,
      status: "failed",
      targetPath: "",
      errorMessage: error instanceof Error ? error.message : "Erro desconhecido ao publicar.",
    });
    throw error;
  }

  revalidatePath("/dashboard");
}

export async function unpublishProjectAction(projectId: string) {
  const session = await requireSession();
  const project = await requireProjectAccess(projectId, session.user.id);
  const now = new Date();

  await removeStaticSite(project.subdomain);
  await db.transaction(async (tx) => {
    await tx.insert(publications).values({
      id: createId("publication"),
      projectId: project.id,
      status: "success",
      targetPath: "",
      publishedAt: now,
    });
    await tx.update(projects).set({ status: "draft", publishedAt: null, updatedAt: now }).where(eq(projects.id, project.id));
  });

  revalidatePath("/dashboard");
  revalidatePath(`/projects/${project.id}/settings`);
}

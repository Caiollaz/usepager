"use server";

import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { assets, projects } from "@/db/schema";
import { getStorageDir, isInsideStorage, validateAssetFile } from "@/features/assets/asset-security";
import { requireProjectAccess } from "@/features/projects/project-access";
import { createId } from "@/lib/id";
import { assertSafeSlug } from "@/lib/slug";
import { requireSession } from "@/lib/session";

export async function uploadProjectAssetAction(formData: FormData) {
  const session = await requireSession();
  const projectId = String(formData.get("project_id") ?? "");
  const purpose = String(formData.get("purpose") ?? "asset");
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error("Arquivo inválido.");
  }
  validateAssetFile(file);

  const project = await requireProjectAccess(projectId, session.user.id);
  const assetId = createId("asset");
  const storageDir = getStorageDir();
  const projectAssetsDir = path.join(storageDir, "assets", project.id);
  const fileName = safeFileName(file.name);
  const storagePath = path.join(projectAssetsDir, `${assetId}-${fileName}`);
  const publicUrl = `/uploads/${project.id}/${assetId}-${fileName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await mkdir(projectAssetsDir, { recursive: true });
  await writeFile(storagePath, buffer);

  await db.insert(assets).values({
    id: assetId,
    projectId: project.id,
    fileName,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    storagePath,
    url: publicUrl,
  });

  if (purpose === "favicon") {
    await db.update(projects).set({ faviconAssetId: assetId, updatedAt: new Date() }).where(eq(projects.id, project.id));
  }

  revalidatePath(`/projects/${project.id}/settings`);
}

export async function deleteProjectAssetAction(assetId: string) {
  const session = await requireSession();
  const [asset] = await db
    .select({ projectId: assets.projectId, storagePath: assets.storagePath })
    .from(assets)
    .innerJoin(projects, eq(assets.projectId, projects.id))
    .where(and(eq(assets.id, assetId), eq(projects.ownerId, session.user.id)))
    .limit(1);

  if (!asset) {
    throw new Error("Asset não encontrado.");
  }

  await db.transaction(async (tx) => {
    await tx.update(projects).set({ faviconAssetId: null, updatedAt: new Date() }).where(and(eq(projects.id, asset.projectId), eq(projects.faviconAssetId, assetId)));
    await tx.delete(assets).where(eq(assets.id, assetId));
  });

  if (isInsideStorage(asset.storagePath)) {
    await rm(/* turbopackIgnore: true */ asset.storagePath, { force: true });
  }

  revalidatePath(`/projects/${asset.projectId}/settings`);
}

function safeFileName(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  const name = path.basename(fileName, extension);
  const safeName = assertSafeSlug(name.replaceAll("_", "-").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "asset");

  return `${safeName}${extension.replace(/[^.a-z0-9]/g, "")}`;
}

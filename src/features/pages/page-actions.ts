"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { pages } from "@/db/schema";
import { requirePageAccess } from "@/features/projects/project-access";
import { assertSafeSlug } from "@/lib/slug";
import { requireSession } from "@/lib/session";

const savePageSchema = z.object({
  pageId: z.string().min(1),
  html: z.string(),
  css: z.string(),
  grapesJson: z.string().default("{}"),
});

export async function savePageContentAction(input: z.infer<typeof savePageSchema>) {
  const session = await requireSession();
  const data = savePageSchema.parse(input);
  const { project } = await requirePageAccess(data.pageId, session.user.id);

  await db
    .update(pages)
    .set({ html: data.html, css: data.css, grapesJson: data.grapesJson, updatedAt: new Date() })
    .where(eq(pages.id, data.pageId));

  revalidatePath(`/editor/${project.id}/${data.pageId}`);
}

export async function updatePageSeoAction(formData: FormData) {
  const session = await requireSession();
  const pageId = String(formData.get("page_id") ?? "");
  const slug = assertSafeSlug(String(formData.get("slug") ?? "index"));
  const { project } = await requirePageAccess(pageId, session.user.id);

  await db
    .update(pages)
    .set({
      title: String(formData.get("title") ?? "Home"),
      slug,
      metaTitle: String(formData.get("meta_title") ?? ""),
      metaDescription: String(formData.get("meta_description") ?? ""),
      updatedAt: new Date(),
    })
    .where(eq(pages.id, pageId));

  revalidatePath(`/editor/${project.id}/${pageId}`);
  revalidatePath(`/projects/${project.id}/settings`);
}

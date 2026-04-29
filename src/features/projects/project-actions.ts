"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { pages, projects } from "@/db/schema";
import { requireProjectAccess } from "@/features/projects/project-access";
import { removeStaticSite } from "@/features/publishing/static-site-builder";
import { createId } from "@/lib/id";
import { assertSafeSubdomain, toSlug } from "@/lib/slug";
import { requireSession } from "@/lib/session";

const createProjectSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto."),
  subdomain: z.string().trim().min(1, "Informe o subdomínio."),
  description: z.string().trim().optional(),
});

const updateProjectSettingsSchema = z.object({
  projectId: z.string().min(1),
  name: z.string().trim().min(2, "Nome muito curto."),
  subdomain: z.string().trim().min(1, "Informe o subdomínio."),
  description: z.string().trim().optional(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
  customDomain: z.string().trim().optional(),
});

export async function createProjectAction(formData: FormData) {
  const session = await requireSession();
  const parsed = createProjectSchema.parse({
    name: formData.get("name"),
    subdomain: formData.get("subdomain"),
    description: formData.get("description"),
  });
  const slug = toSlug(parsed.name);
  const subdomain = assertSafeSubdomain(toSlug(parsed.subdomain));
  const projectId = createId("project");
  const pageId = createId("page");
  const domain = `${subdomain}.${process.env.SITE_BASE_DOMAIN ?? "localhost"}`;

  await db.transaction(async (tx) => {
    await tx.insert(projects).values({
      id: projectId,
      ownerId: session.user.id,
      name: parsed.name,
      slug: assertSafeSubdomain(slug),
      subdomain,
      domain,
      description: parsed.description,
      metaTitle: parsed.name,
      metaDescription: parsed.description,
    });
    await tx.insert(pages).values({
      id: pageId,
      projectId,
      title: "Home",
      slug: "index",
      html: `<section class="hero"><h1>${parsed.name}</h1><p>${parsed.description ?? "Site criado com Pro Pages."}</p></section>`,
      css: ".hero{min-height:100vh;display:grid;place-items:center;text-align:center;font-family:Inter,system-ui,sans-serif;padding:48px}.hero h1{font-size:48px;margin:0}.hero p{color:#71717a;font-size:18px}",
      grapesJson: "{}",
      metaTitle: parsed.name,
      metaDescription: parsed.description,
    });
  });

  revalidatePath("/dashboard");
  redirect(`/editor/${projectId}/${pageId}`);
}

export async function updateProjectSettingsAction(formData: FormData) {
  const session = await requireSession();
  const parsed = updateProjectSettingsSchema.parse({
    projectId: formData.get("project_id"),
    name: formData.get("name"),
    subdomain: formData.get("subdomain"),
    description: formData.get("description"),
    metaTitle: formData.get("meta_title"),
    metaDescription: formData.get("meta_description"),
    customDomain: formData.get("custom_domain"),
  });

  await requireProjectAccess(parsed.projectId, session.user.id);

  const subdomain = assertSafeSubdomain(toSlug(parsed.subdomain));
  const customDomain = parsed.customDomain || null;
  const domain = customDomain || `${subdomain}.${process.env.SITE_BASE_DOMAIN ?? "localhost"}`;

  await db
    .update(projects)
    .set({
      name: parsed.name,
      slug: assertSafeSubdomain(toSlug(parsed.name)),
      subdomain,
      domain,
      description: parsed.description || null,
      metaTitle: parsed.metaTitle || parsed.name,
      metaDescription: parsed.metaDescription || null,
      customDomain,
      updatedAt: new Date(),
    })
    .where(and(eq(projects.id, parsed.projectId), eq(projects.ownerId, session.user.id)));

  revalidatePath("/dashboard");
  revalidatePath(`/projects/${parsed.projectId}/settings`);
}

export async function deleteProjectAction(projectId: string) {
  const session = await requireSession();
  const project = await requireProjectAccess(projectId, session.user.id);

  await removeStaticSite(project.subdomain);
  await db.delete(projects).where(and(eq(projects.id, project.id), eq(projects.ownerId, session.user.id)));
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

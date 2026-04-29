"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { blocks } from "@/db/schema";
import { requireAdmin } from "@/lib/authorization";
import { createId } from "@/lib/id";

const createBlockSchema = z.object({
  name: z.string().trim().min(2),
  category: z.string().trim().min(2),
  status: z.enum(["active", "review"]).default("active"),
  html: z.string().default(""),
  css: z.string().default(""),
});

export async function createBlockAction(formData: FormData) {
  await requireAdmin();

  const data = createBlockSchema.parse({
    name: formData.get("name"),
    category: formData.get("category"),
    status: formData.get("status") ?? "active",
    html: String(formData.get("html") ?? ""),
    css: String(formData.get("css") ?? ""),
  });

  await db.insert(blocks).values({
    id: createId("block"),
    name: data.name,
    category: data.category,
    status: data.status,
    html: data.html,
    css: data.css,
  });

  revalidatePath("/admin/blocks");
}

export async function deleteBlockAction(blockId: string) {
  await requireAdmin();
  await db.delete(blocks).where(eq(blocks.id, blockId));
  revalidatePath("/admin/blocks");
}

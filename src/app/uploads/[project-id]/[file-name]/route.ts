import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Readable } from "node:stream";
import { db } from "@/db";
import { assets, projects } from "@/db/schema";
import { isInsideStorage } from "@/features/assets/asset-security";
import { requireSession } from "@/lib/session";

type UploadRouteProps = {
  params: Promise<{ "project-id": string; "file-name": string }>;
};

export async function GET(_request: Request, { params }: UploadRouteProps) {
  const session = await requireSession();
  const resolvedParams = await params;
  const fileName = resolvedParams["file-name"];
  const url = `/uploads/${resolvedParams["project-id"]}/${fileName}`;

  const [asset] = await db
    .select({ storagePath: assets.storagePath, mimeType: assets.mimeType })
    .from(assets)
    .innerJoin(projects, eq(assets.projectId, projects.id))
    .where(and(eq(projects.ownerId, session.user.id), eq(assets.url, url)))
    .limit(1);

  if (!asset || !isInsideStorage(asset.storagePath)) notFound();

  try {
    await stat(/* turbopackIgnore: true */ asset.storagePath);
  } catch {
    notFound();
  }

  const stream = Readable.toWeb(createReadStream(/* turbopackIgnore: true */ asset.storagePath));

  return new Response(stream as ReadableStream, {
    headers: {
      "cache-control": "private, max-age=300",
      "content-type": asset.mimeType,
      "x-content-type-options": "nosniff",
    },
  });
}

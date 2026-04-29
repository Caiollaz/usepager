import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { notFound } from "next/navigation";
import { getStaticSitesDir } from "@/features/publishing/static-site-builder";
import { assertSafeSubdomain } from "@/lib/slug";

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

export async function servePublishedFile(subdomainValue: string, pathSegments: string[]) {
  const subdomain = assertSafeSubdomain(subdomainValue);
  const siteRoot = path.join(/* turbopackIgnore: true */ getStaticSitesDir(), subdomain);
  const targetPath = getPublishedTargetPath(siteRoot, pathSegments);

  let fileStat;
  try {
    fileStat = await stat(/* turbopackIgnore: true */ targetPath);
  } catch {
    notFound();
  }

  if (!fileStat.isFile()) notFound();

  const stream = Readable.toWeb(createReadStream(/* turbopackIgnore: true */ targetPath));
  const contentType = contentTypes[path.extname(targetPath).toLowerCase()] ?? "application/octet-stream";

  return new Response(stream as ReadableStream, {
    headers: {
      "cache-control": contentType.startsWith("text/html") ? "public, max-age=60" : "public, max-age=31536000, immutable",
      "content-length": String(fileStat.size),
      "content-type": contentType,
      "x-content-type-options": "nosniff",
    },
  });
}

function getPublishedTargetPath(siteRoot: string, pathSegments: string[]) {
  const safeSegments = pathSegments.length === 0 ? ["index.html"] : pathSegments.map(assertSafePathSegment);
  const lastSegment = safeSegments.at(-1) ?? "index.html";
  const fileSegments = path.extname(lastSegment) ? safeSegments : [...safeSegments, "index.html"];
  const targetPath = path.join(/* turbopackIgnore: true */ siteRoot, ...fileSegments);
  const resolvedRoot = path.resolve(/* turbopackIgnore: true */ siteRoot);
  const resolvedTarget = path.resolve(/* turbopackIgnore: true */ targetPath);

  if (resolvedTarget !== resolvedRoot && !resolvedTarget.startsWith(resolvedRoot + path.sep)) {
    notFound();
  }

  return resolvedTarget;
}

function assertSafePathSegment(segment: string) {
  if (segment === "." || segment === ".." || !/^[a-zA-Z0-9._-]+$/.test(segment)) {
    notFound();
  }

  return segment;
}

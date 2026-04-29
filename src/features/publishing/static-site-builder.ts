import { copyFile, mkdir, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { assertSafeSlug, assertSafeSubdomain } from "@/lib/slug";

type StaticPage = {
  slug: string;
  title: string;
  html: string;
  css: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

type StaticProject = {
  faviconAssetId: string | null;
  name: string;
  subdomain: string;
  metaTitle: string | null;
  metaDescription: string | null;
};

type StaticAsset = {
  fileName: string;
  storagePath: string;
  url: string;
};

export type BuildStaticSiteInput = {
  project: StaticProject;
  pages: StaticPage[];
  assets?: StaticAsset[];
};

export function getStaticSitesDir() {
  return path.resolve(/* turbopackIgnore: true */ process.env.STATIC_SITES_DIR ?? "./storage/sites");
}

export async function buildStaticSite({ assets = [], pages, project }: BuildStaticSiteInput) {
  const subdomain = assertSafeSubdomain(project.subdomain);
  const baseDir = getStaticSitesDir();
  const targetDir = path.join(/* turbopackIgnore: true */ baseDir, subdomain);
  const tmpDir = path.join(/* turbopackIgnore: true */ baseDir, `.tmp-${subdomain}-${Date.now()}`);

  await mkdir(tmpDir, { recursive: true });

  for (const page of pages) {
    const slug = page.slug === "index" ? "index" : assertSafeSlug(page.slug);
    const pageDir = slug === "index" ? tmpDir : path.join(/* turbopackIgnore: true */ tmpDir, slug);
    await mkdir(pageDir, { recursive: true });
    await writeFile(path.join(/* turbopackIgnore: true */ pageDir, "index.html"), renderHtml(project, page, assets), "utf8");
  }

  if (assets.length > 0) {
    const uploadsDir = path.join(/* turbopackIgnore: true */ tmpDir, "uploads");
    await mkdir(uploadsDir, { recursive: true });

    for (const asset of assets) {
      const targetPath = getAssetTargetPath(tmpDir, asset);
      await mkdir(path.dirname(targetPath), { recursive: true });
      await copyFile(/* turbopackIgnore: true */ asset.storagePath, targetPath);
    }
  }

  await rm(targetDir, { force: true, recursive: true });
  await rename(tmpDir, targetDir);

  return targetDir;
}

export async function removeStaticSite(subdomainValue: string) {
  const subdomain = assertSafeSubdomain(subdomainValue);
  const targetDir = path.join(/* turbopackIgnore: true */ getStaticSitesDir(), subdomain);

  await rm(targetDir, { force: true, recursive: true });
}

function renderHtml(project: StaticProject, page: StaticPage, assets: StaticAsset[]) {
  const title = escapeHtml(page.metaTitle || project.metaTitle || page.title || project.name);
  const description = escapeHtml(page.metaDescription || project.metaDescription || "");
  const favicon = assets.find((asset) => asset.url.includes(`/${project.faviconAssetId}-`));
  const faviconMarkup = favicon ? `<link rel="icon" href="${escapeHtml(favicon.url)}" />` : "";

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    ${description ? `<meta name="description" content="${description}" />` : ""}
    ${faviconMarkup}
    <style>${page.css}</style>
  </head>
  <body>${page.html}</body>
</html>`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getAssetTargetPath(siteDir: string, asset: StaticAsset) {
  const pathname = new URL(asset.url, "http://local").pathname;
  const segments = pathname.split("/").filter(Boolean).map(assertSafePathSegment);
  const targetPath = path.join(/* turbopackIgnore: true */ siteDir, ...segments);
  const resolvedSiteDir = path.resolve(/* turbopackIgnore: true */ siteDir);
  const resolvedTargetPath = path.resolve(/* turbopackIgnore: true */ targetPath);

  if (!resolvedTargetPath.startsWith(resolvedSiteDir + path.sep)) {
    throw new Error(`Caminho de asset inválido: ${asset.fileName}`);
  }

  return resolvedTargetPath;
}

function assertSafePathSegment(segment: string) {
  if (segment === "." || segment === ".." || !/^[a-zA-Z0-9._-]+$/.test(segment)) {
    throw new Error(`Segmento de asset inválido: ${segment}`);
  }

  return segment;
}

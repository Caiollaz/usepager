import { servePublishedFile } from "@/features/publishing/static-site-server";

type PublishedSiteRouteProps = {
  params: Promise<{ subdomain: string; path?: string[] }>;
};

export async function GET(_request: Request, { params }: PublishedSiteRouteProps) {
  const resolvedParams = await params;

  return servePublishedFile(resolvedParams.subdomain, resolvedParams.path ?? []);
}

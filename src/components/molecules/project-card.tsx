import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { Badge } from "@/components/atoms/badge";
import { Card } from "@/components/atoms/card";
import { PlaceholderImage } from "@/components/atoms/placeholder-image";
import { cn } from "@/lib/cn";

type ProjectCardProject = {
  id: string;
  name: string;
  domain: string;
  status: "published" | "draft";
  firstPageId: string | null;
};

export type ProjectCardProps = ComponentPropsWithoutRef<typeof Card> & {
  project: ProjectCardProject;
};

/** Project tile with the same 140px thumbnail and 16px content padding from Pencil. */
export function ProjectCard({ className, project, ...props }: ProjectCardProps) {
  const isPublished = project.status === "published";
  const href = project.firstPageId
    ? `/editor/${project.id}/${project.firstPageId}`
    : `/editor/${project.id}`;

  return (
    <Link href={href} className="block">
      <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", className)} {...props}>
        <PlaceholderImage className="h-35 w-full" />
        <div className="grid gap-2 p-4">
          <h3 className="text-base font-semibold leading-none text-foreground">{project.name}</h3>
          <div className="flex min-w-0 items-center gap-2">
            <Badge tone={isPublished ? "success" : "warning"}>{isPublished ? "Publicado" : "Rascunho"}</Badge>
            <span className="truncate text-xs text-muted-foreground">{project.domain}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

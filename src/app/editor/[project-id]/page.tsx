import { notFound, redirect } from "next/navigation";
import { requireProjectAccess } from "@/features/projects/project-access";
import { getProjectPages } from "@/features/projects/queries";
import { requireSession } from "@/lib/session";

type Props = {
  params: Promise<{ "project-id": string }>;
};

/** Redirects to the first page of the project so the editor opens. */
export default async function ProjectEditorRedirect({ params }: Props) {
  const session = await requireSession();
  const { "project-id": projectId } = await params;
  await requireProjectAccess(projectId, session.user.id);

  const projectPages = await getProjectPages(projectId);
  if (projectPages.length === 0) notFound();

  redirect(`/editor/${projectId}/${projectPages[0].id}`);
}

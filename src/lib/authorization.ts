import { forbidden } from "next/navigation";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireSession } from "@/lib/session";

export async function requireAdmin() {
  const session = await requireSession();
  const [currentUser] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).limit(1);

  if (currentUser?.role !== "admin") {
    forbidden();
  }

  return session;
}

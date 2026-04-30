import { forbidden } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireSession } from "@/lib/session";

export async function requireAdmin() {
  const session = await requireSession();
  const [currentUser] = await db.select({ role: users.role }).from(users).where(eq(users.id, session.user.id)).limit(1);

  if (currentUser?.role !== "admin") {
    forbidden();
  }

  return session;
}

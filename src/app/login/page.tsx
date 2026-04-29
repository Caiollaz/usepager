import { AuthPanel } from "@/components/organisms/auth-panel";
import { redirectAuthenticated } from "@/lib/session";

export default async function LoginPage() {
  await redirectAuthenticated();

  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-2">
      <section className="flex min-h-dvh items-center justify-center px-6 py-12 lg:px-16">
        <AuthPanel mode="login" />
      </section>
      <aside className="hidden min-h-dvh items-center justify-center bg-secondary px-16 text-center lg:flex">
        <figure className="grid max-w-130 gap-4">
          <blockquote className="text-lg font-semibold leading-relaxed text-foreground">
            “Criamos sites 5x mais rápido com o Pro Pages. O editor drag-and-drop mudou nosso workflow.”
          </blockquote>
          <figcaption className="text-sm text-muted-foreground">— Caio, CEO da Pro</figcaption>
        </figure>
      </aside>
    </main>
  );
}

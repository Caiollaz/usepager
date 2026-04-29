import { AuthPanel } from "@/components/organisms/auth-panel";
import { redirectAuthenticated } from "@/lib/session";

export default async function RegisterPage() {
  await redirectAuthenticated();

  return (
    <main className="grid min-h-dvh bg-background lg:grid-cols-2">
      <section className="flex min-h-dvh items-center justify-center px-6 py-12 lg:px-16">
        <AuthPanel mode="register" />
      </section>
      <aside className="hidden min-h-dvh items-center justify-center bg-secondary px-16 text-center lg:flex">
        <figure className="grid max-w-130 gap-4">
          <blockquote className="text-lg font-semibold leading-relaxed text-foreground">
            “Padronizamos templates, blocos e deploy. Agora cada cliente começa com uma base pronta para publicar.”
          </blockquote>
          <figcaption className="text-sm text-muted-foreground">— Time interno Pro Pages</figcaption>
        </figure>
      </aside>
    </main>
  );
}

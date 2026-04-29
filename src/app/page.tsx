import Link from "next/link";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { Icon } from "@/components/atoms/icon";
import { PlaceholderImage } from "@/components/atoms/placeholder-image";

const metrics = [
  { value: "5x", label: "mais rápido para montar páginas" },
  { value: "0", label: "dependências de UI externa" },
  { value: "100%", label: "publicação estática em subdomínio" },
];

const features = [
  {
    icon: "layout-template" as const,
    title: "Templates aprovados",
    description: "Comece por modelos completos para landing pages, portfólios e sites institucionais.",
  },
  {
    icon: "blocks" as const,
    title: "Blocos reutilizáveis",
    description: "Biblioteca de hero, pricing, features, FAQ e footer pronta para drag-and-drop.",
  },
  {
    icon: "globe" as const,
    title: "Deploy na VPS",
    description: "Gere HTML, CSS e assets estáticos com publicação em subdomínio via Nginx.",
  },
];

const steps = ["Escolher template aprovado", "Arrastar blocos e editar conteúdo", "Publicar em subdomínio estático"];

const architecture = [
  ["Next.js plataforma", "App Router"],
  ["PostgreSQL + Drizzle", "Projetos e blocos"],
  ["Nginx wildcard", "*.dominio.com"],
];

const libraryBlocks = [
  ["Hero com CTA Central", "Hero • 12 usos"],
  ["Tabela de Preços", "Pricing • 8 usos"],
  ["Footer Newsletter", "Footer • 9 usos"],
];

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-18 max-w-360 items-center justify-between px-5 md:px-20">
          <Link className="flex items-center gap-2.5" href="/">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-lg font-bold leading-none text-primary-foreground">
              P
            </span>
            <span className="text-xl font-bold text-foreground">Pro Pages</span>
          </Link>
          <nav aria-label="Navegação da landing" className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a className="hover:text-foreground" href="#produto">Produto</a>
            <a className="hover:text-foreground" href="#templates">Templates</a>
            <a className="hover:text-foreground" href="#publicacao">Publicação</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <Button asChild className="h-10 w-21.5 px-0" variant="secondary">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild className="h-10 w-28 px-0">
              <Link href="/register">Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-360 items-center gap-10 px-5 py-14 md:px-20 lg:min-h-160 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-14 lg:py-14.25">
        <div className="grid max-w-176 gap-5.5">
          <span className="w-fit rounded-full border border-border bg-muted px-3 py-1.5 text-[13px] font-medium text-muted-foreground">
            Page builder interno para entregas rápidas
          </span>
          <h1 className="max-w-165 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[56px]">
            Crie, edite e publique sites estáticos sem sair do workflow.
          </h1>
          <p className="max-w-162.5 text-base leading-[1.45] text-muted-foreground md:text-lg">
            Uma plataforma white-label para times internos: templates aprovados, blocos reutilizáveis, editor visual e publicação em subdomínio na sua própria VPS.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 w-31 px-0">
              <Link href="/register">Criar conta</Link>
            </Button>
            <Button asChild className="h-11 w-23 px-0" variant="secondary">
              <Link href="/login">Entrar</Link>
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden rounded-xl border-border-strong shadow-none lg:h-81.5 lg:w-130">
          <div className="flex h-12 items-center gap-2 border-b border-border px-4">
            <span className="size-2.5 rounded-full bg-border-strong" />
            <span className="size-2.5 rounded-full bg-border-strong" />
            <span className="size-2.5 rounded-full bg-border-strong" />
          </div>
          <div className="flex min-h-69.5 flex-col items-center justify-center gap-4.5 bg-secondary p-8 text-center">
            <Icon className="text-zinc-400" name="image" size={48} />
            <div className="grid gap-2">
              <h2 className="text-[22px] font-bold text-foreground">Template pronto + blocos</h2>
              <p className="mx-auto max-w-90 text-sm text-muted-foreground">
                Monte páginas, publique estático e entregue em subdomínio.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto grid max-w-360 gap-4 px-5 py-6 md:grid-cols-3 md:px-20" aria-label="Métricas">
        {metrics.map((metric) => (
          <Card className="grid gap-1.5 rounded-xl p-5.5 shadow-none" key={metric.label}>
            <strong className="text-[38px] font-extrabold leading-none text-foreground">{metric.value}</strong>
            <span className="text-sm text-muted-foreground">{metric.label}</span>
          </Card>
        ))}
      </section>

      <section className="mx-auto grid max-w-360 gap-6 px-5 py-16 md:px-20 lg:py-22.5" id="produto">
        <div className="grid gap-2">
          <h2 className="text-3xl font-extrabold text-foreground md:text-[32px]">Mais que uma hero: um sistema operacional para sites</h2>
          <p className="text-[15px] text-muted-foreground">Do cadastro ao deploy, tudo pensado para escala interna e consistência visual.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {features.map((feature) => (
            <Card className="grid min-h-47.5 gap-3 rounded-xl p-6 shadow-none" key={feature.title}>
              <Icon className="text-primary" name={feature.icon} size={26} />
              <h3 className="text-[17px] font-bold text-foreground">{feature.title}</h3>
              <p className="text-sm leading-[1.45] text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-360 items-center gap-6 px-5 pb-14 pt-6 md:px-20 lg:grid-cols-[minmax(0,1fr)_560px]" id="publicacao">
        <div className="grid gap-3.5">
          <h2 className="text-3xl font-extrabold text-foreground">Workflow de entrega</h2>
          <p className="max-w-130 text-[15px] leading-normal text-muted-foreground mmd:leading-normal">
            O time escolhe um template, customiza blocos, configura SEO, publica o site estático e entrega o subdomínio para o cliente.
          </p>
          <div className="grid max-w-130 gap-2.5">
            {steps.map((step, index) => (
              <div className="flex items-center gap-3 rounded-2.5 border border-border bg-card p-3.5" key={step}>
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-[13px] font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-foreground">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="grid gap-3.5 rounded-xl bg-secondary p-6 shadow-none">
          <h3 className="text-lg font-bold text-foreground">Arquitetura planejada</h3>
          <div className="grid gap-2.5">
            {architecture.map(([name, value]) => (
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-3.5" key={name}>
                <span className="text-sm font-semibold text-foreground">{name}</span>
                <span className="text-[13px] text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="border-y border-border bg-secondary" id="templates">
        <div className="mx-auto grid max-w-360 gap-6 px-5 py-14 md:px-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid gap-2">
              <h2 className="text-3xl font-extrabold text-foreground">Biblioteca para o time inteiro</h2>
              <p className="text-[15px] text-muted-foreground">Componentes padronizados para manter qualidade entre projetos.</p>
            </div>
            <span className="flex h-9 w-32.5 items-center justify-center rounded-full border border-border bg-card text-[13px] font-semibold text-foreground">
              Admin interno
            </span>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {libraryBlocks.map(([name, meta]) => (
              <Card className="grid gap-3 rounded-xl p-4.5 shadow-none" key={name}>
                <PlaceholderImage className="h-23 rounded-lg" />
                <h3 className="text-[15px] font-bold text-foreground">{name}</h3>
                <p className="text-xs text-muted-foreground">{meta}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-360 flex-col gap-5 px-5 py-10 md:min-h-37.5 md:flex-row md:items-center md:justify-between md:px-20 md:py-0">
        <div className="grid gap-1.5">
          <h2 className="text-2xl font-extrabold text-foreground">Pronto para criar o próximo site?</h2>
          <p className="text-sm text-muted-foreground">Entre na plataforma ou crie uma conta para começar.</p>
        </div>
        <Button asChild className="h-11 w-31 px-0">
          <Link href="/register">Criar conta</Link>
        </Button>
      </section>
    </main>
  );
}

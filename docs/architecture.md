# Arquitetura

## Stack

- **Framework**: Next.js 16 (App Router, React Server Components por padrao)
- **Linguagem**: TypeScript strict
- **Estilizacao**: Tailwind CSS v4
- **Autenticacao**: Better Auth (email/senha, JWT)
- **Banco de dados**: PostgreSQL via Drizzle ORM (driver `pg`, casing `snake_case`)
- **Editor visual**: GrapesJS
- **Runtime**: Node.js 22

## Estrutura de pastas

```
src/
  app/           Rotas, Server Components, Route Handlers
  components/    Componentes UI atomicos (button, card, input, etc.)
  features/      Logica de negocio, Server Actions, queries por feature
  db/            Conexao Drizzle, schema, migrations
  lib/           Utilitarios transversais (auth, sessao, slugs, IDs, cn)
```

## Fluxo de dados

```
Browser → Middleware (headers + auth guard)
  → Server Component (busca dados via queries em features/)
    → Renderiza HTML com componentes de components/
  → Client Component (apenas quando precisa de estado/efeitos no browser)
    → Server Action (mutacao via features/*-actions.ts)
      → Drizzle ORM → PostgreSQL
      → revalidatePath()
```

## Convencoes de rotas

| Rota | Tipo | Descricao |
|------|------|-----------|
| `/` | Page | Landing publica |
| `/login`, `/register` | Page | Autenticacao |
| `/dashboard` | Page | Listagem de projetos do usuario |
| `/projects/new` | Page | Criar projeto |
| `/projects/[project-id]/settings` | Page | Configuracoes do projeto |
| `/editor/[project-id]/[page-id]` | Page | Editor GrapesJS |
| `/admin/blocks` | Page | CRUD de blocos (admin) |
| `/templates` | Page | Galeria de templates |
| `/api/auth/[...all]` | Route Handler | Better Auth endpoints |
| `/preview/[project-id]/[page-id]` | Route Handler | Preview de pagina |
| `/uploads/[project-id]/[file-name]` | Route Handler | Serve assets |
| `/sites/[subdomain]/[[...path]]` | Route Handler | Serve sites publicados (dev) |

## Server Components vs Client Components

Server Components sao o padrao. Client Components (`"use client"`) sao usados apenas para:

- GrapesJS editor (`grapes-editor.tsx`)
- Formularios com estado local
- Auth client (`auth-client.ts`)

## Mutations

Todas as mutacoes passam por Server Actions em `src/features/`. Cada action:

1. Valida sessao com `requireSession()`
2. Valida ownership com `requireProjectAccess()` ou `requirePageAccess()`
3. Valida input com Zod ou guards explicitos
4. Executa mutacao via Drizzle
5. Chama `revalidatePath()` para invalidar cache

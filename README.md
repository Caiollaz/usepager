# Pro Pages

Plataforma interna para criação e publicação de sites estáticos, seguindo o design do `app.pen`.

## Stack

- Next.js 16 com App Router
- React Server Components por padrão
- Tailwind CSS v4 com tokens em `src/app/globals.css`
- Better Auth com email/senha e plugin JWT
- Drizzle ORM + PostgreSQL
- `tailwind-variants` para variantes de componentes
- `tailwind-merge` para resolver conflitos de `className`
- Componentes próprios baseados em HTML, sem biblioteca de UI

## Rotas

- `/login` - autenticação
- `/register` - cadastro com email e senha
- `/dashboard` - lista e métricas de projetos
- `/editor/[project-id]/[page-id]` - editor visual GrapesJS com persistência
- `/projects/[project-id]/settings` - configurações, assets e páginas do projeto
- `/admin/blocks` - biblioteca interna de blocos e componentes
- `/preview/[project-id]/[page-id]` - preview HTML real
- `/uploads/[project-id]/[file-name]` - assets privados do editor
- `/sites/[subdomain]/[[...path]]` - serving HTTP dos sites publicados em desenvolvimento

## Arquitetura de UI

Atomic design:

- `src/components/atoms` - elementos primitivos (`Button`, `Input`, `Badge`, `Icon`, `Card`)
- `src/components/molecules` - composições pequenas (`Field`, `StatCard`, `ProjectCard`, `SidebarNav`)
- `src/components/organisms` - regiões de tela (`AppShell`, `AuthPanel`, `EditorPreview`, painéis do editor)
- `src/app/**/page.tsx` - páginas/rotas que montam as compositions

Todos os componentes públicos estendem props nativas de HTML via `ComponentPropsWithoutRef`. Isso mantém suporte a `className`, `aria-*`, eventos, `type`, `name`, `disabled`, etc.

## Tokens do Design

Os tokens em `globals.css` foram derivados do Pencil/shadcn:

- Primary: `#1A1A1A`
- Background: `#FFFFFF`
- Secondary: `#F9FAFB`
- Muted: `#F4F4F5`
- Border: `#E4E4E7`
- Text primary: `#0A0A0A`
- Text secondary: `#71717A`
- Radius: `6px`, `8px`, `12px`, `16px`

## Pixel Reference

Dimensões principais do Pencil:

- Canvas desktop: `1440x900`
- Sidebar app: `260px`
- Editor topbar: `56px`
- Editor left panel: `260px`
- Editor right panel: `280px`
- Project thumbnail: `140px`
- Editor preview nav: `60px`
- Inputs principais: `44px`

## Responsividade

- Mobile-first por padrão
- Sidebar vira trilha horizontal no mobile
- Dashboard/Admin cards passam de `1 coluna` para `2/3 colunas`
- Editor empilha painéis no mobile e usa grid `260px / 1fr / 280px` em desktop
- Formulários preservam largura fluida e campos compostos quebram em linhas no mobile

## Comandos

```bash
docker compose up -d
npm run db:generate
npm run db:migrate
npm run dev
npm run typecheck
npm run lint
npm run build
```

## Publicação Estática

`publishProjectAction` gera HTML estático de forma síncrona em `STATIC_SITES_DIR/{subdomain}`. Em desenvolvimento o padrão é `./storage/sites`; em produção use um diretório servido pelo Nginx, por exemplo `/var/www/pro-pages/sites`.

Assets enviados ficam em `STORAGE_DIR/assets/{projectId}` e são copiados para `uploads/` dentro do site publicado.

Em desenvolvimento, o site publicado também pode ser acessado por `/sites/{subdomain}`. Em produção, prefira servir `STATIC_SITES_DIR` diretamente pelo Nginx/Caddy para evitar passar tráfego público pelo app Next.

`unpublishProjectAction` remove o diretório publicado e volta o projeto para rascunho.

## Segurança do Backend

- Rotas internas são protegidas por `middleware.ts` e por `requireSession()` server-side.
- `/admin/blocks` e ações de blocos exigem `user.role = 'admin'`.
- Uploads aceitam apenas imagens, fontes web e PDF com limite `MAX_ASSET_SIZE_BYTES`.
- Uploads e sites publicados validam caminhos para evitar path traversal.
- Respostas sensíveis incluem `x-content-type-options: nosniff` e headers básicos de segurança no middleware.
- Índices foram adicionados para consultas por owner/status, páginas por projeto, assets por projeto/url e histórico de publicações.

Veja `docs/nginx.md` para um exemplo de wildcard subdomain.

## Autenticação

Better Auth está montado em `/api/auth/[...all]`.

- Cadastro: `/register`
- Login: `/login`
- Sessão server-side: `src/lib/session.ts`
- JWT: Better Auth plugin `jwt()` expõe token/JWKS nos endpoints do Better Auth

As páginas internas chamam `requireSession()` e redirecionam para `/login` quando não há sessão.

Usuários novos entram com role `user`. Para liberar o admin de blocos, promova manualmente no banco:

```sql
update "user" set role = 'admin' where email = 'admin@exemplo.com';
```

# Autenticacao

## Stack

Better Auth com adapter Drizzle + PostgreSQL. Email/senha sem verificacao de email. JWT com expiracao de 1h.

## Configuracao

- **Servidor**: `src/lib/auth.ts` — configura Better Auth com tabelas do schema, plugin JWT
- **Cliente**: `src/lib/auth-client.ts` — hook React `"use client"` com plugin JWT
- **Route Handler**: `src/app/api/auth/[...all]/route.ts` — todas as rotas de auth do Better Auth

## Sessao

Helpers em `src/lib/session.ts`:

| Funcao | Descricao |
|--------|-----------|
| `getCurrentSession()` | Retorna sessao atual ou `null`. Usa headers do request |
| `requireSession()` | Retorna sessao ou redireciona para `/login` |
| `redirectAuthenticated(to)` | Redireciona usuarios logados (ex: sair de `/login`) |

## Middleware

`middleware.ts` na raiz do projeto:

1. Adiciona headers de seguranca em todas as respostas (`nosniff`, `x-frame-options`, etc.)
2. Rotas protegidas (`/admin`, `/dashboard`, `/editor`, `/projects`, `/templates`, `/preview`, `/uploads`) — redireciona para `/login` se nao autenticado
3. Rotas de auth (`/login`, `/register`) — redireciona para `/dashboard` se ja autenticado
4. Deteccao de sessao via cookies do Better Auth

## Autorizacao

### Ownership

Toda mutacao em projetos/paginas verifica ownership:

- `requireProjectAccess(projectId, ownerId)` — retorna projeto ou 404
- `requirePageAccess(pageId, ownerId)` — verifica via join page→project, retorna {page, project} ou 404

Definidos em `src/features/projects/project-access.ts`.

### Admin

- `requireAdmin()` em `src/lib/authorization.ts` — verifica sessao + role `admin`, retorna `forbidden()` se nao autorizado
- Usado nas rotas de `/admin/blocks`

## Roles

| Role | Acesso |
|------|--------|
| `user` | Dashboard, projetos proprios, editor, publicacao |
| `admin` | Tudo do user + gerenciamento de blocos em `/admin/blocks` |

## Primeiro admin

Apos primeiro deploy, promover manualmente no banco:

```sql
UPDATE "user" SET role = 'admin' WHERE email = 'seu@email.com';
```

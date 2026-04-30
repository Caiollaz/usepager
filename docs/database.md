# Banco de Dados

## Conexao

Driver `pg` (node-postgres) com `Pool`. Configurado em `src/db/index.ts` com `casing: "snake_case"` — o Drizzle converte automaticamente `camelCase` do TypeScript para `snake_case` no banco.

## Enums

| Enum | Valores | Uso |
|------|---------|-----|
| `user_role` | `user`, `admin` | Controle de acesso |
| `project_status` | `published`, `draft` | Estado de publicacao |
| `block_status` | `active`, `review` | Visibilidade no editor |
| `publication_status` | `success`, `failed` | Historico de publicacao |

## Tabelas

### Autenticacao (Better Auth)

- **`user`** — id, name, email (unique), role, emailVerified, image, timestamps
- **`session`** — token de sessao, expiracao, IP, user agent. FK → user (cascade)
- **`account`** — provedor OAuth ou credencial. FK → user (cascade)
- **`verification`** — tokens de verificacao de email
- **`jwks`** — chaves JWT rotacionadas pelo Better Auth

### Aplicacao

- **`projects`** — site do usuario. Tem slug (unique), subdomain (unique), domain, status, meta SEO, settingsJson, faviconAssetId. FK → user (cascade)
- **`pages`** — pagina dentro de um projeto. Tem slug (unique por projeto), html, css, grapesJson (estado do editor). FK → projects (cascade)
- **`blocks`** — blocos reutilizaveis do editor (admin). Tem category, status, usageCount, html, css, schemaJson
- **`assets`** — arquivos enviados por projeto. Tem fileName, mimeType, size, url (unique), storagePath. FK → projects (cascade)
- **`publications`** — historico de publicacoes. Tem status (success/failed), targetPath, errorMessage. FK → projects (cascade)

## IDs

Gerados pela aplicacao com `createId(prefix)` que produz `{prefix}_{uuid}`. Exemplos: `prj_abc123`, `pg_def456`.

## Migrations

Ficam em `src/db/migrations/`. Gerenciadas pelo drizzle-kit:

```bash
npm run db:generate   # gera migration a partir do schema
npm run db:migrate    # aplica migrations pendentes
```

## Queries vs Actions

- **Queries** (leitura) ficam em `src/features/<feature>/queries.ts`
- **Actions** (escrita) ficam em `src/features/<feature>/*-actions.ts`
- `src/db/` contem apenas conexao, schema e migrations

# AGENTS.md

## Project Context

Pro Pages is an internal SaaS for creating, editing, previewing, and publishing static websites. The app uses Next.js 16 App Router, React Server Components by default, Tailwind CSS v4, Better Auth, Drizzle ORM with PostgreSQL, and GrapesJS for the visual editor.

The visual source of truth is `app.pen`. Keep UI changes close to the Pencil design and existing shadcn-like white visual language.

## Global Rules

- Use TypeScript and keep strict typing intact.
- Prefer the smallest correct change.
- New files use kebab-case.
- Database columns use snake_case; TypeScript fields use camelCase.
- Use the `@/` alias for source imports.
- Do not introduce a UI library. Components are native HTML wrappers.
- Do not add gradients or generated images unless explicitly requested.
- Keep Tailwind v4 classes canonical when possible, e.g. `max-w-295` instead of `max-w-[1180px]`.
- Arbitrary text sizes are acceptable when matching Pencil pixel specs, e.g. `text-[13px]`.
- Do not commit `.env`, `storage/`, `.next/`, or generated local artifacts.
- Do not weaken auth, ownership checks, path traversal checks, or upload validation.

## Architecture

- `src/app` contains routes, Server Components, and Route Handlers.
- `src/components` contains atomic design UI building blocks.
- `src/features` contains business logic, Server Actions, and feature-specific helpers.
- `src/db` contains Drizzle schema, DB client, and read queries.
- `src/lib` contains cross-cutting utilities such as auth, session, authorization, slugs, IDs, and class merging.
- `drizzle` contains migrations and generated migration metadata.
- `docs` contains operational documentation.

## Backend Pattern

- Use Server Actions for internal form-driven mutations.
- Use Route Handlers for HTTP endpoints, auth handlers, binary/file serving, previews, and public/static serving.
- Validate all external input at boundaries with Zod or explicit guards.
- Every project/page mutation must verify ownership with `requireProjectAccess` or `requirePageAccess`.
- Admin-only actions must use `requireAdmin`.
- Revalidate affected pages with `revalidatePath` after successful mutations.
- Avoid raw SQL unless Drizzle cannot express the query safely.

## Security Rules

- Authenticated internal routes must remain protected by both middleware and server-side guards.
- Never trust route params, form fields, filenames, slugs, domains, or uploaded file metadata.
- Use `assertSafeSlug`, `assertSafeSubdomain`, and path containment checks for filesystem paths.
- Uploads must enforce MIME/extension allowlists and `MAX_ASSET_SIZE_BYTES`.
- File responses should set `x-content-type-options: nosniff`.
- Do not expose stack traces or secret values to users.

## UI Rules

- Components should extend native element props with `ComponentPropsWithoutRef`.
- Components must accept and merge `className` using `cn`.
- The `Button` `asChild` prop is a flat optional boolean, not a discriminated union.
- Preserve existing responsive behavior unless the task explicitly changes layout.
- Prefer Server Components. Use Client Components only for browser-only state/effects or third-party browser libraries.

## Commands

- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Build: `npm run build`
- Generate DB migration: `npm run db:generate`
- Apply DB migrations: `npm run db:migrate`
- Run dev dependencies: `docker compose up -d`

After code changes, run at least `npm run typecheck` and `npm run lint`. For backend, routing, or config changes, also run `npm run build`.

## Environment

Required environment variables are documented in `.env.example`. Do not hardcode secrets or deployment paths. Defaults for local storage are acceptable only where already established by the project.

## Publishing Model

- Static publishing is synchronous for now.
- Published sites are generated under `STATIC_SITES_DIR/{subdomain}`.
- Editor assets are stored under `STORAGE_DIR/assets/{projectId}` and copied into the published site.
- Development serving is available through `/sites/{subdomain}`; production should serve `STATIC_SITES_DIR` directly through Nginx/Caddy.

# AGENTS.md

## Scope

This folder uses the Next.js App Router. It contains route segments, Server Components, Client Components only when necessary, and Route Handlers.

## Routing Rules

- `page.tsx` should be a Server Component by default.
- `route.ts` is for HTTP endpoints, auth handlers, preview/static serving, and binary responses.
- Keep route files thin. Move business logic into `src/features` or shared logic into `src/lib`.
- Use typed `params: Promise<...>` consistently with Next.js 16 route signatures used in this project.

## Auth and Access

- Internal pages must call `requireSession()` or a stricter guard.
- Project pages must call `requireProjectAccess()` or `requirePageAccess()` after session resolution.
- Admin pages must call `requireAdmin()`.
- Do not rely on middleware alone for access control. Middleware is an early redirect, not the final permission check.

## Route Handlers

- Validate params before filesystem or DB use.
- Use `notFound()` for missing or inaccessible resources when avoiding resource enumeration.
- Set explicit content types.
- Set `x-content-type-options: nosniff` on file/HTML responses.
- Use streaming for files instead of loading large files into memory.

## UI Pages

- Keep page components focused on composition and data loading.
- Forms should call Server Actions from `src/features`.
- Reuse `AppShell`, `SectionHeading`, and existing atomic/molecule components.

## Caching

- Preview responses should be `no-store`.
- Published static assets can be cached long-term.
- HTML for published sites should use short cache headers unless deploy invalidation is added.

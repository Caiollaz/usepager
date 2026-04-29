# AGENTS.md

## Scope

This folder contains feature-specific backend logic, Server Actions, editor integration, and publishing helpers.

## Feature Slices

- `assets/`: upload validation, storage, serving security, asset actions.
- `blocks/`: admin-managed editor block library.
- `editor/`: GrapesJS client integration.
- `pages/`: page content and SEO actions.
- `projects/`: project CRUD and access guards.
- `publishing/`: static site build, unpublish, and serving helpers.

## Server Actions

- Server Action files must start with `"use server"`.
- Validate inputs at the action boundary with Zod or explicit checks.
- Use `requireSession()` for authenticated actions.
- Use `requireAdmin()` for admin-only actions.
- Use `requireProjectAccess()` or `requirePageAccess()` for project/page ownership.
- Perform related DB changes in transactions.
- Call `revalidatePath()` for affected pages after successful mutations.
- Throw generic user-safe errors; avoid leaking internal paths or stack traces.

## Filesystem Rules

- Resolve base directories from env vars with safe defaults only where already established.
- Check that computed paths stay inside the intended base directory.
- Do not trust uploaded filenames or asset URLs.
- Use streaming for serving files.
- Use atomic writes/renames for published site generation.

## Publishing Rules

- Static publishing writes to `STATIC_SITES_DIR/{subdomain}`.
- Use `assertSafeSubdomain` and safe segment checks for all published paths.
- Published HTML may contain user-provided page HTML/CSS by product design; only escape metadata inserted into the document head.
- Keep unpublish/delete behavior aligned with filesystem cleanup.

## Client Components

- Use Client Components only for browser-specific libraries or interaction.
- `GrapesEditor` is browser-only; do not move GrapesJS initialization into Server Components.

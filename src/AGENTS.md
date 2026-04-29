# AGENTS.md

## Scope

This folder contains the application source code. Follow the root `AGENTS.md` first, then the more specific file in each subdirectory.

## Directory Responsibilities

- `app/`: routes, pages, layouts, Route Handlers, and App Router integration.
- `components/`: reusable UI components organized by atomic design.
- `db/`: Drizzle schema, DB client, and read queries.
- `features/`: feature slices, Server Actions, and business logic.
- `lib/`: shared utilities and cross-cutting concerns.

## Import Rules

- Use `@/` absolute imports.
- Do not import from `src/app` into `features`, `db`, `components`, or `lib`.
- Keep `db` independent of UI and routing.
- Keep `lib` broadly reusable and avoid feature-specific business logic there.
- Components may import from `lib` and other components, but should avoid importing Server Actions directly unless they are route-level forms.

## Naming

- File names use kebab-case.
- React components use PascalCase.
- Server Actions use `*Action` suffix.
- Route params in folders follow Next conventions, e.g. `[project-id]`; map them to typed objects in code.

## Validation

- Validate form data, route params, and user-controlled inputs before DB or filesystem operations.
- Prefer shared validators/utilities over repeated regexes.

## Performance

- Fetch independent data with `Promise.all`.
- Keep DB selects narrow where practical.
- Add indexes in `schema.ts` when adding new frequent filters or joins.

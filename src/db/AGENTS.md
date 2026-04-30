# AGENTS.md

## Scope

This folder owns database connection, schema, and migrations.

## Files

- `index.ts`: Drizzle/node-postgres client setup with `casing: "snake_case"`.
- `schema.ts`: source of truth for tables, columns, enums, relations, indexes.
- `migrations/`: generated migration files managed by drizzle-kit.

## Schema Rules

- Database columns use snake_case (handled automatically by the `casing` option).
- TypeScript properties use camelCase.
- Use Drizzle enums for constrained state such as statuses and roles.
- Add indexes when adding frequent filters, joins, or ordering patterns.
- Foreign keys should specify delete behavior intentionally.
- Use `createId()` for application-generated primary keys.

## Query Rules

- Read queries belong in `src/features/<feature>/queries.ts`, not in this folder.
- Mutations belong in Server Actions under `src/features`.
- Prefer Drizzle operators such as `eq`, `and`, `desc`, `count` over raw SQL.
- Keep selects narrow when returning data to UI.
- Owner-scoped reads must include the owner check unless already enforced by the caller and documented in the function name/signature.

## Migrations

- Update `schema.ts` first, then generate migrations with `npm run db:generate`.
- Do not manually edit generated snapshots unless repairing a known migration metadata issue.
- Apply migrations with `npm run db:migrate` and verify with typecheck/build.

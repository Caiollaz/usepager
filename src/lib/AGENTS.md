# AGENTS.md

## Scope

This folder contains shared utilities and cross-cutting concerns.

## Responsibilities

- `auth.ts`: Better Auth server configuration.
- `auth-client.ts`: Better Auth browser client.
- `session.ts`: session retrieval and auth redirects.
- `authorization.ts`: role-based guards.
- `slug.ts`: safe slug/subdomain helpers.
- `id.ts`: application ID generation.
- `navigation.ts`: app navigation metadata.
- `cn.ts`: Tailwind class merging.

## Rules

- Keep utilities small and dependency-light.
- Avoid feature-specific business logic here.
- Do not import React components into `lib`.
- Do not mutate DB state from generic utilities unless the file is explicitly an auth/authorization concern.
- Keep auth helpers fail-closed: missing or invalid sessions must deny access.

## Security Helpers

- Reuse `assertSafeSlug` and `assertSafeSubdomain` instead of duplicating regexes.
- If adding new trust-boundary helpers, make error behavior explicit and safe.
- Do not add helpers that silently sanitize security-critical values when rejection is safer.

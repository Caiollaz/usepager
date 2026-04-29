# AGENTS.md

## Scope

This folder contains operational documentation for developers and deployments.

## Rules

- Keep docs concise and executable.
- Prefer real commands and concrete paths over abstract descriptions.
- Update docs when environment variables, deployment paths, Nginx/Caddy behavior, or public routes change.
- Do not document secrets or real credentials.
- Keep examples aligned with `.env.example` and `README.md`.

## Current Docs

- `nginx.md`: wildcard subdomain serving example for published static sites.

## Style

- Use Markdown.
- Use ASCII unless the existing document already uses non-ASCII for a clear reason.
- Include verification steps for operational procedures.

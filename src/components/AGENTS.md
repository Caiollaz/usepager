# AGENTS.md

## Scope

This folder contains reusable UI components following atomic design.

## Structure

- `atoms/`: primitive HTML wrappers such as `Button`, `Input`, `Card`, `Badge`, `Icon`.
- `molecules/`: small composed UI pieces such as fields, cards, nav items, section headings.
- `organisms/`: larger interface regions such as shells, panels, and auth/editor sections.

## Component Rules

- Components should extend native props with `ComponentPropsWithoutRef<"tag">`.
- Always accept `className` when the underlying element has styling.
- Merge classes with `cn()`.
- Keep components presentational unless there is a strong reason for local state.
- Avoid importing Server Actions in reusable components.
- Do not introduce UI libraries.

## Styling

- Use Tailwind v4 classes and design tokens from `globals.css`.
- Preserve the established white/shadcn visual language.
- Prefer canonical Tailwind spacing/sizing classes.
- Only use arbitrary values when they are needed for Pencil parity or unsupported values.

## Button

- `Button` supports native button props plus variants.
- `asChild?: boolean` is intentionally flat. Do not convert it back to a discriminated union.
- When using `asChild`, pass a single valid React element as child.

## Accessibility

- Interactive icons need accessible text or `aria-label`.
- Preserve native semantics where possible.
- Do not replace buttons with clickable divs.

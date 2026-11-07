---
name: foundations
description: Setup, conventions, layout shell and design tokens for daisyUI 5 dashboards.
---

# Foundations

## 1. Setup

### CDN (prototype / single HTML file)

```html
<!doctype html>
<html lang="fr" data-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dashboard</title>
  <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
</head>
<body class="bg-base-200 text-base-content min-h-screen">
  …
</body>
</html>
```

### Project (Vite / Next / etc.)

```bash
npm i -D tailwindcss @tailwindcss/vite daisyui@latest
```

```css
/* app.css */
@import "tailwindcss";
@plugin "daisyui";
```

There is **no `tailwind.config.js`** in Tailwind 4 / daisyUI 5: config lives in CSS (`@plugin`, `@theme`).

## 2. daisyUI 5 conventions (v4 → v5 pitfalls)

| Don't (v4) | Do (v5) |
|---|---|
| `form-control`, `label-text` | `fieldset`, `fieldset-legend`, `label` |
| `input-bordered`, `select-bordered` | inputs are bordered by default; use `input-ghost` to remove |
| custom tinted variants | `btn-soft` / `badge-soft` / `alert-soft` |
| `tabs-boxed` | `tabs-box` (also `tabs-border`, `tabs-lift`) |
| `active` on menu items | `menu-active` |
| `bg-opacity-*` | Tailwind 4 opacity syntax: `bg-primary/10` |
| `tailwind.config.js` plugins | `@plugin "daisyui"` in CSS |

General rules:

- Component class first, then modifiers (color → size → style): `btn btn-primary btn-sm btn-soft`.
- Sizes: `xs sm md lg xl` suffixes. Dashboards default to **`btn-sm`/`input-sm`/`table-sm`** for density; keep `md` for form-centric pages and auth.
- Use `join` to group related controls (pagination, segmented filters, input + button).
- Use `modal` via native `<dialog>`, `dropdown` via `<details>` or `popover` for accessibility.
- Use `status` for tiny coloured dots, `badge` for labels, `kbd` for keyboard hints, `tooltip` for short hints (never for essential info).
- Use `skeleton` for loading placeholders, `loading` for spinners inside buttons.

## 3. Semantic colors (tokens)

| Token | Usage |
|---|---|
| `base-100` | Cards, panels, inputs (main surface) |
| `base-200` | Page background, subtle surfaces, table header |
| `base-300` | Borders, dividers, skeleton |
| `base-content` | Default text (use `/60` or `/70` opacity for secondary text) |
| `primary` | The ONE main action per view, active nav, key data series |
| `secondary` / `accent` | Occasional accents, secondary data series |
| `neutral` | Dark chrome (sidebar, tooltips) |
| `info` / `success` / `warning` / `error` | Status only (never decoration) |

Rules: at most **one primary button per view**; status colors always paired with text or icon (never colour alone); text on coloured surfaces uses the matching `*-content` token.

## 4. Layout shell

Fixed sidebar on desktop (`lg:drawer-open`), drawer on mobile, sticky navbar.

```html
<div class="drawer lg:drawer-open">
  <input id="app-drawer" type="checkbox" class="drawer-toggle" />

  <div class="drawer-content flex flex-col">
    <header class="navbar bg-base-100 border-b border-base-300 sticky top-0 z-10">
      <div class="flex-none lg:hidden">
        <label for="app-drawer" class="btn btn-square btn-ghost" aria-label="Ouvrir le menu">
          <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </label>
      </div>
      <h1 class="flex-1 px-2 font-semibold">Titre de la page</h1>
      <div class="flex-none gap-2"><!-- search, notifications, user dropdown --></div>
    </header>

    <main class="p-4 lg:p-6 space-y-6 max-w-screen-2xl w-full mx-auto">
      …
    </main>
  </div>

  <div class="drawer-side z-20">
    <label for="app-drawer" class="drawer-overlay" aria-label="Fermer le menu"></label>
    <aside class="bg-base-100 border-r border-base-300 min-h-full w-64">
      <!-- logo + menu (see block-patterns/navigation.md) -->
    </aside>
  </div>
</div>
```

## 5. Spacing, density and typography

- Page padding `p-4 lg:p-6`; vertical rhythm between sections `space-y-6`; grid gaps `gap-4`.
- KPI grid: `grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`; chart + side panel: `lg:grid-cols-3` with `lg:col-span-2`.
- Type scale: page title `text-2xl font-semibold`, section title `text-lg font-semibold`, card title `font-medium`, body `text-sm`, meta `text-xs text-base-content/60`.
- Numbers: `tabular-nums`, right-aligned in tables.
- Prose max width: `max-w-prose`.

## 6. Icons and assets

One icon set only (Lucide, Heroicons or Tabler), inline SVG `size-4`/`size-5`, `aria-hidden="true"` when decorative. Avatars: daisyUI `avatar` (+ `avatar-placeholder` for initials).

See `theme.md` for theme selection and custom themes.

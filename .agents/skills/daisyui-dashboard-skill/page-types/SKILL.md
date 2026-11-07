---
name: page-types
description: Page templates for dashboards built with daisyUI - overview dashboard, auth, settings, and reading views (list, detail). Choose the page type then assemble it from block-patterns.
---

# Page types

| Page type | File | Use for |
|---|---|---|
| Dashboard (overview) | `dashboard.md` | Landing page: KPIs, trends, attention items |
| Reading views | `reading-views.md` | List/index pages, detail pages, reports, activity feeds |
| Settings | `settings.md` | Profile, account, team, billing, preferences |
| Auth | `auth.md` | Login, sign-up, forgot/reset password, 2FA |

## How to use

1. Identify the page type (ask only if ambiguous).
2. Read the matching file for **purpose, layout skeleton, required blocks, states and acceptance criteria**.
3. Build the shell from `foundations/SKILL.md` (auth pages have no shell).
4. Compose blocks from `block-patterns/`, write copy with `content-strategy/`.
5. Run `audit/checklist.md`.

## Common page anatomy (all app pages)

```html
<main class="p-4 lg:p-6 space-y-6 max-w-screen-2xl w-full mx-auto">
  <header class="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h1 class="text-2xl font-semibold">Titre</h1>
      <p class="text-sm text-base-content/70">Description courte ou période</p>
    </div>
    <div class="flex items-center gap-2"><!-- filters, secondary actions, ONE primary action --></div>
  </header>

  <!-- alerts (optional) -->
  <!-- page content: blocks -->
</main>
```

Rules: exactly one `h1`; primary action top-right; filters that affect the whole page live in the header; page content follows the hierarchy in `content-strategy/`.

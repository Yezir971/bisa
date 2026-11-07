---
name: block-patterns
description: Reusable daisyUI 5 UI blocks for dashboards (navigation, metrics, charts, tables, forms) and how to compose them.
---

# Block patterns

A **block** is a self-contained, reusable section of UI with a clear job, built from daisyUI components. Pages (see `page-types/`) are assembled from blocks.

| File | Blocks inside |
|---|---|
| `navigation.md` | Sidebar menu, navbar, user menu, breadcrumbs, tabs, pagination |
| `metrics.md` | KPI row (`stats`), delta indicators, progress/target, sparkline cards |
| `charts.md` | Chart card wrapper, chart choice guide, theming, states |
| `tables.md` | Data table, toolbar/filters, row actions, bulk actions, pagination, mobile |
| `forms.md` | Fieldsets, inputs, validation, filters form, settings form, modal form |

## Rules for every block

1. **Single responsibility** and a short `h2`/`h3` title (what + period/scope).
2. **Wrapper**: `card bg-base-100 border border-base-300` + `card-body p-4` (dense) unless the block is a `stats` element.
3. Implement the **4 states**: loading (`skeleton`), empty, error, loaded.
4. **No hardcoded colours**; semantic daisyUI tokens only.
5. Accessible by default: headings, labels, `aria-*`, keyboard.
6. Blocks do not set their own outer margins; the page grid (`gap-4`, `space-y-6`) spaces them.

## Shared snippets

### Card wrapper with header and actions

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="revenue-title">
  <div class="card-body p-4 gap-4">
    <header class="flex items-start justify-between gap-2">
      <div>
        <h2 id="revenue-title" class="card-title text-base">Chiffre d'affaires</h2>
        <p class="text-xs text-base-content/60">30 derniers jours</p>
      </div>
      <div class="join">
        <button class="btn btn-xs join-item btn-active">30 j</button>
        <button class="btn btn-xs join-item">90 j</button>
        <button class="btn btn-xs join-item">12 m</button>
      </div>
    </header>
    <!-- block content -->
  </div>
</section>
```

### Loading / empty / error

```html
<!-- Loading -->
<div class="flex flex-col gap-2" aria-busy="true">
  <div class="skeleton h-4 w-1/3"></div>
  <div class="skeleton h-32 w-full"></div>
</div>

<!-- Empty -->
<div class="flex flex-col items-center gap-2 py-10 text-center">
  <svg class="size-8 text-base-content/40" aria-hidden="true">…</svg>
  <p class="font-medium">Aucune commande sur cette période</p>
  <p class="text-sm text-base-content/60">Modifiez la période ou créez votre première commande.</p>
  <button class="btn btn-primary btn-sm">Créer une commande</button>
</div>

<!-- Error -->
<div role="alert" class="alert alert-error alert-soft">
  <svg class="size-5" aria-hidden="true">…</svg>
  <span>Impossible de charger les données.</span>
  <button class="btn btn-sm">Réessayer</button>
</div>
```

### Status badge convention

| Meaning | Markup |
|---|---|
| Success / active / paid | `badge badge-success badge-soft` |
| Pending / in progress | `badge badge-warning badge-soft` |
| Failed / blocked / overdue | `badge badge-error badge-soft` |
| Info / new | `badge badge-info badge-soft` |
| Neutral / draft / archived | `badge badge-ghost` |

Always include the status word (never a dot only), optionally prefixed by `<span class="status status-success"></span>`.

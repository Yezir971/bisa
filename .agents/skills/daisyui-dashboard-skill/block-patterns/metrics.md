# Metrics blocks (KPIs)

## KPI row with `stats`

```html
<section aria-label="Indicateurs clés" class="stats stats-vertical sm:stats-horizontal bg-base-100 border border-base-300 w-full overflow-x-auto">
  <div class="stat">
    <div class="stat-figure text-primary"><svg class="size-6" aria-hidden="true">…</svg></div>
    <div class="stat-title">Chiffre d'affaires</div>
    <div class="stat-value text-primary tabular-nums">48 250 €</div>
    <div class="stat-desc"><span class="text-success">↗︎ +12,4 %</span> vs 30 jours précédents</div>
  </div>

  <div class="stat">
    <div class="stat-title">Commandes</div>
    <div class="stat-value tabular-nums">1 284</div>
    <div class="stat-desc"><span class="text-error">↘︎ −3,1 %</span> vs 30 jours précédents</div>
  </div>

  <div class="stat">
    <div class="stat-title">Panier moyen</div>
    <div class="stat-value tabular-nums">37,60 €</div>
    <div class="stat-desc">Stable</div>
  </div>

  <div class="stat">
    <div class="stat-title">Taux de conversion</div>
    <div class="stat-value tabular-nums">3,2 %</div>
    <div class="stat-desc">Objectif : 4 %</div>
  </div>
</section>
```

Alternative with separate cards (when each KPI is clickable or needs a sparkline):

```html
<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  <a href="/orders" class="card bg-base-100 border border-base-300 hover:border-primary transition-colors">
    <div class="card-body p-4 gap-1">
      <p class="text-sm text-base-content/70">Commandes</p>
      <p class="text-3xl font-semibold tabular-nums">1 284</p>
      <p class="text-xs"><span class="badge badge-success badge-soft badge-sm">+12 %</span> <span class="text-base-content/60">vs mois dernier</span></p>
    </div>
  </a>
</div>
```

## Rules

- 4–6 KPIs, ordered by importance (most important top-left).
- Anatomy: **label** (what) → **value** (big, `tabular-nums`) → **context** (delta, period, target).
- Delta: arrow/sign + percentage + comparison basis. Positive isn't always green (e.g. churn up = `text-error`): colour = good/bad, arrow = direction.
- Format: thousand separators, locale decimals, compact for large values (`1,2 M`), units attached (`€`, `%`, `ms`).
- Don't show a KPI the user can't act on.
- Loading: replace `stat-value` with `<div class="skeleton h-8 w-24"></div>`.
- Empty/no data: show `—` and a short reason in `stat-desc`, never `0` when data is missing.

## Progress toward a target

```html
<div>
  <div class="flex justify-between text-sm"><span>Objectif trimestriel</span><span class="tabular-nums">72 %</span></div>
  <progress class="progress progress-primary w-full" value="72" max="100" aria-label="Objectif trimestriel"></progress>
</div>
```

Circular: `<div class="radial-progress text-primary" style="--value:72;" role="progressbar" aria-valuenow="72">72%</div>`.
Use `progress-warning` / `progress-error` only with meaning (at risk / off-track), and add text.

## Status summary strip

```html
<div class="flex flex-wrap gap-2">
  <span class="badge badge-success badge-soft gap-1"><span class="status status-success"></span>Opérationnel 18</span>
  <span class="badge badge-warning badge-soft gap-1"><span class="status status-warning"></span>Dégradé 2</span>
  <span class="badge badge-error badge-soft gap-1"><span class="status status-error"></span>Hors service 1</span>
</div>
```

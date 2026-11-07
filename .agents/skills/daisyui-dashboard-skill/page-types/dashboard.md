# Page type: Dashboard (overview)

**Purpose**: let the user understand the state of the business in 5 seconds and jump to what needs attention.

## Skeleton

```
[Header: title · period selector · export/primary action]
[Attention strip: alerts needing action (optional)]
[KPI row: 4–6 stats]
[Row: main chart (2/3)  |  breakdown or top-N list (1/3)]
[Row: data table (recent items) (2/3)  |  activity feed (1/3)]
```

```html
<main class="p-4 lg:p-6 space-y-6 max-w-screen-2xl w-full mx-auto">
  <header class="flex flex-wrap items-center justify-between gap-3">
    <div><h1 class="text-2xl font-semibold">Tableau de bord</h1>
         <p class="text-sm text-base-content/70">Vue d'ensemble · 1–30 septembre 2026</p></div>
    <div class="flex gap-2">
      <select class="select select-sm w-auto" aria-label="Période"><option>30 derniers jours</option></select>
      <button class="btn btn-sm btn-primary">Exporter</button>
    </div>
  </header>

  <div role="alert" class="alert alert-warning alert-soft">
    <span>3 paiements échoués nécessitent votre attention.</span>
    <a class="btn btn-sm" href="#">Voir les paiements</a>
  </div>

  <!-- KPI row: block-patterns/metrics.md -->

  <div class="grid gap-4 lg:grid-cols-3">
    <div class="lg:col-span-2"><!-- chart card --></div>
    <div><!-- donut / top 5 list --></div>
  </div>

  <div class="grid gap-4 lg:grid-cols-3">
    <div class="lg:col-span-2"><!-- recent orders table, 5–8 rows + "Voir tout" --></div>
    <div><!-- activity feed (list) --></div>
  </div>
</main>
```

## Required blocks
KPI row, ≥ 1 trend chart, ≥ 1 actionable list/table with a "Voir tout" link.

## Guidelines
- Everything answers "how are we doing?" and links to detail pages; no editing on the dashboard.
- Global period selector controls all blocks; show the period in the header.
- Tables truncated to 5–8 rows with link to the full list.
- Activity feed: `list` with avatar, sentence, relative time. Max 8 entries.
- Max ~6 blocks above the fold on desktop. Resist adding more.
- Real-time? Show "Mis à jour il y a X min" and a refresh button.

## States
First use (no data): replace blocks with one onboarding card: what to do first (3 steps with `steps` component) and a primary action. Partial failure: only the failing block shows its error alert.

## Acceptance criteria
- [ ] 5-second test: key message obvious.
- [ ] Single primary action; period visible.
- [ ] All blocks have loading/empty/error states.
- [ ] Works at 375 px (KPIs stack, charts full width) and in dark theme.

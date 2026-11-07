# Radial chart 12 — Goal tracker list

> **Looks like**: A list where each row has a mini ring, a goal name and its status.

**Use when**: Personal or team goals with progress.
**Data shape**: Array of `{name, value, color}`.
**Requires**: daisyUI only (the `radial-progress` component, no JS)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radialChart12-title">
  <div class="card-body p-4 gap-1">
    <h2 id="radialChart12-title" class="card-title text-base">Objectifs du trimestre</h2>
    <ul class="list">
      <li class="list-row items-center">
        <div class="radial-progress text-primary" style="--value:80; --size:2.5rem; --thickness:4px;" role="progressbar" aria-valuenow="80" aria-label="80 %"><span class="text-[10px]">80</span></div>
        <div class="list-col-grow"><div class="font-medium">Nouveaux clients</div><div class="text-xs text-base-content/60">80 sur 100</div></div>
        <span class="badge badge-success badge-soft badge-sm">Sur la bonne voie</span>
      </li>
      <li class="list-row items-center">
        <div class="radial-progress text-warning" style="--value:45; --size:2.5rem; --thickness:4px;" role="progressbar" aria-valuenow="45" aria-label="45 %"><span class="text-[10px]">45</span></div>
        <div class="list-col-grow"><div class="font-medium">Chiffre d'affaires</div><div class="text-xs text-base-content/60">135 k€ sur 300 k€</div></div>
        <span class="badge badge-warning badge-soft badge-sm">À surveiller</span>
      </li>
      <li class="list-row items-center">
        <div class="radial-progress text-error" style="--value:20; --size:2.5rem; --thickness:4px;" role="progressbar" aria-valuenow="20" aria-label="20 %"><span class="text-[10px]">20</span></div>
        <div class="list-col-grow"><div class="font-medium">Réduction du churn</div><div class="text-xs text-base-content/60">1 point sur 5</div></div>
        <span class="badge badge-error badge-soft badge-sm">En retard</span>
      </li>
    </ul>
  </div>
</section>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

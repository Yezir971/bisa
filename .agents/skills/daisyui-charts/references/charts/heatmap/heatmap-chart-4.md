# Heatmap chart 4 — Cohort retention table

> **Looks like**: A table where each cell is shaded according to the retention percentage.

**Use when**: Retention or conversion by cohort and elapsed period.
**Data shape**: Rows = cohorts, columns = periods (M0…M5), values in %.
**Requires**: daisyUI + plain JS (no chart library). Colours use `color-mix` on theme variables, so it follows every theme.

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="heatmapChart4-title">
  <div class="card-body p-4 gap-3">
    <header><h2 id="heatmapChart4-title" class="card-title text-base">Rétention par cohorte</h2><p class="text-xs text-base-content/60">% d'utilisateurs actifs</p></header>
    <div class="overflow-x-auto"><table class="table table-sm text-center" id="heatmapChart4"></table></div>
  </div>
</section>

<script>
(() => {
const cohorts = [
  ['Mai', 1240, [100, 62, 48, 41, 37, 35]], ['Juin', 1310, [100, 65, 51, 44, 40]], ['Juil', 1405, [100, 68, 54, 47]],
  ['Août', 1180, [100, 61, 49]], ['Sep', 1520, [100, 70]], ['Oct', 1610, [100]],
];
const shade = (v) => `background: color-mix(in oklab, var(--color-primary) ${Math.round(v * 0.85)}%, var(--color-base-100))`;
document.getElementById('heatmapChart4').innerHTML =
  '<thead><tr><th class="text-left">Cohorte</th><th>Taille</th>' + ['M0', 'M1', 'M2', 'M3', 'M4', 'M5'].map((m) => `<th>${m}</th>`).join('') + '</tr></thead><tbody>' +
  cohorts.map(([n, size, vals]) => `<tr><th class="text-left">${n}</th><td class="tabular-nums">${size}</td>` +
    Array.from({ length: 6 }, (_, i) => vals[i] == null ? '<td></td>' : `<td class="tabular-nums" style="${shade(vals[i])}">${vals[i]} %</td>`).join('') + '</tr>').join('') + '</tbody>';
})();
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

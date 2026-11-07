# Heatmap chart 1 — Calendar heatmap

> **Looks like**: GitHub-style grid of 52 weeks × 7 days with 5 intensity levels.

**Use when**: Daily activity over a year (commits, orders, logins).
**Data shape**: One value per day (371 cells); here generated randomly.
**Requires**: daisyUI + plain JS (no chart library). Colours use `color-mix` on theme variables, so it follows every theme.

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="heatmapChart1-title">
  <div class="card-body p-4 gap-3">
    <header><h2 id="heatmapChart1-title" class="card-title text-base">Activité quotidienne</h2><p class="text-xs text-base-content/60">52 dernières semaines</p></header>
    <div class="overflow-x-auto"><div id="heatmapChart1" class="grid grid-flow-col grid-rows-7 gap-[3px] w-max" role="img" aria-label="Calendrier d'activité sur 52 semaines"></div></div>
    <div class="flex items-center gap-2 text-xs text-base-content/60">Moins
      <span class="size-3 rounded-sm" style="background: var(--color-base-200)"></span>
      <span class="size-3 rounded-sm" style="background: color-mix(in oklab, var(--color-primary) 30%, var(--color-base-200))"></span>
      <span class="size-3 rounded-sm" style="background: color-mix(in oklab, var(--color-primary) 55%, var(--color-base-200))"></span>
      <span class="size-3 rounded-sm" style="background: color-mix(in oklab, var(--color-primary) 75%, var(--color-base-200))"></span>
      <span class="size-3 rounded-sm bg-primary"></span> Plus
    </div>
  </div>
</section>

<script>
(() => {
const rnd = (i) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
const shade = (t) => `background: color-mix(in oklab, var(--color-primary) ${Math.round(8 + 82 * t)}%, var(--color-base-200))`;
const el = document.getElementById('heatmapChart1');
el.innerHTML = Array.from({ length: 371 }, (_, i) => {
  const v = Math.round(rnd(i) * 12); const d = new Date(Date.now() - (370 - i) * 864e5).toLocaleDateString('fr-FR');
  return `<span class="size-3 rounded-sm" style="${v < 2 ? 'background: var(--color-base-200)' : shade(v / 12)}" title="${d} : ${v} contributions"></span>`;
}).join('');
})();
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

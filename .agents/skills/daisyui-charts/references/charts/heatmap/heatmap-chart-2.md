# Heatmap chart 2 — Weekday × hour matrix

> **Looks like**: Grid of 7 weekdays by 24 hours with labelled axes.

**Use when**: Finding peak times (traffic, support load, orders).
**Data shape**: Matrix `[7][24]` of numbers.
**Requires**: daisyUI + plain JS (no chart library). Colours use `color-mix` on theme variables, so it follows every theme.

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="heatmapChart2-title">
  <div class="card-body p-4 gap-3">
    <header><h2 id="heatmapChart2-title" class="card-title text-base">Trafic par jour et heure</h2><p class="text-xs text-base-content/60">Sessions moyennes · 30 jours</p></header>
    <div class="overflow-x-auto"><div id="heatmapChart2" class="grid gap-[3px] text-xs min-w-[36rem]" style="grid-template-columns: 2.5rem repeat(24, 1fr)" role="img" aria-label="Matrice du trafic par jour et par heure"></div></div>
  </div>
</section>

<script>
(() => {
const rnd = (i) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
const shade = (t) => `background: color-mix(in oklab, var(--color-primary) ${Math.round(8 + 82 * t)}%, var(--color-base-200))`;
const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const el = document.getElementById('heatmapChart2');
let html = '<span></span>' + Array.from({ length: 24 }, (_, h) => `<span class="text-center text-base-content/60">${h % 3 === 0 ? h : ''}</span>`).join('');
days.forEach((d, r) => {
  html += `<span class="text-base-content/60 self-center">${d}</span>`;
  for (let h = 0; h < 24; h++) {
    const work = h >= 8 && h <= 19 && r < 5 ? 0.5 : 0.1;
    const v = Math.min(1, work + rnd(r * 24 + h) * 0.5);
    html += `<span class="h-5 rounded-sm" style="${shade(v)}" title="${d} ${h}h : ${Math.round(v * 100)} sessions"></span>`;
  }
});
el.innerHTML = html;
})();
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

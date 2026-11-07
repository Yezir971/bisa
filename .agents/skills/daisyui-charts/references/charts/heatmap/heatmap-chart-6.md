# Heatmap chart 6 — Uptime status strip

> **Looks like**: 90 slim bars, one per day, green / orange / red, with tooltips.

**Use when**: Service availability history (status pages).
**Data shape**: Array of 90 `{date, status}` with status ok / degraded / down.
**Requires**: daisyUI + plain JS (no chart library). Colours use `color-mix` on theme variables, so it follows every theme.

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="heatmapChart6-title">
  <div class="card-body p-4 gap-3">
    <header class="flex items-center justify-between"><h2 id="heatmapChart6-title" class="card-title text-base">API publique</h2><span class="badge badge-success badge-soft">99,94 % de disponibilité</span></header>
    <div id="heatmapChart6" class="flex gap-[2px]" role="img" aria-label="Historique de disponibilité sur 90 jours : 87 jours normaux, 2 dégradés, 1 incident"></div>
    <div class="flex justify-between text-xs text-base-content/60"><span>Il y a 90 jours</span><span>Aujourd'hui</span></div>
  </div>
</section>

<script>
(() => {
const status = (i) => i === 41 ? 'error' : (i === 17 || i === 66) ? 'warning' : 'success';
const label = { success: 'Opérationnel', warning: 'Dégradé', error: 'Incident' };
document.getElementById('heatmapChart6').innerHTML = Array.from({ length: 90 }, (_, i) => {
  const s = status(i); const d = new Date(Date.now() - (89 - i) * 864e5).toLocaleDateString('fr-FR');
  return `<div class="tooltip flex-1" data-tip="${d} · ${label[s]}"><div class="h-8 rounded-sm bg-${s}"></div></div>`;
}).join('');
})();
</script>
```

## Customise

- Tailwind needs to see `bg-success`, `bg-warning`, `bg-error` literally: keep a safelist comment or static classes if you build with a compiler.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

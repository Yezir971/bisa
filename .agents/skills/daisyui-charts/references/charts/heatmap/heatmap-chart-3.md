# Heatmap chart 3 — Correlation matrix

> **Looks like**: Square matrix with green for positive and red for negative correlations, values in cells.

**Use when**: Showing relationships between metrics (−1 to +1).
**Data shape**: Square matrix of numbers in [-1, 1].
**Requires**: daisyUI + plain JS (no chart library). Colours use `color-mix` on theme variables, so it follows every theme.

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="heatmapChart3-title">
  <div class="card-body p-4 gap-3">
    <header><h2 id="heatmapChart3-title" class="card-title text-base">Corrélation entre métriques</h2><p class="text-xs text-base-content/60">Coefficient de Pearson</p></header>
    <div class="overflow-x-auto"><div id="heatmapChart3" class="grid gap-[3px] text-xs min-w-[28rem]" style="grid-template-columns: 5rem repeat(5, 1fr)" role="table" aria-label="Matrice de corrélation"></div></div>
  </div>
</section>

<script>
(() => {
const labels = ['Visites', 'Inscr.', 'Achats', 'Panier', 'Churn'];
const m = [[1, .72, .55, .31, -.42], [.72, 1, .64, .28, -.51], [.55, .64, 1, .58, -.67], [.31, .28, .58, 1, -.22], [-.42, -.51, -.67, -.22, 1]];
const bg = (v) => `background: color-mix(in oklab, var(--color-${v >= 0 ? 'success' : 'error'}) ${Math.round(Math.abs(v) * 70)}%, var(--color-base-100))`;
let html = '<span></span>' + labels.map((l) => `<span class="text-center text-base-content/60">${l}</span>`).join('');
m.forEach((row, i) => {
  html += `<span class="self-center text-base-content/60">${labels[i]}</span>`;
  row.forEach((v) => { html += `<span class="h-10 grid place-items-center rounded-sm tabular-nums" style="${bg(v)}">${v.toFixed(2)}</span>`; });
});
document.getElementById('heatmapChart3').innerHTML = html;
})();
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

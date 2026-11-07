# Line chart 9 — Sparkline grid

> **Looks like**: Four mini cards, each with a label, a value and its own sparkline colour.

**Use when**: Dashboards listing several services or metrics at once.
**Data shape**: Array of `{label, value, data, color}`; one chart per card.
**Requires**: Chart.js 4 + the `dc` helper

## Code

```html
<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" id="lineChart9-grid"></div>

<script>
(() => {
const sparks = [
  { label: 'Requêtes', value: '2,4 M', color: 'primary', data: [12, 14, 13, 18, 17, 22, 21, 26] },
  { label: 'Erreurs', value: '0,8 %', color: 'error', data: [9, 8, 9, 7, 6, 7, 5, 4] },
  { label: 'Latence', value: '182 ms', color: 'warning', data: [20, 22, 19, 24, 23, 21, 25, 22] },
  { label: 'Disponibilité', value: '99,98 %', color: 'success', data: [98, 99, 99, 100, 99, 100, 100, 100] },
];
const grid = document.getElementById('lineChart9-grid');
sparks.forEach((s, i) => {
  grid.insertAdjacentHTML('beforeend', `
    <div class="card bg-base-100 border border-base-300"><div class="card-body p-4 gap-2">
      <p class="text-sm text-base-content/70">${s.label}</p>
      <p class="text-2xl font-semibold tabular-nums">${s.value}</p>
      <div class="relative h-10"><canvas id="lineChart9-${i}" role="img" aria-label="Tendance ${s.label}"></canvas></div>
    </div></div>`);
  dc.mount(`lineChart9-${i}`, (el) => new Chart(el, {
    type: 'line',
    data: { labels: s.data.map((_, k) => k + 1), datasets: [{ data: s.data, borderColor: dc.color(s.color), borderWidth: 1.5, tension: .35, pointRadius: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, events: [], plugins: { legend: { display: false }, tooltip: { enabled: false } },
               scales: { x: { display: false }, y: { display: false, beginAtZero: false } } },
  }));
});
})();
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

# Area chart 5 — 100 % stacked area

> **Looks like**: Areas stacked to 100 %, showing how the mix evolves.

**Use when**: Share of each category over time rather than absolute values.
**Data shape**: `labels`, 3–5 datasets already converted to percentages (computed server-side or in JS).
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="areaChart5-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="areaChart5-title" class="card-title text-base">100 % stacked area</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="areaChart5" role="img" aria-label="100 % stacked area"></canvas></div>
  </div>
</section>

<script>
dc.mount('areaChart5', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Organique',
        data: [48.0, 50.0, 39.5, 49.0, 40.7, 45.5, 41.8, 45.5, 40.0, 44.9, 40.0, 43.0],
        borderColor: dc.color('primary'),
        backgroundColor: dc.alpha('primary', 50),
        tension: 0.35,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true
      },
      {
        label: 'Payant',
        data: [32.0, 31.6, 36.8, 35.3, 37.0, 33.3, 38.8, 32.5, 36.2, 34.8, 36.8, 34.6],
        borderColor: dc.color('secondary'),
        backgroundColor: dc.alpha('secondary', 50),
        tension: 0.35,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true
      },
      {
        label: 'Direct',
        data: [20.0, 18.4, 23.7, 15.7, 22.2, 21.2, 19.4, 22.1, 23.8, 20.2, 23.2, 22.4],
        borderColor: dc.color('accent'),
        backgroundColor: dc.alpha('accent', 50),
        tension: 0.35,
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, boxWidth: 8 }
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        stacked: true,
        max: 100,
        ticks: { callback: (v) => v + ' %' }
      }
    },
    interaction: { mode: 'index', intersect: false }
  }
}));
</script>
```

## Customise

- Percentages: `value / sum(values at same index) * 100`.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

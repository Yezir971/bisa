# Area chart 3 — Overlapping areas

> **Looks like**: Three translucent areas overlapping, each with its own line colour.

**Use when**: Comparing series whose values do not hide each other (ordered from largest to smallest).
**Data shape**: `labels`, 2–3 datasets with `fill: true`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="areaChart3-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="areaChart3-title" class="card-title text-base">Overlapping areas</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="areaChart3" role="img" aria-label="Overlapping areas"></canvas></div>
  </div>
</section>

<script>
dc.mount('areaChart3', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Web',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        borderColor: dc.color('primary'),
        backgroundColor: dc.alpha('primary', 18),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true
      },
      {
        label: 'Mobile',
        data: [8, 12, 14, 18, 20, 22, 26, 25, 29, 31, 35, 37],
        borderColor: dc.color('secondary'),
        backgroundColor: dc.alpha('secondary', 18),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true
      },
      {
        label: 'API',
        data: [5, 7, 9, 8, 12, 14, 13, 17, 19, 18, 22, 24],
        borderColor: dc.color('accent'),
        backgroundColor: dc.alpha('accent', 18),
        tension: 0.35,
        borderWidth: 2,
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
        border: { display: false }
      }
    }
  }
}));
</script>
```

## Customise

- Order datasets from largest to smallest so small areas stay visible.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

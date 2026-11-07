# Area chart 7 — Area with threshold

> **Looks like**: Filled area plus a dashed red limit line.

**Use when**: Showing when a metric exceeds a limit (CPU, quota, budget).
**Data shape**: `labels`, one data dataset + one constant dataset.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="areaChart7-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="areaChart7-title" class="card-title text-base">Area with threshold</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="areaChart7" role="img" aria-label="Area with threshold"></canvas></div>
  </div>
</section>

<script>
dc.mount('areaChart7', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Charge CPU',
        data: [30, 42, 38, 55, 61, 72, 68, 80, 77, 64, 58, 52],
        borderColor: dc.color('primary'),
        backgroundColor: dc.alpha('primary', 20),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true
      },
      {
        label: 'Seuil',
        data: [75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75],
        borderColor: dc.color('error'),
        backgroundColor: dc.color('error'),
        tension: 0.35,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderDash: [8, 6]
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

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

# Line chart 10 — Min / max band with average

> **Looks like**: A soft shaded band between the minimum and maximum, with the average line on top.

**Use when**: Showing variability: temperature, latency percentiles, price ranges.
**Data shape**: `labels`, three datasets in this order: max, min, average. Max uses `fill: "+1"` to fill down to min.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="lineChart10-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="lineChart10-title" class="card-title text-base">Min / max band with average</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="lineChart10" role="img" aria-label="Min / max band with average"></canvas></div>
  </div>
</section>

<script>
dc.mount('lineChart10', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Max',
        data: [24, 26, 30, 34, 38, 42, 44, 43, 38, 32, 27, 24],
        borderColor: dc.color('primary'),
        backgroundColor: dc.alpha('primary', 15),
        tension: 0.35,
        borderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: '+1'
      },
      {
        label: 'Min',
        data: [14, 15, 18, 22, 26, 30, 32, 31, 27, 22, 17, 14],
        borderColor: dc.color('primary'),
        backgroundColor: dc.alpha('primary', 15),
        tension: 0.35,
        borderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 5
      },
      {
        label: 'Moyenne',
        data: [19, 20, 24, 28, 32, 36, 38, 37, 32, 27, 22, 19],
        borderColor: dc.color('primary'),
        backgroundColor: dc.color('primary'),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5
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

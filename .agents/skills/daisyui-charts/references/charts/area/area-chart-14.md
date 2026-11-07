# Area chart 14 — Current vs previous period

> **Looks like**: Filled primary area for the current period over a dashed neutral line for the previous period.

**Use when**: Period-over-period comparisons where the current period is the story.
**Data shape**: `labels`, two datasets of the same length.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="areaChart14-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="areaChart14-title" class="card-title text-base">Current vs previous period</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="areaChart14" role="img" aria-label="Current vs previous period"></canvas></div>
  </div>
</section>

<script>
dc.mount('areaChart14', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: '2026',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        borderColor: dc.color('primary'),
        backgroundColor: dc.alpha('primary', 25),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true
      },
      {
        label: '2025',
        data: [8, 12, 14, 18, 20, 22, 26, 25, 29, 31, 35, 37],
        borderColor: dc.alpha('base-content', 45),
        backgroundColor: dc.color('base-content'),
        tension: 0.35,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderDash: [6, 6]
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

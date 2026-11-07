# Line chart 7 — Line with target threshold

> **Looks like**: Primary line plus a dashed green horizontal line marking the goal.

**Use when**: Tracking a metric against a target, SLA or budget.
**Data shape**: `labels`, one data dataset + one constant-value dataset for the target.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="lineChart7-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="lineChart7-title" class="card-title text-base">Line with target threshold</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="lineChart7" role="img" aria-label="Line with target threshold"></canvas></div>
  </div>
</section>

<script>
dc.mount('lineChart7', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Réel',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        borderColor: dc.color('primary'),
        backgroundColor: dc.color('primary'),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5
      },
      {
        label: 'Objectif',
        data: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
        borderColor: dc.color('success'),
        backgroundColor: dc.color('success'),
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

- For several thresholds add more constant datasets; label them in the legend.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

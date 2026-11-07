# Area chart 8 — Positive / negative area

> **Looks like**: Area above zero tinted primary, below zero tinted red.

**Use when**: Values oscillating around zero: profit/loss, net change, variance.
**Data shape**: `labels`, one dataset with negatives; `fill: { target: "origin", above, below }`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="areaChart8-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="areaChart8-title" class="card-title text-base">Positive / negative area</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="areaChart8" role="img" aria-label="Positive / negative area"></canvas></div>
  </div>
</section>

<script>
dc.mount('areaChart8', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Variation nette',
        data: [12, 8, -4, -10, 6, 14, 9, -6, -12, 4, 11, 16],
        borderColor: dc.color('primary'),
        backgroundColor: dc.color('primary'),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: { target: 'origin', above: dc.alpha('primary', 25), below: dc.alpha('error', 25) }
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: false,
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

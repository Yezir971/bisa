# Line chart 11 — Logarithmic scale

> **Looks like**: Line on a log y-axis so exponential growth looks like a straight line.

**Use when**: Data spanning several orders of magnitude (growth, traffic spikes).
**Data shape**: `labels`, one dataset with strictly positive values; `y.type: "logarithmic"`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="lineChart11-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="lineChart11-title" class="card-title text-base">Logarithmic scale</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="lineChart11" role="img" aria-label="Logarithmic scale"></canvas></div>
  </div>
</section>

<script>
dc.mount('lineChart11', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Requêtes',
        data: [10, 18, 40, 90, 200, 450, 900, 2100, 4800, 9500, 21000, 48000],
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
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: false,
        border: { display: false },
        type: 'logarithmic'
      }
    }
  }
}));
</script>
```

## Customise

- Always say "échelle logarithmique" in the subtitle: it misleads otherwise.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

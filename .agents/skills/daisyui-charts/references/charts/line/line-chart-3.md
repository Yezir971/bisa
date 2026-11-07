# Line chart 3 — Stepped line

> **Looks like**: Line drawn as horizontal then vertical steps, so the value is held until it changes.

**Use when**: Values that change at discrete moments: pricing, stock level, plan limits, status counts.
**Data shape**: `labels`, one dataset; `stepped: "before" | "after" | "middle"`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="lineChart3-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="lineChart3-title" class="card-title text-base">Stepped line</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="lineChart3" role="img" aria-label="Stepped line"></canvas></div>
  </div>
</section>

<script>
dc.mount('lineChart3', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Stock',
        data: [40, 40, 55, 55, 55, 30, 30, 70, 70, 50, 50, 65],
        borderColor: dc.color('primary'),
        backgroundColor: dc.color('primary'),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        stepped: 'before'
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

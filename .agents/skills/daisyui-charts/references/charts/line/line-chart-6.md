# Line chart 6 — Highlighted last point

> **Looks like**: Plain line with a single emphasised marker on the most recent value.

**Use when**: Drawing attention to the current value while keeping the trend readable.
**Data shape**: `labels`, one dataset; the highlighted point is the last index.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="lineChart6-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="lineChart6-title" class="card-title text-base">Highlighted last point</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="lineChart6" role="img" aria-label="Highlighted last point"></canvas></div>
  </div>
</section>

<script>
dc.mount('lineChart6', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Utilisateurs actifs',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        borderColor: dc.color('primary'),
        backgroundColor: dc.color('primary'),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: (ctx) => ctx.dataIndex === ctx.dataset.data.length - 1 ? 6 : 0,
        pointHoverRadius: 5,
        pointBackgroundColor: dc.color('primary'),
        pointBorderColor: dc.color('base-100'),
        pointBorderWidth: 2
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

# Column chart 7 — Highlighted max column

> **Looks like**: All columns faded except the highest one in solid primary.

**Use when**: Pointing to the best period or category.
**Data shape**: `labels`, one dataset; colour by comparing to `Math.max`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart7-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart7-title" class="card-title text-base">Highlighted max column</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart7" role="img" aria-label="Highlighted max column"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart7', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Ventes',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        backgroundColor: (c) => c.raw === Math.max(...c.dataset.data) ? dc.color('primary') : dc.alpha('primary', 30),
        borderRadius: 4,
        maxBarThickness: 32
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

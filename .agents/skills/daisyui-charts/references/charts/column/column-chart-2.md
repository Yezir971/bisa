# Column chart 2 — Pill columns

> **Looks like**: Narrow columns with fully rounded ends.

**Use when**: A lighter, modern look for many columns (weeks, days).
**Data shape**: `labels`, one dataset; `borderRadius` large, `maxBarThickness` small.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart2-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart2-title" class="card-title text-base">Pill columns</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart2" role="img" aria-label="Pill columns"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart2', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Commandes',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        backgroundColor: dc.color('primary'),
        borderRadius: 999,
        maxBarThickness: 14,
        borderSkipped: false
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

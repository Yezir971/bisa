# Column chart 6 — Positive / negative columns

> **Looks like**: Green columns above zero, red below.

**Use when**: Variance, net change, profit & loss.
**Data shape**: `labels`, one dataset with negatives; colour chosen per value.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart6-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart6-title" class="card-title text-base">Positive / negative columns</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart6" role="img" aria-label="Positive / negative columns"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart6', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Variation',
        data: [12, 8, -4, -10, 6, 14, 9, -6, -12, 4, 11, 16],
        backgroundColor: (c) => c.raw >= 0 ? dc.color('success') : dc.color('error'),
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

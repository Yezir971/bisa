# Column chart 4 — Stacked columns

> **Looks like**: Columns stacked by category, top = total.

**Use when**: Part-to-whole per period with a few categories.
**Data shape**: `labels`, 2–4 datasets; `stacked: true` on both axes.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart4-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart4-title" class="card-title text-base">Stacked columns</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart4" role="img" aria-label="Stacked columns"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart4', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Web',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        backgroundColor: dc.color('primary'),
        borderRadius: 0,
        maxBarThickness: 32
      },
      {
        label: 'Mobile',
        data: [8, 12, 14, 18, 20, 22, 26, 25, 29, 31, 35, 37],
        backgroundColor: dc.color('secondary'),
        borderRadius: 0,
        maxBarThickness: 32
      },
      {
        label: 'API',
        data: [5, 7, 9, 8, 12, 14, 13, 17, 19, 18, 22, 24],
        backgroundColor: dc.color('accent'),
        borderRadius: 0,
        maxBarThickness: 32
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
        grid: { display: false },
        stacked: true
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        stacked: true
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

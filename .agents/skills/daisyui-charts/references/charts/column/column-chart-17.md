# Column chart 17 — Weekday with today highlighted

> **Looks like**: Seven columns, today in primary and other days in neutral.

**Use when**: Weekly activity where "today" matters.
**Data shape**: `labels` of 7 days, one dataset; highlight by index.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart17-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart17-title" class="card-title text-base">Weekday with today highlighted</h2>
      <p class="text-xs text-base-content/60">Cette semaine</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart17" role="img" aria-label="Weekday with today highlighted"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart17', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Sessions',
        data: [320, 410, 380, 520, 290, 140, 90],
        backgroundColor: (c) => c.dataIndex === 3 ? dc.color('primary') : dc.color('base-300'),
        borderRadius: 4,
        maxBarThickness: 36
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

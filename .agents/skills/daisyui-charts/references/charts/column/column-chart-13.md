# Column chart 13 — Floating range columns

> **Looks like**: Columns that float between a minimum and a maximum.

**Use when**: Ranges per period: temperatures, price min/max, response time p50–p95.
**Data shape**: `labels`, one dataset whose values are `[min, max]` pairs.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart13-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart13-title" class="card-title text-base">Floating range columns</h2>
      <p class="text-xs text-base-content/60">Température min–max (°C)</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart13" role="img" aria-label="Floating range columns"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart13', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Amplitude',
        data: [
          [14, 24],
          [15, 26],
          [18, 30],
          [22, 34],
          [26, 38],
          [30, 42],
          [32, 44],
          [31, 43],
          [27, 38],
          [22, 32],
          [17, 27],
          [14, 24]
        ],
        backgroundColor: dc.color('primary'),
        borderRadius: 6,
        maxBarThickness: 32,
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

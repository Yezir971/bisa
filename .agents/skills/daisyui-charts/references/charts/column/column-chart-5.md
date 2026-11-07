# Column chart 5 — 100 % stacked columns

> **Looks like**: Every column fills to 100 %, showing the mix.

**Use when**: Comparing composition across periods regardless of totals.
**Data shape**: `labels`, datasets already converted to percentages.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart5-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart5-title" class="card-title text-base">100 % stacked columns</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart5" role="img" aria-label="100 % stacked columns"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart5', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Web',
        data: [48.0, 50.0, 39.5, 49.0, 40.7, 45.5, 41.8, 45.5, 40.0, 44.9, 40.0, 43.0],
        backgroundColor: dc.color('primary'),
        borderRadius: 0,
        maxBarThickness: 32
      },
      {
        label: 'Mobile',
        data: [32.0, 31.6, 36.8, 35.3, 37.0, 33.3, 38.8, 32.5, 36.2, 34.8, 36.8, 34.6],
        backgroundColor: dc.color('secondary'),
        borderRadius: 0,
        maxBarThickness: 32
      },
      {
        label: 'API',
        data: [20.0, 18.4, 23.7, 15.7, 22.2, 21.2, 19.4, 22.1, 23.8, 20.2, 23.2, 22.4],
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
        stacked: true,
        max: 100,
        ticks: { callback: (v) => v + ' %' }
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

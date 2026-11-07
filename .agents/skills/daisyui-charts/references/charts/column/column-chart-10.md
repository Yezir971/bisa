# Column chart 10 — Thin columns

> **Looks like**: Slim columns with wide gaps.

**Use when**: Dense categories (24 hours, 31 days) where thick bars would collide.
**Data shape**: `labels` of 20–40 items, one dataset; `barPercentage: .4`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart10-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart10-title" class="card-title text-base">Thin columns</h2>
      <p class="text-xs text-base-content/60">Sessions par heure</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart10" role="img" aria-label="Thin columns"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart10', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0") + "h"),
    datasets: [
      {
        label: 'Sessions',
        data: Array.from({ length: 24 }, (_, i) => Math.round(20 + 30 * Math.sin((i - 6) / 4) ** 2 + i)),
        backgroundColor: dc.color('primary'),
        borderRadius: 4,
        maxBarThickness: 32,
        barPercentage: 0.4,
        categoryPercentage: 1
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
        grid: { display: false },
        ticks: { maxTicksLimit: 8 }
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

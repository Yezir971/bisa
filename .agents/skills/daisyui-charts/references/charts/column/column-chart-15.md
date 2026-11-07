# Column chart 15 — Histogram

> **Looks like**: Touching columns representing value bins.

**Use when**: Distribution of a continuous value (order amount, latency).
**Data shape**: `labels` = bin labels, one dataset of counts; `barPercentage: 1`, `categoryPercentage: 1`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart15-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart15-title" class="card-title text-base">Histogram</h2>
      <p class="text-xs text-base-content/60">Distribution du panier (€)</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart15" role="img" aria-label="Histogram"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart15', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['0–10', '10–20', '20–30', '30–40', '40–50', '50–60', '60–70', '70–80'],
    datasets: [
      {
        label: 'Commandes',
        data: [4, 12, 28, 41, 33, 19, 9, 3],
        backgroundColor: dc.color('primary'),
        borderRadius: 0,
        maxBarThickness: 200,
        barPercentage: 1,
        categoryPercentage: 1,
        borderColor: dc.color('base-100'),
        borderWidth: 1
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

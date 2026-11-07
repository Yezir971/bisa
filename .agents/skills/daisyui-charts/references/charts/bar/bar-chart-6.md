# Bar chart 6 — Bars with value labels

> **Looks like**: Values printed at the end of each bar; x-axis hidden.

**Use when**: Short rankings (≤ 8) where exact values matter.
**Data shape**: `labels`, one dataset; inline plugin draws text.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="barChart6-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="barChart6-title" class="card-title text-base">Bars with value labels</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="barChart6" role="img" aria-label="Bars with value labels"></canvas></div>
  </div>
</section>

<script>
dc.mount('barChart6', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['SEO', 'Direct', 'Ads', 'E-mail', 'Social', 'Referral', 'Autres'],
    datasets: [
      {
        label: 'Visites',
        data: [420, 310, 260, 180, 140, 90, 40],
        backgroundColor: dc.color('primary'),
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
        grid: { display: false },
        beginAtZero: true,
        border: { display: false },
        display: false
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { display: false }
      }
    },
    indexAxis: 'y',
    layout: {
      padding: { right: 36 }
    }
  },
  plugins: [
    {
      id: 'valueLabels',
      afterDatasetsDraw(chart) {
        const { ctx } = chart; ctx.save();
        ctx.fillStyle = dc.color('base-content'); ctx.font = '600 12px sans-serif'; ctx.textBaseline = 'middle';
        chart.getDatasetMeta(0).data.forEach((bar, i) => ctx.fillText(chart.data.datasets[0].data[i], bar.x + 6, bar.y));
        ctx.restore();
      },
    }
  ]
}));
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

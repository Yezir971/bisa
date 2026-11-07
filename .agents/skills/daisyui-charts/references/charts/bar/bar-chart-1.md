# Bar chart 1 — Basic horizontal bars

> **Looks like**: Horizontal primary bars, category names on the left, values on the x-axis.

**Use when**: Comparing categories, especially with longer labels.
**Data shape**: `labels`, one dataset; `indexAxis: "y"`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="barChart1-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="barChart1-title" class="card-title text-base">Basic horizontal bars</h2>
      <p class="text-xs text-base-content/60">Visites par canal</p>
    </header>
    <div class="relative h-64"><canvas id="barChart1" role="img" aria-label="Basic horizontal bars"></canvas></div>
  </div>
</section>

<script>
dc.mount('barChart1', (el) => new Chart(el, {
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
        grid: { display: true },
        beginAtZero: true,
        border: { display: false }
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { display: false }
      }
    },
    indexAxis: 'y'
  }
}));
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

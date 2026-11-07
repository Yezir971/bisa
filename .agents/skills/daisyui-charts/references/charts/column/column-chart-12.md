# Column chart 12 — Categorical colours

> **Looks like**: Each column has its own theme colour.

**Use when**: Unordered categories where identity matters (channels, teams).
**Data shape**: `labels`, one dataset; `backgroundColor` is `dc.palette(n)`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart12-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart12-title" class="card-title text-base">Categorical colours</h2>
      <p class="text-xs text-base-content/60">Visites par canal</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart12" role="img" aria-label="Categorical colours"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart12', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['SEO', 'Direct', 'Ads', 'E-mail', 'Social', 'Referral', 'Autres'],
    datasets: [
      {
        label: 'Visites',
        data: [420, 310, 260, 180, 140, 90, 40],
        backgroundColor: dc.palette(7),
        borderRadius: 4,
        maxBarThickness: 40
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

- Keep the same colour per category across every chart of the dashboard.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

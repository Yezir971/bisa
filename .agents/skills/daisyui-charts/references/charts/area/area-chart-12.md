# Area chart 12 — Area with dashed projection

> **Looks like**: One area whose last segments turn dashed to mark estimated data.

**Use when**: Mixing actual and estimated values on the same series.
**Data shape**: `labels`, one dataset; `segment.borderDash` depends on the point index.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="areaChart12-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="areaChart12-title" class="card-title text-base">Area with dashed projection</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="areaChart12" role="img" aria-label="Area with dashed projection"></canvas></div>
  </div>
</section>

<script>
dc.mount('areaChart12', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Revenus',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        borderColor: dc.color('primary'),
        backgroundColor: dc.alpha('primary', 20),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true,
        segment: { borderDash: (c) => c.p0DataIndex >= 8 ? [6, 6] : undefined }
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

- Say in the subtitle which period is estimated.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

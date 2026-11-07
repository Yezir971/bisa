# Pie chart 3 — Thin doughnut

> **Looks like**: Elegant thin ring (80 % hole) with no borders.

**Use when**: Minimal look for dashboards with few segments.
**Data shape**: `labels`, one dataset; `cutout: "82%"`, `borderWidth: 0`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="pieChart3-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="pieChart3-title" class="card-title text-base">Thin doughnut</h2>
      <p class="text-xs text-base-content/60">Répartition des sessions (%)</p>
    </header>
    <div class="relative h-64"><canvas id="pieChart3" role="img" aria-label="Thin doughnut"></canvas></div>
  </div>
</section>

<script>
dc.mount('pieChart3', (el) => new Chart(el, {
  type: 'doughnut',
  data: {
    labels: ['Mobile', 'Desktop', 'Tablette', 'Autre'],
    datasets: [
      {
        data: [52, 31, 12, 5],
        backgroundColor: dc.palette(4),
        borderColor: dc.color('base-100'),
        borderWidth: 0
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
    cutout: '82%'
  }
}));
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

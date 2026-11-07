# Pie chart 8 — Doughnut with gaps

> **Looks like**: Segments separated by visible gaps.

**Use when**: Clean, modern look for 3–5 segments.
**Data shape**: `labels`, one dataset; `spacing: 6`, `borderWidth: 0`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="pieChart8-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="pieChart8-title" class="card-title text-base">Doughnut with gaps</h2>
      <p class="text-xs text-base-content/60">Répartition des sessions (%)</p>
    </header>
    <div class="relative h-64"><canvas id="pieChart8" role="img" aria-label="Doughnut with gaps"></canvas></div>
  </div>
</section>

<script>
dc.mount('pieChart8', (el) => new Chart(el, {
  type: 'doughnut',
  data: {
    labels: ['Mobile', 'Desktop', 'Tablette', 'Autre'],
    datasets: [
      {
        data: [52, 31, 12, 5],
        backgroundColor: dc.palette(4),
        borderColor: dc.color('base-100'),
        borderWidth: 0,
        spacing: 6,
        borderRadius: 4
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
    cutout: '62%'
  }
}));
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

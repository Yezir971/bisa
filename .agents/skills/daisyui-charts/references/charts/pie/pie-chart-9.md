# Pie chart 9 — Rounded-segment doughnut

> **Looks like**: Thick ring whose segments have fully rounded ends.

**Use when**: Playful, friendly dashboards (fitness, finance apps).
**Data shape**: `labels`, one dataset; large `borderRadius`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="pieChart9-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="pieChart9-title" class="card-title text-base">Rounded-segment doughnut</h2>
      <p class="text-xs text-base-content/60">Répartition des sessions (%)</p>
    </header>
    <div class="relative h-64"><canvas id="pieChart9" role="img" aria-label="Rounded-segment doughnut"></canvas></div>
  </div>
</section>

<script>
dc.mount('pieChart9', (el) => new Chart(el, {
  type: 'doughnut',
  data: {
    labels: ['Mobile', 'Desktop', 'Tablette', 'Autre'],
    datasets: [
      {
        data: [52, 31, 12, 5],
        backgroundColor: dc.palette(4),
        borderColor: dc.color('base-100'),
        borderWidth: 0,
        borderRadius: 20,
        spacing: 2
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
    cutout: '72%'
  }
}));
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

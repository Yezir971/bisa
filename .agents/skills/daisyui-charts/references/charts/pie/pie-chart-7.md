# Pie chart 7 — Pie with exploded slice

> **Looks like**: Pie where one slice is pulled out.

**Use when**: Emphasising one segment in a story-driven view.
**Data shape**: `labels`, one dataset; `offset` array.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="pieChart7-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="pieChart7-title" class="card-title text-base">Pie with exploded slice</h2>
      <p class="text-xs text-base-content/60">Répartition des sessions (%)</p>
    </header>
    <div class="relative h-64"><canvas id="pieChart7" role="img" aria-label="Pie with exploded slice"></canvas></div>
  </div>
</section>

<script>
dc.mount('pieChart7', (el) => new Chart(el, {
  type: 'pie',
  data: {
    labels: ['Mobile', 'Desktop', 'Tablette', 'Autre'],
    datasets: [
      {
        data: [52, 31, 12, 5],
        backgroundColor: dc.palette(4),
        borderColor: dc.color('base-100'),
        borderWidth: 2,
        offset: [0, 0, 16, 0],
        hoverOffset: 8
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
    }
  }
}));
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

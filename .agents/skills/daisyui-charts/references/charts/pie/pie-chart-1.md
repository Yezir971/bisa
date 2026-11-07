# Pie chart 1 — Basic pie

> **Looks like**: Full pie with 4 slices separated by thin surface-coloured borders.

**Use when**: Part-to-whole with ≤ 5 slices and clear differences.
**Data shape**: `labels`, one dataset with 2–5 positive values.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="pieChart1-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="pieChart1-title" class="card-title text-base">Basic pie</h2>
      <p class="text-xs text-base-content/60">Répartition des sessions (%)</p>
    </header>
    <div class="relative h-64"><canvas id="pieChart1" role="img" aria-label="Basic pie"></canvas></div>
  </div>
</section>

<script>
dc.mount('pieChart1', (el) => new Chart(el, {
  type: 'pie',
  data: {
    labels: ['Mobile', 'Desktop', 'Tablette', 'Autre'],
    datasets: [
      {
        data: [52, 31, 12, 5],
        backgroundColor: dc.palette(4),
        borderColor: dc.color('base-100'),
        borderWidth: 2
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

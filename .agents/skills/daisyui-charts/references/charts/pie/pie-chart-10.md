# Pie chart 10 — Nested doughnut

> **Looks like**: Two concentric rings: outer for the current year, inner for the previous one.

**Use when**: Comparing the same split across two periods.
**Data shape**: `labels`, two datasets with identical categories.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="pieChart10-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="pieChart10-title" class="card-title text-base">Nested doughnut</h2>
      <p class="text-xs text-base-content/60">2026 (extérieur) vs 2025 (intérieur)</p>
    </header>
    <div class="relative h-64"><canvas id="pieChart10" role="img" aria-label="Nested doughnut"></canvas></div>
  </div>
</section>

<script>
dc.mount('pieChart10', (el) => new Chart(el, {
  type: 'doughnut',
  data: {
    labels: ['Mobile', 'Desktop', 'Tablette', 'Autre'],
    datasets: [
      {
        data: [52, 31, 12, 5],
        backgroundColor: dc.palette(4),
        borderColor: dc.color('base-100'),
        borderWidth: 2
      },
      {
        data: [44, 38, 12, 6],
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

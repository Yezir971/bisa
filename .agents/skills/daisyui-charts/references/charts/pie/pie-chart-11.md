# Pie chart 11 — Polar area

> **Looks like**: Equal-angle slices whose radius encodes the value.

**Use when**: Comparing magnitudes of several categories in a compact radial layout.
**Data shape**: `labels`, one dataset; type `polarArea`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="pieChart11-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="pieChart11-title" class="card-title text-base">Polar area</h2>
      <p class="text-xs text-base-content/60">Visites par canal</p>
    </header>
    <div class="relative h-72"><canvas id="pieChart11" role="img" aria-label="Polar area"></canvas></div>
  </div>
</section>

<script>
dc.mount('pieChart11', (el) => new Chart(el, {
  type: 'polarArea',
  data: {
    labels: ['SEO', 'Direct', 'Ads', 'E-mail', 'Social', 'Referral'],
    datasets: [
      {
        data: [420, 310, 260, 180, 140, 90],
        backgroundColor: dc.palette(6, 60),
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
    },
    scales: {
      r: {
        grid: { color: dc.color('base-300') },
        ticks: { display: false }
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

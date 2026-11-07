# Column chart 16 — Grouped + stacked columns

> **Looks like**: Two clusters per category, one of them stacked.

**Use when**: Comparing two stacked breakdowns side by side (this year vs last year by channel).
**Data shape**: `labels`, datasets sharing a `stack` key to stack, different keys to separate.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart16-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart16-title" class="card-title text-base">Grouped + stacked columns</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart16" role="img" aria-label="Grouped + stacked columns"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart16', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Web 2025',
        data: [8, 12, 14, 18, 20, 22],
        backgroundColor: dc.alpha('primary', 35),
        borderRadius: 0,
        maxBarThickness: 32,
        stack: 'a'
      },
      {
        label: 'Mobile 2025',
        data: [5, 7, 9, 8, 12, 14],
        backgroundColor: dc.alpha('secondary', 35),
        borderRadius: 0,
        maxBarThickness: 32,
        stack: 'a'
      },
      {
        label: 'Web 2026',
        data: [12, 19, 15, 25, 22, 30],
        backgroundColor: dc.color('primary'),
        borderRadius: 0,
        maxBarThickness: 32,
        stack: 'b'
      },
      {
        label: 'Mobile 2026',
        data: [8, 12, 14, 18, 20, 22],
        backgroundColor: dc.color('secondary'),
        borderRadius: 0,
        maxBarThickness: 32,
        stack: 'b'
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

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

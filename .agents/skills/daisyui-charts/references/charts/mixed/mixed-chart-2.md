# Mixed chart 2 — Stacked columns + total line

> **Looks like**: Stacked columns with a dashed line connecting the totals.

**Use when**: Part-to-whole plus total trend.
**Data shape**: `labels`, stacked bar datasets + one line dataset with the sums.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="mixedChart2-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="mixedChart2-title" class="card-title text-base">Stacked columns + total line</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="mixedChart2" role="img" aria-label="Stacked columns + total line"></canvas></div>
  </div>
</section>

<script>
dc.mount('mixedChart2', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Web',
        data: [12, 19, 15, 25, 22, 30],
        backgroundColor: dc.color('primary'),
        borderRadius: 0,
        maxBarThickness: 32
      },
      {
        label: 'Mobile',
        data: [8, 12, 14, 18, 20, 22],
        backgroundColor: dc.color('secondary'),
        borderRadius: 0,
        maxBarThickness: 32
      },
      {
        type: 'line',
        label: 'Total',
        data: [20, 31, 29, 43, 42, 52],
        borderColor: dc.color('base-content'),
        borderDash: [6, 6],
        borderWidth: 1.5,
        pointRadius: 3,
        pointBackgroundColor: dc.color('base-100'),
        pointBorderColor: dc.color('base-content'),
        tension: 0.3
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
        grid: { display: false },
        stacked: true
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        stacked: true
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

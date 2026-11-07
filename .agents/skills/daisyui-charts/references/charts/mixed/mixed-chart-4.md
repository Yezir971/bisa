# Mixed chart 4 — Bars with moving average

> **Looks like**: Faded columns with a bold 3-period moving-average line.

**Use when**: Smoothing noisy data while keeping raw values visible.
**Data shape**: `labels`, one bar dataset + one line dataset (computed average, `null` for the first points).
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="mixedChart4-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="mixedChart4-title" class="card-title text-base">Bars with moving average</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="mixedChart4" role="img" aria-label="Bars with moving average"></canvas></div>
  </div>
</section>

<script>
dc.mount('mixedChart4', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Ventes',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        backgroundColor: dc.alpha('primary', 35),
        borderRadius: 4,
        maxBarThickness: 32
      },
      {
        type: 'line',
        label: 'Moyenne mobile (3 mois)',
        data: [null, null, 15.3, 19.7, 20.7, 25.7, 26.7, 31.0, 31.7, 35.7, 36.7, 41.3],
        borderColor: dc.color('primary'),
        borderWidth: 2.5,
        tension: 0.35,
        pointRadius: 0
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

# Area chart 9 — Forecast with confidence band

> **Looks like**: Solid actuals, then a dashed forecast inside a shaded confidence band.

**Use when**: Projections with uncertainty (revenue forecast, capacity planning).
**Data shape**: `labels`, datasets: upper (fill "+1"), lower, actual, forecast. Use `null` where a series has no value.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="areaChart9-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="areaChart9-title" class="card-title text-base">Forecast with confidence band</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="areaChart9" role="img" aria-label="Forecast with confidence band"></canvas></div>
  </div>
</section>

<script>
dc.mount('areaChart9', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Haut',
        data: [null, null, null, null, null, null, null, 31, 36, 41, 47, 54],
        borderColor: dc.color('primary'),
        backgroundColor: dc.alpha('primary', 15),
        tension: 0.35,
        borderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: '+1'
      },
      {
        label: 'Bas',
        data: [null, null, null, null, null, null, null, 31, 32, 33, 33, 32],
        borderColor: dc.color('primary'),
        backgroundColor: dc.color('primary'),
        tension: 0.35,
        borderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 5
      },
      {
        label: 'Réel',
        data: [10, 14, 13, 18, 22, 25, 28, 31, null, null, null, null],
        borderColor: dc.color('primary'),
        backgroundColor: dc.color('primary'),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5
      },
      {
        label: 'Prévision',
        data: [null, null, null, null, null, null, null, 31, 34, 37, 40, 43],
        borderColor: dc.color('primary'),
        backgroundColor: dc.color('primary'),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderDash: [6, 6]
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, boxWidth: 8, filter: (item) => !['Haut', 'Bas'].includes(item.text) }
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

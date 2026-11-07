# Line chart 13 — Series with point-style legend

> **Looks like**: Three lines, legend at top right with round markers, tooltip showing all series at the hovered x.

**Use when**: Dashboards where users compare series values at one moment.
**Data shape**: `labels`, 2–4 datasets.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="lineChart13-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="lineChart13-title" class="card-title text-base">Series with point-style legend</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="lineChart13" role="img" aria-label="Series with point-style legend"></canvas></div>
  </div>
</section>

<script>
dc.mount('lineChart13', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Free',
        data: [5, 7, 9, 8, 12, 14, 13, 17, 19, 18, 22, 24],
        borderColor: dc.color('primary'),
        backgroundColor: dc.color('primary'),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5
      },
      {
        label: 'Pro',
        data: [8, 12, 14, 18, 20, 22, 26, 25, 29, 31, 35, 37],
        borderColor: dc.color('secondary'),
        backgroundColor: dc.color('secondary'),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5
      },
      {
        label: 'Team',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        borderColor: dc.color('accent'),
        backgroundColor: dc.color('accent'),
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { usePointStyle: true, boxWidth: 8 },
        align: 'end'
      },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        border: { display: false }
      }
    },
    interaction: { mode: 'index', intersect: false }
  }
}));
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

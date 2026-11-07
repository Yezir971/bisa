# Area chart 11 — Smooth stream stack

> **Looks like**: Four smoothly stacked layers without outlines, like a stream graph.

**Use when**: Expressive composition over time when exact values matter less than the shape.
**Data shape**: `labels`, 3–5 datasets stacked; `tension: .5`, `borderWidth: 0`.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="areaChart11-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="areaChart11-title" class="card-title text-base">Smooth stream stack</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="areaChart11" role="img" aria-label="Smooth stream stack"></canvas></div>
  </div>
</section>

<script>
dc.mount('areaChart11', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'A',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        borderColor: dc.color('primary'),
        backgroundColor: dc.alpha('primary', 80),
        tension: 0.5,
        borderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true
      },
      {
        label: 'B',
        data: [8, 12, 14, 18, 20, 22, 26, 25, 29, 31, 35, 37],
        borderColor: dc.color('secondary'),
        backgroundColor: dc.alpha('secondary', 80),
        tension: 0.5,
        borderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true
      },
      {
        label: 'C',
        data: [5, 7, 9, 8, 12, 14, 13, 17, 19, 18, 22, 24],
        borderColor: dc.color('accent'),
        backgroundColor: dc.alpha('accent', 80),
        tension: 0.5,
        borderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true
      },
      {
        label: 'D',
        data: [4, 5, 6, 8, 7, 9, 11, 10, 12, 14, 13, 15],
        borderColor: dc.color('info'),
        backgroundColor: dc.alpha('info', 80),
        tension: 0.5,
        borderWidth: 0,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true
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

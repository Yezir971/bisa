# Line chart 15 — Percentage axis

> **Looks like**: Line on a 0–100 % axis with % ticks and tooltips.

**Use when**: Rates and ratios: conversion, retention, uptime, completion.
**Data shape**: `labels`, one dataset of values between 0 and 100.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="lineChart15-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="lineChart15-title" class="card-title text-base">Percentage axis</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="lineChart15" role="img" aria-label="Percentage axis"></canvas></div>
  </div>
</section>

<script>
dc.mount('lineChart15', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Rétention',
        data: [72, 74, 73, 77, 79, 78, 81, 83, 82, 85, 86, 88],
        borderColor: dc.color('primary'),
        backgroundColor: dc.color('primary'),
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
      legend: { display: false },
      tooltip: {
        callbacks: { label: (c) => ` ${c.dataset.label} : ${c.parsed.y} %` }
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        min: 0,
        max: 100,
        ticks: { callback: (v) => v + ' %' }
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

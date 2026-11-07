# Bar chart 10 — Timeline (floating bars)

> **Looks like**: Horizontal bars floating between start and end values, like a simple Gantt chart.

**Use when**: Schedules, durations, availability windows.
**Data shape**: `labels` = tasks, one dataset of `[start, end]` pairs.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="barChart10-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="barChart10-title" class="card-title text-base">Timeline (floating bars)</h2>
      <p class="text-xs text-base-content/60">Planning projet (semaines)</p>
    </header>
    <div class="relative h-64"><canvas id="barChart10" role="img" aria-label="Timeline (floating bars)"></canvas></div>
  </div>
</section>

<script>
dc.mount('barChart10', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Cadrage', 'Design', 'Développement', 'Recette', 'Mise en prod'],
    datasets: [
      {
        label: 'Semaines',
        data: [
          [0, 2],
          [1, 4],
          [3, 9],
          [8, 11],
          [10, 12]
        ],
        backgroundColor: dc.color('primary'),
        borderRadius: 6,
        maxBarThickness: 32,
        borderSkipped: false
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: true },
        beginAtZero: true,
        border: { display: false },
        min: 0,
        max: 12,
        ticks: { stepSize: 2, callback: (v) => 'S' + v }
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { display: false }
      }
    },
    indexAxis: 'y'
  }
}));
</script>
```

## Customise

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

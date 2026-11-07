# Line chart 8 — Sparkline in a stat card

> **Looks like**: Tiny axis-less line under a big number, inside a daisyUI `stat`.

**Use when**: KPI cards that need a hint of trend without taking space.
**Data shape**: One dataset of 8–30 numbers; no labels displayed.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="lineChart8-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="lineChart8-title" class="card-title text-base">Sparkline in a stat card</h2>
      <p class="text-xs text-base-content/60">Commandes · 12 derniers mois</p>
    </header>
    <div class="flex items-end justify-between gap-4">
      <div>
        <div class="stat-value text-3xl tabular-nums">1 284</div>
        <div class="text-xs"><span class="text-success">↗︎ +12,4 %</span> <span class="text-base-content/60">vs mois dernier</span></div>
      </div>
      <div class="relative h-12 w-32"><canvas id="lineChart8" role="img" aria-label="Tendance des commandes sur 12 mois"></canvas></div>
    </div>
  </div>
</section>

<script>
dc.mount('lineChart8', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    datasets: [
      {
        label: 'Commandes',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        borderColor: dc.color('primary'),
        backgroundColor: dc.color('primary'),
        tension: 0.35,
        borderWidth: 1.5,
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
      tooltip: { enabled: false }
    },
    scales: {
      x: {
        grid: { display: false },
        display: false
      },
      y: {
        beginAtZero: false,
        border: { display: false },
        display: false
      }
    },
    events: [],
    layout: { padding: 2 }
  }
}));
</script>
```

## Customise

- Sparklines have no axes, legend or tooltip: the number beside it carries the information.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

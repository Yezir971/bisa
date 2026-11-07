# Area chart 10 — Mini area sparkline

> **Looks like**: Gradient mini-area under a KPI, no axes.

**Use when**: Compact KPI cards with a softer look than a plain sparkline.
**Data shape**: One dataset of 8–30 numbers.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="areaChart10-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="areaChart10-title" class="card-title text-base">Mini area sparkline</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="flex items-end justify-between gap-4">
      <div>
        <div class="text-3xl font-semibold tabular-nums">12 480</div>
        <div class="text-xs text-base-content/60">Sessions · 30 j</div>
      </div>
      <div class="relative h-14 w-36"><canvas id="areaChart10" role="img" aria-label="Tendance des sessions"></canvas></div>
    </div>
  </div>
</section>

<script>
dc.mount('areaChart10', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    datasets: [
      {
        label: 'Sessions',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        borderColor: dc.color('primary'),
        backgroundColor: (ctx) => {
          const { chart } = ctx; const { ctx: c, chartArea } = chart;
          if (!chartArea) return null;
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, dc.alpha('primary', 35)); g.addColorStop(1, dc.alpha('primary', 0));
          return g;
        },
        tension: 0.35,
        borderWidth: 1.5,
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

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

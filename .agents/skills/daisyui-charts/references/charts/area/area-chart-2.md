# Area chart 2 — Gradient area

> **Looks like**: Fill fades from 40 % primary at the line to transparent at the axis.

**Use when**: Hero chart on a dashboard, a more polished single-series trend.
**Data shape**: `labels`, one dataset; `backgroundColor` is a scriptable gradient (needs `chartArea`).
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="areaChart2-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="areaChart2-title" class="card-title text-base">Gradient area</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="areaChart2" role="img" aria-label="Gradient area"></canvas></div>
  </div>
</section>

<script>
dc.mount('areaChart2', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Revenus',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        borderColor: dc.color('primary'),
        backgroundColor: (ctx) => {
          const { chart } = ctx; const { ctx: c, chartArea } = chart;
          if (!chartArea) return null;
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, dc.alpha('primary', 40)); g.addColorStop(1, dc.alpha('primary', 0));
          return g;
        },
        tension: 0.35,
        borderWidth: 2,
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
      legend: { display: false }
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

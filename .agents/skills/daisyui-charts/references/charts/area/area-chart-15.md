# Area chart 15 — Gradient multi-series areas

> **Looks like**: Two smooth areas, each fading from its own colour to transparent.

**Use when**: A polished two-series comparison with a modern look.
**Data shape**: `labels`, 2 datasets with scriptable gradients.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="areaChart15-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="areaChart15-title" class="card-title text-base">Gradient multi-series areas</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="areaChart15" role="img" aria-label="Gradient multi-series areas"></canvas></div>
  </div>
</section>

<script>
dc.mount('areaChart15', (el) => new Chart(el, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Web',
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
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true
      },
      {
        label: 'Mobile',
        data: [8, 12, 14, 18, 20, 22, 26, 25, 29, 31, 35, 37],
        borderColor: dc.color('secondary'),
        backgroundColor: (ctx) => {
          const { chart } = ctx; const { ctx: c, chartArea } = chart;
          if (!chartArea) return null;
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, dc.alpha('secondary', 35)); g.addColorStop(1, dc.alpha('secondary', 0));
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

- Keep the larger series first so the smaller one stays visible in front.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

# Column chart 11 — Gradient columns

> **Looks like**: Each column fades from solid primary at the top to light at the base.

**Use when**: A more decorative hero chart.
**Data shape**: `labels`, one dataset; `backgroundColor` is a scriptable gradient.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart11-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart11-title" class="card-title text-base">Gradient columns</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart11" role="img" aria-label="Gradient columns"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart11', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Ventes',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        backgroundColor: (ctx) => {
          const { chart } = ctx; const { ctx: c, chartArea } = chart;
          if (!chartArea) return null;
          const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          g.addColorStop(0, dc.color('primary')); g.addColorStop(1, dc.alpha('primary', 20));
          return g;
        },
        borderRadius: 4,
        maxBarThickness: 32
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

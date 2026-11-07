# Column chart 9 — Columns with target line

> **Looks like**: Columns with a dashed horizontal line for the goal.

**Use when**: Comparing each period to a target.
**Data shape**: `labels`, one bar dataset + one line dataset of constant value.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="columnChart9-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="columnChart9-title" class="card-title text-base">Columns with target line</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="columnChart9" role="img" aria-label="Columns with target line"></canvas></div>
  </div>
</section>

<script>
dc.mount('columnChart9', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Réel',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        backgroundColor: dc.color('primary'),
        borderRadius: 4,
        maxBarThickness: 32
      },
      {
        type: 'line',
        label: 'Objectif',
        data: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
        borderColor: dc.color('success'),
        borderDash: [8, 6],
        borderWidth: 1.5,
        pointRadius: 0
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

- Replace the sample data; keep the structure.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

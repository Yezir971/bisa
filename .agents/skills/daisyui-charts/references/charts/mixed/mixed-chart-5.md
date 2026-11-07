# Mixed chart 5 — Bars with event markers

> **Looks like**: Columns with diamond markers highlighting specific events.

**Use when**: Annotating a time series with launches, incidents or campaigns.
**Data shape**: `labels`, one bar dataset + one line dataset with `showLine: false` holding values only at event indexes.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="mixedChart5-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="mixedChart5-title" class="card-title text-base">Bars with event markers</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-64"><canvas id="mixedChart5" role="img" aria-label="Bars with event markers"></canvas></div>
  </div>
</section>

<script>
dc.mount('mixedChart5', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Inscriptions',
        data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 46],
        backgroundColor: dc.alpha('primary', 45),
        borderRadius: 4,
        maxBarThickness: 32
      },
      {
        type: 'line',
        label: 'Évènement',
        data: [null, null, 15, null, null, null, null, 35, null, null, null, null],
        showLine: false,
        pointStyle: 'rectRot',
        pointRadius: 8,
        pointHoverRadius: 10,
        pointBackgroundColor: dc.color('warning'),
        pointBorderColor: dc.color('base-100'),
        pointBorderWidth: 2
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
      },
      tooltip: {
        callbacks: { afterLabel: (c) => c.dataset.label === 'Évènement' ? (c.dataIndex === 2 ? 'Lancement v2' : 'Campagne été') : '' }
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

- Explain each marker in a legend line or tooltip; markers alone are not accessible.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

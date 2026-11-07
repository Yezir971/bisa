# Radar chart 6 — Scored radar with ticks

> **Looks like**: Radar with visible 0–100 ticks, three series and a legend.

**Use when**: Reports where readers must read exact levels.
**Data shape**: `labels`, 2–3 datasets with visible ticks.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radarChart6-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="radarChart6-title" class="card-title text-base">Scored radar with ticks</h2>
      <p class="text-xs text-base-content/60">12 derniers mois</p>
    </header>
    <div class="relative h-80"><canvas id="radarChart6" role="img" aria-label="Scored radar with ticks"></canvas></div>
  </div>
</section>

<script>
dc.mount('radarChart6', (el) => new Chart(el, {
  type: 'radar',
  data: {
    labels: ['Vitesse', 'Fiabilité', 'Design', 'Support', 'Prix', 'Sécurité'],
    datasets: [
      {
        label: 'T1',
        data: [60, 70, 55, 62, 48, 75],
        borderColor: dc.color('primary'),
        backgroundColor: dc.alpha('primary', 20),
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: dc.color('primary')
      },
      {
        label: 'T2',
        data: [72, 78, 64, 70, 58, 82],
        borderColor: dc.color('secondary'),
        backgroundColor: dc.alpha('secondary', 20),
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: dc.color('secondary')
      },
      {
        label: 'T3',
        data: [82, 90, 70, 65, 55, 88],
        borderColor: dc.color('accent'),
        backgroundColor: dc.alpha('accent', 20),
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: dc.color('accent')
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
      r: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: { display: true, stepSize: 20, backdropColor: 'transparent' },
        grid: { color: dc.color('base-300') },
        angleLines: { color: dc.color('base-300') },
        pointLabels: {
          font: { size: 12 }
        }
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

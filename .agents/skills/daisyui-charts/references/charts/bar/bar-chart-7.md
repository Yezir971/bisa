# Bar chart 7 — Progress bars with track

> **Looks like**: Bars over a light track showing completion toward 100 %.

**Use when**: Goal completion per item (teams, projects, quotas).
**Data shape**: `labels`, values 0–100; second dataset is the remainder in a neutral colour.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="barChart7-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="barChart7-title" class="card-title text-base">Progress bars with track</h2>
      <p class="text-xs text-base-content/60">Avancement des projets (%)</p>
    </header>
    <div class="relative h-64"><canvas id="barChart7" role="img" aria-label="Progress bars with track"></canvas></div>
  </div>
</section>

<script>
dc.mount('barChart7', (el) => new Chart(el, {
  type: 'bar',
  data: {
    labels: ['Onboarding', 'API v2', 'Mobile', 'Migration', 'Docs'],
    datasets: [
      {
        label: 'Avancement',
        data: [92, 74, 58, 33, 15],
        backgroundColor: dc.color('primary'),
        borderRadius: 6,
        maxBarThickness: 32,
        stack: 's',
        borderSkipped: false
      },
      {
        label: 'Reste',
        data: [8, 26, 42, 67, 85],
        backgroundColor: dc.color('base-200'),
        borderRadius: 6,
        maxBarThickness: 32,
        stack: 's',
        borderSkipped: false
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { filter: (i) => i.datasetIndex === 0 }
    },
    scales: {
      x: {
        grid: { display: true },
        beginAtZero: true,
        border: { display: false },
        stacked: true,
        max: 100,
        display: false
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { display: false },
        stacked: true
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

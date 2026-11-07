# Radial chart 8 — Activity rings

> **Looks like**: Three concentric rings, each with its own progress and colour.

**Use when**: Several goals shown together (calories / move / stand style).
**Data shape**: Three datasets, each `[value, 100 - value]`; outermost first.
**Requires**: Chart.js 4 + the `dc` helper (`references/theme-helper.md`)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radialChart8-title">
  <div class="card-body p-4 gap-3">
    <header>
      <h2 id="radialChart8-title" class="card-title text-base">Activity rings</h2>
      <p class="text-xs text-base-content/60">Objectifs du jour</p>
    </header>
    <div class="relative h-56"><canvas id="radialChart8" role="img" aria-label="Activity rings"></canvas></div>
    <ul class="flex flex-wrap gap-4 text-sm">
      <li class="flex items-center gap-2"><span class="size-2.5 rounded-full bg-primary"></span>Mouvement 82 %</li>
      <li class="flex items-center gap-2"><span class="size-2.5 rounded-full bg-secondary"></span>Exercice 64 %</li>
      <li class="flex items-center gap-2"><span class="size-2.5 rounded-full bg-accent"></span>Debout 41 %</li>
    </ul>
  </div>
</section>

<script>
dc.mount('radialChart8', (el) => new Chart(el, {
  type: 'doughnut',
  data: {
    labels: ['Valeur', 'Reste'],
    datasets: [
      {
        data: [82, 18],
        backgroundColor: [dc.color('primary'), dc.alpha('primary', 15)],
        borderColor: dc.color('base-100'),
        borderWidth: 0,
        borderRadius: 20,
        spacing: 0
      },
      {
        data: [64, 36],
        backgroundColor: [dc.color('secondary'), dc.alpha('secondary', 15)],
        borderColor: dc.color('base-100'),
        borderWidth: 0,
        borderRadius: 20,
        spacing: 0
      },
      {
        data: [41, 59],
        backgroundColor: [dc.color('accent'), dc.alpha('accent', 15)],
        borderColor: dc.color('base-100'),
        borderWidth: 0,
        borderRadius: 20,
        spacing: 0
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    cutout: '38%'
  }
}));
</script>
```

## Customise

- Hover is disabled on the "remaining" arcs by design; add a text legend as above.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

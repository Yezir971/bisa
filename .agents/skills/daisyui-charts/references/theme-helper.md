# Theme helper (`dc`)

Every recipe uses a tiny helper named `dc`. **Include it once per page**, right after the Chart.js script and before the recipe scripts.

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
<script>
const dc = (() => {
  const ORDER = ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'];
  const color = (n) => getComputedStyle(document.documentElement).getPropertyValue(`--color-${n}`).trim();
  const alpha = (n, p) => `color-mix(in oklab, ${color(n)} ${p}%, transparent)`;
  const palette = (n = 7, a) => Array.from({ length: n }, (_, i) => a ? alpha(ORDER[i % 7], a) : color(ORDER[i % 7]));
  const charts = {};

  function defaults() {
    Chart.defaults.color = color('base-content');
    Chart.defaults.borderColor = color('base-300');
    Chart.defaults.font.family = 'inherit';
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.tooltip.backgroundColor = color('neutral');
    Chart.defaults.plugins.tooltip.titleColor = color('neutral-content');
    Chart.defaults.plugins.tooltip.bodyColor = color('neutral-content');
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.legend.labels.color = color('base-content');
    Chart.defaults.animation.duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 600;
  }

  // Build (and rebuild on theme change) a chart bound to <canvas id="...">
  function mount(id, build) {
    const run = () => { charts[id]?.destroy(); defaults(); charts[id] = build(document.getElementById(id)); };
    run();
    new MutationObserver(run).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return charts[id];
  }

  return { color, alpha, palette, mount, charts };
})();
</script>
```

## Notes

- Colours are read from daisyUI CSS variables (`--color-primary`, `--color-base-300`…), so charts follow **any** theme, including custom ones.
- `data-theme` must be set on `<html>` (the `theme-controller` input does this). If you set it on another element, read variables from that element instead.
- `dc.alpha('primary', 20)` returns a `color-mix()` string; it works in canvas on current evergreen browsers. For older browsers, convert to rgba with a tiny helper.
- `dc.palette(n)` follows the order primary → secondary → accent → info → success → warning → error. Status colours (success/warning/error) at the end of the palette on purpose: avoid them for categories when n ≤ 4.
- `prefers-reduced-motion` is respected through the animation duration.
- Charts must live in a container with an explicit height (`h-64`…) and `relative`, because recipes use `maintainAspectRatio: false`.

## Framework use

- **React/Vue/Svelte**: wrap the same config in a component; call `dc.color(...)` inside the effect that creates the chart and recreate it when the theme changes (observe `data-theme`). Destroy the chart on unmount.
- **Chart.js via npm**: `import Chart from 'chart.js/auto'` and export the helper from a module instead of a global.

## Styling a chart card

Use the card pattern of the dashboard skill:

```html
<section class="card bg-base-100 border border-base-300">
  <div class="card-body p-4 gap-3">
    <header><h2 class="card-title text-base">What + unit</h2><p class="text-xs text-base-content/60">Period · scope</p></header>
    <div class="relative h-64"><canvas id="myChart" role="img" aria-label="Key takeaway"></canvas></div>
  </div>
</section>
```

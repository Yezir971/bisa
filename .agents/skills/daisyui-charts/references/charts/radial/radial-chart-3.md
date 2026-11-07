# Radial chart 3 — Status colours

> **Looks like**: Three rings coloured green, orange and red according to health.

**Use when**: Quota/health indicators where the colour carries meaning.
**Data shape**: Numbers 0–100 + a status label.
**Requires**: daisyUI only (the `radial-progress` component, no JS)

## Code

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="radialChart3-title">
  <div class="card-body p-4 gap-3">
    <header><h2 id="radialChart3-title" class="card-title text-base">Santé des services</h2></header>
    <div class="flex gap-8">
      <div class="flex flex-col items-center gap-2"><div class="radial-progress text-success" style="--value:92;" role="progressbar" aria-valuenow="92" aria-label="API 92 %">92 %</div><span class="text-sm">API · OK</span></div>
      <div class="flex flex-col items-center gap-2"><div class="radial-progress text-warning" style="--value:64;" role="progressbar" aria-valuenow="64" aria-label="Base 64 %">64 %</div><span class="text-sm">Base · Dégradé</span></div>
      <div class="flex flex-col items-center gap-2"><div class="radial-progress text-error" style="--value:23;" role="progressbar" aria-valuenow="23" aria-label="Cache 23 %">23 %</div><span class="text-sm">Cache · Critique</span></div>
    </div>
  </div>
</section>
```

## Customise

- The status word next to each ring is mandatory: never rely on colour alone.
- Wrapper, title and subtitle follow `block-patterns/charts.md` of the dashboard skill: what + unit in the title, period in the subtitle.
- Keep `role="img"` + an `aria-label` stating the key takeaway; offer a data table fallback when exact values matter.

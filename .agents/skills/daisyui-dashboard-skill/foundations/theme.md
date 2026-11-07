# Theme

## Enable themes

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}
```

- `--default` = default theme; `--prefersdark` = theme when the OS prefers dark.
- Switch at runtime with `data-theme="dark"` on `<html>` (or any ancestor).
- Persist the choice in `localStorage` and apply it **before first paint** (small inline script in `<head>`) to avoid a flash.

## Theme toggle (accessible, no JS)

```html
<label class="swap swap-rotate btn btn-ghost btn-circle" aria-label="Changer de thème">
  <input type="checkbox" class="theme-controller" value="dark" />
  <svg class="swap-off size-5" …><!-- sun --></svg>
  <svg class="swap-on size-5" …><!-- moon --></svg>
</label>
```

## Choosing a theme for a dashboard

- Prefer calm, low-saturation themes for data-heavy tools: `light`, `dark`, `corporate`, `business`, `nord`, `dim`, `emerald`.
- Avoid very loud themes (`cyberpunk`, `valentine`, `halloween`…) unless requested.
- Always test light AND dark for contrast.

## Custom (brand) theme

```css
@plugin "daisyui/theme" {
  name: "brand";
  default: true;
  prefersdark: false;
  color-scheme: light;

  --color-base-100: oklch(98% 0.003 250);
  --color-base-200: oklch(95% 0.005 250);
  --color-base-300: oklch(90% 0.008 250);
  --color-base-content: oklch(25% 0.02 250);

  --color-primary: oklch(55% 0.2 262);
  --color-primary-content: oklch(98% 0.01 262);
  --color-secondary: oklch(65% 0.15 200);
  --color-secondary-content: oklch(15% 0.03 200);
  --color-accent: oklch(70% 0.17 160);
  --color-accent-content: oklch(15% 0.03 160);
  --color-neutral: oklch(30% 0.03 255);
  --color-neutral-content: oklch(95% 0.01 255);

  --color-info: oklch(70% 0.14 235);
  --color-info-content: oklch(15% 0.03 235);
  --color-success: oklch(70% 0.17 150);
  --color-success-content: oklch(15% 0.04 150);
  --color-warning: oklch(80% 0.16 85);
  --color-warning-content: oklch(20% 0.05 85);
  --color-error: oklch(62% 0.22 25);
  --color-error-content: oklch(98% 0.01 25);

  --radius-selector: 0.5rem;
  --radius-field: 0.375rem;
  --radius-box: 0.75rem;
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
  --depth: 0;   /* flat = cleaner for dashboards */
  --noise: 0;
}
```

Checklist for a custom theme:
- Each `*-content` has contrast ≥ 4.5:1 on its colour.
- `info/success/warning/error` stay distinguishable (and always carry an icon or label for colour-blind users).
- `--depth: 0` and `--noise: 0` for a clean data-oriented look.

## Chart colours

daisyUI provides no charts. Read the theme at runtime so charts follow theme switches:

```js
const css = getComputedStyle(document.documentElement);
const color = (name) => css.getPropertyValue(`--color-${name}`).trim();
// color('primary'), color('base-300'), color('base-content')…
```

# Dashboard audit checklist

IDs are used in reports (e.g. `UX-3`). Mark ✅ / ⚠️ / ❌ / N/A.

## A. UI / UX (50 pts)

### A1. Hierarchy & scanning
- **UX-1** The page has one clear purpose and one `h1`; the key insight is visible without scrolling (5-second test).
- **UX-2** Information goes from summary (KPIs) → trends (charts) → detail (tables), top to bottom.
- **UX-3** Max one primary button per view; secondary actions use `btn-ghost`/`btn-soft`/`btn-outline`.
- **UX-4** Visual weight matches importance (size, colour, position); status colours are not used decoratively.
- **UX-5** 4–6 KPIs max in the top row; each has label, value, and context (delta, period, or target).

### A2. Layout & responsive
- **UX-6** Consistent shell (sidebar/drawer + navbar), consistent page padding and `gap-*` scale.
- **UX-7** Works at 375 / 768 / 1280 px: sidebar → drawer, grids collapse, no horizontal page scroll.
- **UX-8** Wide tables scroll inside their own container (`overflow-x-auto`) or switch to cards on mobile.
- **UX-9** Alignment is consistent: left-aligned text, right-aligned numbers, same card paddings.

### A3. Navigation & orientation
- **UX-10** Current location is obvious (`menu-active`, breadcrumb or page title).
- **UX-11** Navigation grouped by user goals, max ~7 top-level items; labels are nouns/short verbs.
- **UX-12** Destructive or rare actions are tucked into a dropdown/overflow, never next to the primary action.
- **UX-13** Global search/shortcuts (if present) are discoverable (`kbd` hints).

### A4. Data display
- **UX-14** Every number has a unit, period and format (thousand separators, locale, currency, `%`).
- **UX-15** Charts: title says what is measured, axes labelled, legend only if > 1 series, ≤ 5–6 series, colour not the only differentiator.
- **UX-16** Chart type fits the question (trend → line, comparison → bar, part-to-whole ≤ 5 → donut, else bar).
- **UX-17** Tables: sortable key columns, sticky header on long lists, row actions in a consistent last column, pagination or infinite scroll with count.
- **UX-18** Filters are visible, show the active state, can be cleared in one click, and persist in the URL when relevant.

### A5. States & feedback
- **UX-19** Each data block has loading (`skeleton`), empty (message + next action), error (message + retry) and loaded states.
- **UX-20** Actions give feedback within 100 ms (loading button, `toast`, inline validation).
- **UX-21** Destructive actions ask for confirmation (modal) naming the object, or offer undo.
- **UX-22** Forms: labels always visible, validation inline and on blur/submit, errors say how to fix, submit disabled only when loading.

### A6. Content
- **UX-23** Labels, headings and buttons follow `content-strategy/` (verbs on buttons, sentence case, no jargon).
- **UX-24** Realistic data and copy; no placeholder text; consistent date/number formats and language.
- **UX-25** Empty and error messages are helpful and human, not technical.

## B. daisyUI conventions (30 pts)

- **DS-1** daisyUI **v5** syntax only (no `form-control`, `label-text`, `input-bordered`, `tabs-boxed`, `bg-opacity-*`).
- **DS-2** Semantic colours only (`bg-base-*`, `text-base-content`, `btn-primary`…). No hardcoded hex, no `bg-white`, `text-gray-*`, `border-gray-*` on themed surfaces.
- **DS-3** Components use daisyUI classes rather than bespoke Tailwind re-implementations (`btn`, `card`, `table`, `stat`, `menu`, `tabs`, `modal`, `badge`, `alert`, `skeleton`…).
- **DS-4** Class order: component → colour → size → style → utilities; no conflicting modifiers (`btn-sm btn-lg`).
- **DS-5** Sizes consistent within a block (all controls in a toolbar share the same `-sm`/`-md`).
- **DS-6** Tailwind utilities used only for layout/spacing/typography, not to override component colours or radii (change the theme instead).
- **DS-7** Native patterns used: `<dialog class="modal">`, `drawer` with checkbox toggle, `dropdown` with `<details>`/popover, `theme-controller` for theme switch.
- **DS-8** Works in at least `light` and `dark` themes (open both and compare).
- **DS-9** Custom theme (if any) defined through `@plugin "daisyui/theme"`, with `*-content` contrast ≥ 4.5:1.
- **DS-10** No leftover unused classes, duplicated markup that should be a block, or inline `style` colours.
- **DS-11** Stat blocks use `stats`/`stat` structure (`stat-title`, `stat-value`, `stat-desc`, `stat-figure`).
- **DS-12** Form controls use `fieldset` + `label` + `input`/`select`/`textarea` + `validator`/`validator-hint` when validating.

## C. Accessibility (20 pts)

- **A11Y-1** Contrast: text ≥ 4.5:1, large text/icons ≥ 3:1 in every theme (check `text-base-content/60` on `base-100`).
- **A11Y-2** Everything reachable and operable by keyboard; visible focus ring on all controls; logical tab order.
- **A11Y-3** Semantic HTML: one `h1`, ordered headings, `<nav>`, `<main>`, `<header>`, `<table>` with `<th scope>`, `<button>` for actions, `<a>` for navigation.
- **A11Y-4** Icon-only buttons have `aria-label`; decorative icons `aria-hidden="true"`; images have `alt`.
- **A11Y-5** Form inputs have an associated label; errors linked with `aria-describedby`; required fields are marked in text.
- **A11Y-6** Status is never conveyed by colour alone (icon/text with `badge`, `status`).
- **A11Y-7** Charts have a text alternative (title + summary or data table fallback).
- **A11Y-8** Modals trap focus, close with `Esc`, restore focus; toasts use `role="status"`/`aria-live="polite"`.
- **A11Y-9** Touch targets ≥ 44 × 44 px on mobile (use `btn` at `md` or add padding when using `-xs`/`-sm`).
- **A11Y-10** Respects `prefers-reduced-motion` (no essential animation, no auto-playing carousels).

## Quick red flags (automatic P0/P1)

- Primary-coloured everything (P1).
- Horizontal scroll on the page at 375 px (P0).
- Table with 10+ columns and no column priority (P1).
- Pie/donut with > 6 slices (P1).
- Icon-only buttons without labels (P0).
- Hardcoded light colours that break in dark theme (P0).
- Lorem ipsum / "Item 1" / "Test" (P1).
- Spinners that never end, no error state (P0).

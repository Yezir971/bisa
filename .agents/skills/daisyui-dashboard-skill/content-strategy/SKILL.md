---
name: content-strategy
description: Content strategy for dashboards - information hierarchy, data selection, microcopy, naming, number/date formats, empty/error states and tone.
---

# Content strategy

Decide **what to show, in what order, and how to word it** before writing markup. Good dashboard content is scannable, actionable and consistent.

## 1. Start from the user, not the data

Answer these (assume if the user doesn't say):

1. **Who** looks at this (role, expertise) and **how often** (live monitoring, daily check, monthly review)?
2. Which **3–5 questions** must be answered in 5 seconds? ("Are we on track?", "What needs my attention?")
3. Which **actions** follow from the insight? Every block should lead to a next step (link, filter, button).

If a metric answers no question and triggers no action, remove it.

## 2. Information hierarchy

Top → bottom, left → right:

1. **Page header**: title (noun, what the page is), optional period/filters, primary action.
2. **Alerts / attention items** (only if something needs action).
3. **KPIs** (4–6) with comparison.
4. **Trends & breakdowns** (1–3 charts).
5. **Detail** (table/list) with filters.
6. **Secondary** (activity feed, help, exports).

Rules: one idea per block; progressive disclosure (summary first, detail on click); same question → same place on every page.

## 3. Choosing and presenting metrics

- Prefer **ratios and deltas** over raw totals; always give a **comparison basis** (previous period, target, benchmark).
- Name the **period and scope** next to each block ("30 derniers jours · France").
- One definition per metric across the product (put a `tooltip` or help link when the definition is non-obvious).
- Round sensibly: no more precision than the decision needs (`48,3 k€`, `3,2 %`).
- Don't mix units in one block; don't show vanity metrics.

## 4. Writing rules (microcopy)

| Element | Rule | Example |
|---|---|---|
| Page title | Noun phrase, 1–3 words | "Commandes", "Tableau de bord" |
| Section title | What + scope | "Chiffre d'affaires par jour" |
| Buttons | Verb + object, specific | "Créer un rapport", not "OK" / "Soumettre" |
| Destructive buttons | Name the action | "Supprimer le projet", not "Oui" |
| Nav labels | Nouns, ≤ 2 words | "Clients", "Facturation" |
| Column headers | Short noun, units in header | "Montant (€)" |
| Status labels | One word, adjectives/past participles | "Payée", "En attente", "Échouée" |
| Tooltips | ≤ 1 sentence, never essential info | "Part des visiteurs qui commandent." |
| Placeholders | Example format only, never the label | "ex. marie@exemple.fr" |

General: sentence case (not Title Case, not ALL CAPS); plain words over jargon; active voice; the user's language and register (French: "vous" by default in B2B); no exclamation marks in errors; avoid "Cliquez ici".

## 5. Formats (apply consistently; follow the user's locale)

- **Numbers**: locale separators (fr-FR: `12 480,5`; en-US: `12,480.5`), `tabular-nums`, use `Intl.NumberFormat`.
- **Currency**: symbol + ISO consistency, e.g. `1 249,00 €`.
- **Percent**: one decimal max, sign on deltas (`+12,4 %`; fr uses a non-breaking space before `%`).
- **Dates**: absolute in tables (`12 sept. 2026`), relative for recency (`il y a 5 min`) with absolute in `title`; ISO in data/API only.
- **Large numbers**: compact above 10 000 in tight spaces (`12,4 k`, `3,2 M`).
- **Missing data**: `—`, never `0`, `null` or `N/A` without reason.

## 6. States copy

### Empty

Structure: **what is empty** + **why/what to do** + **action**.
- First use: "Aucun projet pour l'instant. Créez votre premier projet pour suivre son avancement." [Créer un projet]
- No results: "Aucun résultat pour « paiement »." + "Vérifiez l'orthographe ou retirez des filtres." [Réinitialiser les filtres]
- No permission: "Vous n'avez pas accès à cette section." + [Demander l'accès]

### Error

Structure: **what happened** + **what to do** (+ reference if support needed). Never blame the user, never show stack traces.
- "Impossible de charger les commandes. Vérifiez votre connexion et réessayez." [Réessayer]
- Form: "Le mot de passe doit contenir au moins 8 caractères."

### Loading

Skeletons shaped like the final content; text only for long operations ("Génération du rapport… cela peut prendre une minute").

### Success

Short, past-tense, specific: "Facture envoyée à Léa Bernard." Offer undo or next step when relevant.

## 7. Realistic sample content

When building without real data:
- Use plausible names, amounts, dates relative to today, and consistent totals (KPI = sum of table rows when visible).
- Include variety (some failures, some pending) and at least one long value to test truncation.
- Never use Lorem ipsum, "Foo/Bar", "Item 1", "Test".

## 8. Content checklist (quick)

- [ ] Each block answers a question and has a next step.
- [ ] Period, unit and comparison are stated.
- [ ] Buttons are verb + object; destructive ones are explicit.
- [ ] Empty/error/loading copy exists for every data block.
- [ ] Formats and language are consistent across the page.

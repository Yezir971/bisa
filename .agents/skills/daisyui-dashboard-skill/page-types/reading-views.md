# Page types: Reading views (list, detail, report)

Pages where the user **reads, scans, searches and drills down** more than they edit.

## A. List / index view

**Skeleton**
```
[Header: title + count · primary action ("Nouveau …")]
[Toolbar: search · filters · sort · view toggle]
[Active filters chips]
[Table or list]
[Footer: range · pagination]
```
Blocks: `block-patterns/tables.md` (+ navigation pagination). 
- Show total count in the header ("Clients · 238").
- Persist filters/sort/page in the URL query string.
- Row → detail view (identifier is a link).
- Provide empty states for first use vs no results (see `content-strategy/`).

## B. Detail view

**Skeleton**
```
[Breadcrumb]
[Header: name + status badge · actions (primary + dropdown for the rest)]
[Summary strip: 3–5 key facts (stats or definition list)]
[Tabs: Aperçu · Activité · Documents · Paramètres]
[Tab content: 2-column layout — main (2/3) + side metadata (1/3)]
```

```html
<header class="flex flex-wrap items-start justify-between gap-3">
  <div>
    <div class="breadcrumbs text-sm"><ul><li><a>Commandes</a></li><li>#1042</li></ul></div>
    <h1 class="text-2xl font-semibold flex items-center gap-2">Commande #1042
      <span class="badge badge-success badge-soft">Payée</span></h1>
  </div>
  <div class="flex gap-2">
    <button class="btn btn-sm btn-primary">Envoyer la facture</button>
    <div class="dropdown dropdown-end">
      <button tabindex="0" class="btn btn-sm btn-square btn-ghost" aria-label="Plus d'actions">⋯</button>
      <ul tabindex="0" class="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-30 w-48 p-1 shadow-sm">
        <li><a>Dupliquer</a></li><li><a class="text-error">Annuler la commande</a></li>
      </ul>
    </div>
  </div>
</header>
```

Key facts as a definition list:

```html
<dl class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
  <div><dt class="text-base-content/60">Client</dt><dd class="font-medium">Léa Bernard</dd></div>
  <div><dt class="text-base-content/60">Montant</dt><dd class="font-medium tabular-nums">129,90 €</dd></div>
</dl>
```

- Timeline/activity: `timeline` or `list`, newest first, relative time.
- Related items as small tables with "Voir tout".
- Read-only by default; edit via explicit "Modifier" (inline or modal), not always-open inputs.

## C. Report view

For analytical or printable content: header with period + export; sticky filters; narrative summary ("Les ventes progressent de 12 %…") above charts; charts + data table fallback; footnotes with methodology and source; print styles (`print:hidden` for nav/toolbars).

## Acceptance criteria
- [ ] User can find an item in ≤ 3 interactions (search, filter, sort).
- [ ] Identifier, status and the key number are visible without opening the item.
- [ ] Back navigation restores filters/scroll.
- [ ] Long text is truncated or wrapped gracefully; long tables scroll inside their container.
- [ ] Readable: line length ≤ ~75 characters for prose; `text-sm` minimum for data.

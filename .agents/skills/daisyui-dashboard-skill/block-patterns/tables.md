# Table blocks

## Data table with toolbar

```html
<section class="card bg-base-100 border border-base-300" aria-labelledby="orders-title">
  <div class="card-body p-0">

    <!-- Toolbar -->
    <header class="flex flex-wrap items-center gap-2 p-4 border-b border-base-300">
      <h2 id="orders-title" class="card-title text-base mr-auto">Commandes récentes</h2>

      <label class="input input-sm w-full sm:w-56">
        <svg class="size-4 opacity-60" aria-hidden="true">…</svg>
        <input type="search" class="grow" placeholder="Rechercher une commande" aria-label="Rechercher une commande" />
      </label>

      <select class="select select-sm w-auto" aria-label="Filtrer par statut">
        <option value="">Tous les statuts</option>
        <option>Payée</option><option>En attente</option><option>Échouée</option>
      </select>

      <button class="btn btn-sm btn-primary">Nouvelle commande</button>
    </header>

    <!-- Table -->
    <div class="overflow-x-auto max-h-[28rem]">
      <table class="table table-sm table-pin-rows hover">
        <caption class="sr-only">Liste des commandes récentes</caption>
        <thead>
          <tr class="bg-base-200">
            <th scope="col"><input type="checkbox" class="checkbox checkbox-sm" aria-label="Tout sélectionner" /></th>
            <th scope="col">N°</th>
            <th scope="col">Client</th>
            <th scope="col">Statut</th>
            <th scope="col" class="text-right">Montant</th>
            <th scope="col">Date</th>
            <th scope="col"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="checkbox" class="checkbox checkbox-sm" aria-label="Sélectionner la commande 1042" /></td>
            <th scope="row" class="font-medium">#1042</th>
            <td>
              <div class="flex items-center gap-3">
                <div class="avatar avatar-placeholder"><div class="bg-neutral text-neutral-content w-8 rounded-full"><span class="text-xs">LB</span></div></div>
                <div><div class="font-medium">Léa Bernard</div><div class="text-xs text-base-content/60">lea@exemple.fr</div></div>
              </div>
            </td>
            <td><span class="badge badge-success badge-soft badge-sm">Payée</span></td>
            <td class="text-right tabular-nums">129,90 €</td>
            <td class="text-base-content/70">12 sept. 2026</td>
            <td class="text-right">
              <div class="dropdown dropdown-end">
                <button tabindex="0" class="btn btn-ghost btn-xs btn-square" aria-label="Actions pour la commande 1042">⋯</button>
                <ul tabindex="0" class="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-30 w-40 p-1 shadow-sm">
                  <li><a>Voir</a></li><li><a>Modifier</a></li><li><a class="text-error">Supprimer</a></li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <footer class="flex flex-wrap items-center justify-between gap-2 p-4 border-t border-base-300 text-sm">
      <span class="text-base-content/70">1–20 sur 238</span>
      <nav class="join" aria-label="Pagination">…</nav>
    </footer>
  </div>
</section>
```

## Rules

- Columns: max 6–7 visible; identifier first, status next, numbers right-aligned, actions last. Hide secondary columns on small screens (`hidden md:table-cell`).
- Header: `table-pin-rows` for long tables; sortable headers are `<button>` with `aria-sort` on `th`.
- Density: `table-sm` by default in dashboards; `table-zebra` only for dense data with no row hover.
- Truncate long text (`truncate max-w-xs`) and expose the full value via `title`.
- Dates in one consistent format; relative time ("il y a 2 h") with full date in `title`/`<time datetime>`.
- Row click: either the whole row is a link, or only the identifier is. Never both.
- Selection + **bulk actions**: when ≥ 1 row selected, replace toolbar with "N sélectionnés" + actions (`btn-sm`), plus a "Désélectionner" link.
- Destructive row actions: confirm in a modal naming the item.

## States

```html
<!-- Loading: 5 skeleton rows -->
<tr><td colspan="7"><div class="skeleton h-5 w-full"></div></td></tr>

<!-- Empty -->
<tr><td colspan="7" class="py-12 text-center">
  <p class="font-medium">Aucune commande ne correspond à vos filtres</p>
  <button class="btn btn-sm btn-ghost mt-2">Réinitialiser les filtres</button>
</td></tr>
```

Error: `alert alert-error alert-soft` above the table with a "Réessayer" button; keep the toolbar visible.

## Mobile (< 640 px)

Option A (default): keep `overflow-x-auto`, pin the first column with `table-pin-cols`.
Option B (few columns, rich rows): render as a list of cards:

```html
<ul class="list bg-base-100 rounded-box border border-base-300 sm:hidden">
  <li class="list-row">
    <div class="list-col-grow">
      <div class="font-medium">#1042 · Léa Bernard</div>
      <div class="text-xs text-base-content/60">12 sept. 2026</div>
    </div>
    <span class="badge badge-success badge-soft badge-sm self-center">Payée</span>
    <span class="tabular-nums self-center">129,90 €</span>
  </li>
</ul>
```

## Active filters

```html
<div class="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-base-300 text-sm">
  <span class="text-base-content/60">Filtres :</span>
  <button class="badge badge-soft badge-primary gap-1">Statut : Payée <span aria-hidden="true">✕</span><span class="sr-only">Retirer le filtre</span></button>
  <button class="btn btn-ghost btn-xs">Tout effacer</button>
</div>
```

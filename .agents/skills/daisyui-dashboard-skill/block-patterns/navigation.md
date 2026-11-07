# Navigation blocks

## Sidebar menu (inside `drawer-side` of the shell)

```html
<aside class="bg-base-100 border-r border-base-300 min-h-full w-64 flex flex-col">
  <a href="/" class="flex items-center gap-2 px-4 h-16 font-bold text-lg">
    <span class="size-8 rounded-lg bg-primary text-primary-content grid place-items-center">A</span>
    Acme
  </a>

  <nav aria-label="Navigation principale" class="flex-1 overflow-y-auto">
    <ul class="menu w-full gap-1 px-2">
      <li><a class="menu-active" aria-current="page"><svg class="size-4" aria-hidden="true">…</svg>Tableau de bord</a></li>
      <li><a><svg class="size-4" aria-hidden="true">…</svg>Commandes
        <span class="badge badge-sm badge-primary">12</span></a></li>

      <li class="menu-title mt-4">Gestion</li>
      <li><a>Clients</a></li>
      <li>
        <details>
          <summary>Produits</summary>
          <ul>
            <li><a>Catalogue</a></li>
            <li><a>Stocks</a></li>
          </ul>
        </details>
      </li>

      <li class="menu-title mt-4">Compte</li>
      <li><a>Paramètres</a></li>
    </ul>
  </nav>

  <div class="p-2 border-t border-base-300">
    <!-- user card / dropdown -->
  </div>
</aside>
```

Rules:
- Group with `menu-title` (max ~4 groups, ~7 items each); one level of nesting max.
- Active item: `menu-active` + `aria-current="page"`.
- Badges only for counts that require attention.
- Collapsed rail variant (icons only, desktop): `menu menu-lg` with `tooltip tooltip-right` + `aria-label` on each link.

## Navbar (top bar)

```html
<header class="navbar bg-base-100 border-b border-base-300 sticky top-0 z-10 gap-2">
  <div class="flex-1 flex items-center gap-2">
    <!-- Breadcrumbs -->
    <div class="breadcrumbs text-sm hidden sm:block">
      <ul><li><a>Accueil</a></li><li><a>Commandes</a></li><li>#1042</li></ul>
    </div>
  </div>

  <!-- Search -->
  <label class="input input-sm hidden md:flex w-64">
    <svg class="size-4 opacity-60" aria-hidden="true">…</svg>
    <input type="search" class="grow" placeholder="Rechercher…" aria-label="Rechercher" />
    <kbd class="kbd kbd-sm">⌘K</kbd>
  </label>

  <!-- Notifications -->
  <button class="btn btn-ghost btn-circle btn-sm" aria-label="Notifications (3 non lues)">
    <div class="indicator"><svg class="size-5" aria-hidden="true">…</svg>
      <span class="badge badge-xs badge-primary indicator-item"></span></div>
  </button>

  <!-- User menu -->
  <div class="dropdown dropdown-end">
    <button tabindex="0" class="btn btn-ghost btn-circle avatar avatar-placeholder" aria-label="Menu utilisateur">
      <div class="bg-neutral text-neutral-content w-8 rounded-full"><span class="text-xs">MD</span></div>
    </button>
    <ul tabindex="0" class="menu dropdown-content bg-base-100 border border-base-300 rounded-box z-30 w-52 p-2 shadow-sm">
      <li class="menu-title">marie@acme.io</li>
      <li><a>Profil</a></li>
      <li><a>Paramètres</a></li>
      <li><a class="text-error">Se déconnecter</a></li>
    </ul>
  </div>
</header>
```

## Section tabs (sub-navigation inside a page)

```html
<div role="tablist" class="tabs tabs-border">
  <a role="tab" class="tab tab-active" aria-selected="true">Vue d'ensemble</a>
  <a role="tab" class="tab">Activité</a>
  <a role="tab" class="tab">Paramètres</a>
</div>
```

Use tabs for views of the **same object**; use the sidebar for **different areas**. Max 5–6 tabs.

## Pagination

```html
<nav class="join" aria-label="Pagination">
  <button class="join-item btn btn-sm" aria-label="Page précédente">«</button>
  <button class="join-item btn btn-sm btn-active" aria-current="page">1</button>
  <button class="join-item btn btn-sm">2</button>
  <button class="join-item btn btn-sm">3</button>
  <button class="join-item btn btn-sm btn-disabled">…</button>
  <button class="join-item btn btn-sm">12</button>
  <button class="join-item btn btn-sm" aria-label="Page suivante">»</button>
</nav>
```

Always show the range ("1–20 sur 238") next to pagination.

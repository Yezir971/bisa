# Page type: Settings

**Purpose**: let the user configure their profile, workspace and preferences safely and predictably.

## Skeleton

Desktop: secondary navigation on the left (or tabs on top), content on the right (`max-w-2xl`). Mobile: tabs become a `select` or a list page leading to subpages.

```html
<main class="p-4 lg:p-6 max-w-5xl w-full mx-auto space-y-6">
  <header>
    <h1 class="text-2xl font-semibold">Paramètres</h1>
    <p class="text-sm text-base-content/70">Gérez votre compte et votre espace de travail.</p>
  </header>

  <div class="grid gap-6 md:grid-cols-[14rem_1fr]">
    <nav aria-label="Sections des paramètres">
      <ul class="menu bg-base-100 border border-base-300 rounded-box w-full gap-1">
        <li><a class="menu-active" aria-current="page">Profil</a></li>
        <li><a>Sécurité</a></li>
        <li><a>Notifications</a></li>
        <li><a>Équipe</a></li>
        <li><a>Facturation</a></li>
      </ul>
    </nav>

    <div class="space-y-6">
      <!-- one card per topic: see block-patterns/forms.md "Settings-style form" -->
      <!-- danger zone last -->
    </div>
  </div>
</main>
```

## Content structure
1. **Profile** (name, avatar, language, timezone)
2. **Security** (password, 2FA, sessions)
3. **Notifications** (matrix of event × channel with `toggle`)
4. **Team** (members table: role `select`, invite modal, remove with confirmation)
5. **Billing** (plan card, usage `progress`, invoices table)
6. **Danger zone**: separate `card border-error/40`, explicit buttons ("Supprimer mon compte").

```html
<section class="card bg-base-100 border border-error/40 max-w-2xl">
  <div class="card-body gap-3">
    <h2 class="card-title text-error">Zone de danger</h2>
    <p class="text-sm text-base-content/70">La suppression du compte est définitive et efface toutes vos données.</p>
    <div class="card-actions"><button class="btn btn-error btn-outline">Supprimer mon compte</button></div>
  </div>
</section>
```

## Save model — pick one and be consistent
- **Explicit save** per card (default): "Enregistrer" + "Annuler"; disabled until a change is made; toast on success.
- **Auto-save** for toggles only: apply immediately, confirm with a subtle toast or inline "Enregistré".
Never mix both in the same card.

## Guidelines
- Group by user goal, not by technical category; one card = one topic with a title and a one-line description.
- Sensible defaults; explain consequences next to risky options.
- Sensitive changes (password, email, delete) require re-authentication or confirmation.
- Show current state clearly (what is enabled now), not only controls.
- Permissions: read-only fields with explanation, not hidden controls.

## Acceptance criteria
- [ ] Every field has label, helper text where needed, inline validation.
- [ ] Unsaved-changes warning on navigation.
- [ ] Destructive actions isolated and confirmed in a modal.
- [ ] Settings are reachable and usable on mobile.

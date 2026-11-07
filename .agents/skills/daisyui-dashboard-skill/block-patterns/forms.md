# Form blocks (daisyUI 5)

## Field anatomy

```html
<fieldset class="fieldset">
  <legend class="fieldset-legend">Adresse e-mail</legend>
  <input type="email" class="input validator w-full" placeholder="vous@exemple.fr" required />
  <p class="validator-hint hidden">Saisissez une adresse e-mail valide.</p>
  <p class="label">Nous ne l'utiliserons que pour les notifications.</p>
</fieldset>
```

- One `fieldset` per field (or per logical group with a group `legend`).
- Label ALWAYS visible (`fieldset-legend` or `label`), never placeholder-only.
- Helper text in `label` below the input; error in `validator-hint` (shown automatically on invalid state).
- Mark required fields in text ("(obligatoire)") or mark optional ones ("(facultatif)"), consistently.
- Inputs `w-full` inside forms, `input-sm` in toolbars/filters.

## Controls cheatsheet

| Need | Component |
|---|---|
| Short text | `input` (+ `validator`) |
| Long text | `textarea` |
| One of ≤ 4 options, all visible | `radio` group or `join` of `btn` |
| One of many | `select` |
| On/off setting applied immediately | `toggle` |
| Yes/no in a form submitted later | `checkbox` |
| Several options | `checkbox` group |
| Date / file / range | `input type=date`, `file-input`, `range` |
| Input with prefix/suffix | `<label class="input">` wrapping `<span class="label">` |

```html
<label class="input w-full">
  <span class="label">https://</span>
  <input type="text" placeholder="monsite.fr" />
</label>
```

## Settings-style form (sections in cards)

```html
<form class="card bg-base-100 border border-base-300 max-w-2xl">
  <div class="card-body gap-4">
    <header>
      <h2 class="card-title">Profil</h2>
      <p class="text-sm text-base-content/70">Ces informations sont visibles par votre équipe.</p>
    </header>

    <div class="grid gap-4 sm:grid-cols-2">
      <fieldset class="fieldset"><legend class="fieldset-legend">Prénom</legend><input class="input w-full" required /></fieldset>
      <fieldset class="fieldset"><legend class="fieldset-legend">Nom</legend><input class="input w-full" required /></fieldset>
    </div>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Fuseau horaire</legend>
      <select class="select w-full"><option>Europe/Paris</option></select>
    </fieldset>

    <div class="card-actions justify-end border-t border-base-300 pt-4">
      <button type="reset" class="btn btn-ghost">Annuler</button>
      <button type="submit" class="btn btn-primary">Enregistrer</button>
    </div>
  </div>
</form>
```

## Modal form

```html
<dialog id="create-modal" class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-semibold">Inviter un membre</h3>
    <form method="dialog" class="mt-4 space-y-4">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">E-mail</legend>
        <input type="email" class="input w-full" required />
      </fieldset>
      <div class="modal-action">
        <button class="btn btn-ghost" value="cancel">Annuler</button>
        <button class="btn btn-primary" value="confirm">Envoyer l'invitation</button>
      </div>
    </form>
  </div>
  <form method="dialog" class="modal-backdrop"><button aria-label="Fermer">close</button></form>
</dialog>
```
Open with `document.getElementById('create-modal').showModal()`.

### Destructive confirmation

```html
<dialog id="delete-modal" class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-semibold">Supprimer « Projet Alpha » ?</h3>
    <p class="py-3 text-sm text-base-content/70">Cette action est définitive : 14 tâches et 3 fichiers seront supprimés.</p>
    <div class="modal-action">
      <form method="dialog" class="flex gap-2">
        <button class="btn btn-ghost">Conserver</button>
        <button class="btn btn-error">Supprimer le projet</button>
      </form>
    </div>
  </div>
</dialog>
```

## Validation & feedback

- Validate on blur and on submit; show the error next to the field, in plain words with the fix ("Le mot de passe doit contenir au moins 8 caractères").
- Don't disable the submit button for invalid state; do disable + `loading loading-spinner` during submission.
- On success: `toast` with `alert alert-success` (auto-hide ≈ 4–5 s, `role="status"`), and keep the user in context.
- On server error: top-of-form `alert alert-error alert-soft`, keep entered values.
- Unsaved changes: warn before leaving.

## Filters form (compact)

```html
<form class="flex flex-wrap items-end gap-2">
  <fieldset class="fieldset"><legend class="fieldset-legend text-xs">Période</legend>
    <select class="select select-sm"><option>30 jours</option></select></fieldset>
  <fieldset class="fieldset"><legend class="fieldset-legend text-xs">Statut</legend>
    <select class="select select-sm"><option>Tous</option></select></fieldset>
  <button class="btn btn-sm btn-primary">Appliquer</button>
  <button type="reset" class="btn btn-sm btn-ghost">Réinitialiser</button>
</form>
```

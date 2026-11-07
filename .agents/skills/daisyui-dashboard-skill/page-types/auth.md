# Page type: Auth (login, sign-up, reset, 2FA)

**Purpose**: get the user into the product quickly, securely, with minimal friction. No sidebar/navbar.

## Layout: centered card

```html
<main class="min-h-screen grid place-items-center bg-base-200 p-4">
  <div class="w-full max-w-sm space-y-6">
    <a href="/" class="flex items-center justify-center gap-2 font-bold text-xl">
      <span class="size-9 rounded-lg bg-primary text-primary-content grid place-items-center">A</span> Acme
    </a>

    <form class="card bg-base-100 border border-base-300 shadow-sm" novalidate>
      <div class="card-body gap-4">
        <header class="text-center">
          <h1 class="text-2xl font-semibold">Connexion</h1>
          <p class="text-sm text-base-content/70">Accédez à votre tableau de bord.</p>
        </header>

        <div role="alert" class="alert alert-error alert-soft hidden" id="form-error">
          <span>E-mail ou mot de passe incorrect.</span>
        </div>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Adresse e-mail</legend>
          <input type="email" class="input validator w-full" autocomplete="email" required autofocus />
          <p class="validator-hint hidden">Saisissez une adresse e-mail valide.</p>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">
            <span>Mot de passe</span>
          </legend>
          <input type="password" class="input validator w-full" autocomplete="current-password" required minlength="8" />
          <p class="validator-hint hidden">8 caractères minimum.</p>
          <a href="/forgot" class="link link-hover text-sm self-end">Mot de passe oublié ?</a>
        </fieldset>

        <label class="label cursor-pointer justify-start gap-2">
          <input type="checkbox" class="checkbox checkbox-sm" /> Rester connecté
        </label>

        <button class="btn btn-primary w-full" type="submit">Se connecter</button>

        <div class="divider text-xs">ou</div>
        <button type="button" class="btn w-full">Continuer avec Google</button>
      </div>
    </form>

    <p class="text-center text-sm text-base-content/70">Pas encore de compte ? <a class="link link-primary" href="/signup">Créer un compte</a></p>
  </div>
</main>
```

Split layout variant (marketing/brand side): `grid lg:grid-cols-2`, form column on one side, brand panel `bg-primary text-primary-content hidden lg:flex` on the other.

## Variants
- **Sign-up**: ask the minimum (e-mail + password, name optional); show password rules live; terms checkbox links to the policies.
- **Forgot password**: one field, neutral confirmation ("Si un compte existe, un e-mail vient d'être envoyé.") to avoid account enumeration.
- **Reset password**: new password + confirmation, strength hint, success → redirect to login with toast.
- **2FA**: 6 separate numeric inputs or one input with `inputmode="numeric" autocomplete="one-time-code"`; resend link with countdown.

## Guidelines
- Correct `type` and `autocomplete` (`username`, `email`, `current-password`, `new-password`, `one-time-code`) so password managers work; allow paste.
- Offer a show/hide password toggle with `aria-pressed` and label.
- Button says what happens ("Se connecter", "Créer mon compte"), shows `loading loading-spinner` while submitting, prevents double submit.
- Errors: generic for credentials ("E-mail ou mot de passe incorrect"), specific for format; focus the first invalid field; `role="alert"`.
- Rate limit / lock messages explain the wait time.
- No distractions: no navigation, max one secondary link; keep it under one viewport height.

## Acceptance criteria
- [ ] Completable with keyboard only (Enter submits).
- [ ] Autofill/password manager work; autofocus on first field.
- [ ] Error, loading, success states exist; no credential leakage in messages.
- [ ] Looks right in light and dark themes and at 375 px.

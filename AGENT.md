# Directives de Développement & Règles pour Agents (AGENT.md)

Ce document constitue la charte technique, méthodologique et architecturale stricte pour tout agent d'intelligence artificielle ou développeur intervenant sur ce projet d'application de gestion de projet type **Jira**.

---

## 1. Principes Fondamentaux d'Ingénierie Logicielle

Tout code produit doit rigoureusement respecter les principes suivants :

### 1.1 TDD (Test-Driven Development)
Le projet applique la discipline **Red-Green-Refactor** :
1. **Red** : Écrire d'abord le test unitaire ou d'intégration décrivant le comportement attendu avant d'écrire l'implémentation. Le test doit échouer pour la bonne raison.
2. **Green** : Écrire le code le plus simple possible pour faire passer le test avec succès.
3. **Refactor** : Nettoyer le code, éliminer la duplication et améliorer la structure sans altérer le comportement vérifié par les tests.

**Règles de tests** :
- Outils : **Vitest** pour les tests unitaires et d'intégration, **React Testing Library** pour les composants UI, **Playwright** pour les scénarios E2E critiques (ex: glisser-déposer sur le tableau Kanban, clôture de sprint).
- Co-localisation : Les fichiers de test doivent être placés à côté du fichier testé (`mon-composant.tsx` -> `mon-composant.test.tsx`, `issue-service.ts` -> `issue-service.test.ts`).
- Couverture ciblée : Les règles métier complexes (transitions de statuts, calcul de burndown, ordonnancement LexoRank, projection de graphe) doivent atteindre une couverture de tests de 100%.

### 1.2 KISS (Keep It Simple, Stupid)
- Préférer la solution la plus directe, lisible et maintenable.
- Éviter l'anticipation excessive de besoins hypothétiques (*YAGNI - You Aren't Gonna Need It*).
- Ne pas introduire de bibliothèques tierces superflues lorsque le standard Web ou une classe daisyUI native résout déjà le problème.
- Structurer les composants en sous-arbres compacts et intelligibles.

### 1.3 DRY (Don't Repeat Yourself)
- **Source unique de vérité pour la validation** : Les schémas **Zod** définis dans `src/lib/validations/` servent à la fois pour le typage TypeScript (via `z.infer`), la validation côté client dans les formulaires et la validation stricte des Server Actions.
- **Composants d'interface réutilisables** : Encapsuler les motifs répétitifs (ex: `IssueBadge`, `StatusDropdown`, `UserAvatar`, `MetricCard`) sans dupliquer les classes daisyUI.
- **Logique métier centralisée** : Factoriser les calculs récurrents (ex: formatage des dates avec `Intl`, conversions de points, filtres de permissions) dans des modules utilitaires purs.

### 1.4 Principes SOLID
L'architecture de code doit respecter les cinq principes SOLID :
- **S - Single Responsibility Principle (Responsabilité Unique)** :
  - Un composant UI n'effectue pas de requêtes SQL directes ; il délègue à une Server Action.
  - Une Server Action ne contient pas de logique algorithmique complexe ; elle valide l'entrée (Zod), appelle le *Service de Domaine*, et déclenche `revalidatePath()`.
  - Un *Repository* ne gère que les interactions de persistance avec la base de données.
- **O - Open/Closed Principle (Ouvert à l'extension, fermé à la modification)** :
  - Les types d'issues (`EPIC`, `STORY`, `TASK`, `BUG`, `SUBTASK`) et les types de nœuds du graphe relationnel doivent pouvoir être étendus sans refactoriser tout le moteur de rendu.
  - Le système de rendu de graphiques et de nœuds s'appuie sur des tables de correspondances configurables (registries).
- **L - Liskov Substitution Principle (Substitution de Liskov)** :
  - Les abstractions de stockage (ex: `StorageService` pour Vercel Blob ou S3) ou de base de données doivent être interchangeables via une interface commune sans altérer le fonctionnement applicatif.
- **I - Interface Segregation Principle (Ségrégation des Interfaces)** :
  - Définir des interfaces précises et minimales plutôt que des interfaces monolithiques (ex: `CanAssignIssue`, `CanTransitionStatus` plutôt qu'une interface `JiraGodObject`).
- **D - Dependency Inversion Principle (Inversion des Dépendances)** :
  - Les services de domaine dépendent d'interfaces et de contrats de persistance, non de l'implémentation concrète de l'ORM.

---

## 2. Règles daisyUI 5 & Tailwind CSS 4 (Non négociables)

Tout développement d'interface doit scrupuleusement respecter le guide de référence [**`DESIGN.md`**](file:///C:/Users/james/OneDrive/Documents/1AA-M1/bisa/DESIGN.md).

### 2.1 Tokens Sémantiques Obligatoires
Toutes les couleurs de fond, de bordure et de texte doivent employer les tokens sémantiques daisyUI :

| Usage | Classes autorisées | Interdit |
|---|---|---|
| Fond de carte / panneau / modal | `bg-base-100` | `bg-white`, `bg-[#fff]`, `bg-gray-50` |
| Fond de page / table header | `bg-base-200` | `bg-gray-100`, `bg-slate-100` |
| Bordures & séparateurs | `border-base-300`, `divide-base-300` | `border-gray-200`, `border-slate-300` |
| Texte principal | `text-base-content` | `text-black`, `text-gray-900` |
| Texte secondaire / discret | `text-base-content/70`, `text-base-content/60` | `text-gray-500`, `text-slate-400` |
| Action principale | `btn-primary` (1 seul par vue) | Boutons primaires multiples |
| Alertes & Statuts | `alert-info`, `alert-success`, `alert-warning`, `alert-error` | Couleurs inventées en dur |

### 2.2 Évolution daisyUI v4 vers v5
- **Formulaires** : Utiliser `<fieldset class="fieldset">`, `<legend class="fieldset-legend">` et `<label class="label">` (la classe v4 `form-control` est bannie).
- **Champs de saisie** : Les inputs sont bordés par défaut. Ne jamais utiliser `input-bordered`. Pour retirer la bordure, utiliser `input-ghost`.
- **Boutons & Badges adoucis** : Utiliser `btn-soft`, `badge-soft`, `alert-soft`.
- **Onglets** : Utiliser `tabs-box`, `tabs-border`, `tabs-lift` (au lieu de `tabs-boxed`).
- **Menus actifs** : Utiliser `menu-active` (au lieu de `active`).
- **Configuration** : Il n'y a **aucun fichier `tailwind.config.js`** en Tailwind 4. Toute la configuration réside dans `globals.css` via `@import "tailwindcss";` et `@plugin "daisyui";`.

### 2.3 Densité & Ergonomie
- Privilégier une densité élevée adaptée aux outils professionnels : `btn-sm`, `input-sm`, `select-sm`, `table-sm`, `badge-sm`.
- Regrouper systématiquement les commandes connexes à l'aide du composant `join`.
- Utiliser la balise native `<dialog class="modal">` pour toutes les modales, et `<details class="dropdown">` pour les menus contextuels.

### 2.4 La Règle des 4 États
Chaque carte, composant ou vue de données doit obligatoirement implémenter 4 états distincts :
1. **Loading** : Composant `skeleton` daisyUI épousant la géométrie finale.
2. **Empty** : Message explicite, icône et action principale de déblocage. Jamais de tableau vide silencieux ni de graphique plat avec des zéros.
3. **Error** : Bannière `alert alert-error alert-soft` avec libellé compréhensible et bouton de réessai (`btn-outline`).
4. **Loaded** : Affichage optimal des données avec animations douces.

### 2.5 Zéro Alert / Confirm JS Brut : Système Exclusif de Toasts & Modales Stylisées
- **Interdiction formelle de `window.alert()`, `window.confirm()` et `window.prompt()`** : Tout agent surpris à utiliser une alerte ou confirmation native du navigateur viole les standards du projet.
- **Gestion des erreurs et notifications via Toasts daisyUI 5** :
  - Tout feedback utilisateur (succès, échec de mutation, avertissement de limite WIP, erreur réseau) passe par le composant global `ToastProvider` / hook `useToast()`.
  - Affichage dans le conteneur `<div class="toast toast-bottom toast-end z-50">` avec les classes sémantiques `alert alert-{error|success|warning|info} alert-soft shadow-lg border border-base-300`.
- **Boîtes de confirmation & Pop-ups stylisées** :
  - Toute confirmation d'action destructive (suppression de ticket, révocation de membre, clôture de sprint) doit obligatoirement être orchestrée par un composant `<dialog class="modal">` daisyUI 5 stylisé (`modal-box bg-base-100 border border-base-300`, titre clair, bouton d'annulation `btn-ghost`, bouton d'action contextuel `btn-error` ou `btn-primary`).

### 2.6 100% daisyUI-First : Skeletons & Loaders Natifs Exclusifs
- **Tout le design repose impérativement sur daisyUI 5** : Tailwind CSS 4 ne sert qu'à la disposition (`flex`, `grid`, `gap`, `p`). Il est interdit de styliser manuellement ce que daisyUI propose déjà.
- **Skeletons obligatoires pour le contenu en chargement** : Tout composant de données en cours de chargement doit afficher la classe `skeleton` daisyUI épousant fidèlement la géométrie finale (cartes Kanban, tableaux de bord, graphiques) pour éliminer le CLS.
- **Loaders obligatoires pour les actions asynchrones** : Tout bouton en cours de mutation ou indicateur de traitement doit utiliser le composant `<span class="loading loading-spinner loading-xs"></span>` (ou `loading-dots`, `loading-ring`). Bannissement strict de tout spinner SVG artisanal ou GIF de chargement.

---

## 3. Directives Spécifiques : Vue Graphique & Globe (Inspiration Obsidian)

Le projet propose une vue réseau globale interactive représentant les liens entre Projets, Epics, Tâches et Dépendances (type graphe de connaissances Obsidian) :

1. **Rendu Haute Performance (Canvas 2D / WebGL)** :
   - Ne jamais générer des centaines d'éléments DOM individuels pour les nœuds du graphe.
   - Utiliser un rendu Canvas HTML5 ou WebGL avec moteur force-directed (ex: `d3-force` ou `force-graph` / `3d-force-graph`).
   - Assurer un rafraîchissement à 60 FPS lors du zoom, pan et drag des nœuds.
2. **Harmonie avec les Thèmes daisyUI** :
   - Les couleurs des nœuds et des liens doivent être extraites dynamiquement via le helper `dc.color()` :
     - Projets : `dc.color('primary')`
     - Epics : `dc.color('secondary')`
     - Tâches / Stories : `dc.color('info')`
     - Bugs : `dc.color('error')`
     - Éléments terminés : `dc.color('success')`
     - Liens / Dépendances : `dc.color('base-300')` (ou `error` avec tirets pour les blocages `BLOCKS`).
   - Le graphe doit réagir instantanément au changement d'attribut `data-theme` sans réinitialiser la position physique des nœuds.
3. **Interactivité & Ergonomie** :
   - Survol d'un nœud : mise en surbrillance (halo) des connexions directes et atténuation des nœuds non liés.
   - Clic sur un nœud : ouverture immédiate d'un panneau latéral drawer ou modale daisyUI affichant le détail du ticket / projet.
   - Contrôles d'affichage : Barre d'outils flottante (`join`) permettant de commuter entre mode **2D Force-Directed** et mode **Globe 3D Sphérique**, de filtrer par projet/type et de régler la force de répulsion.

---

## 4. Règles d'Intégration des Graphiques (`daisyui-charts`)

Pour les métriques Jira (Burndown, Vélocité, Flux Cumulé, Répartition) :
1. **Utilisation exclusive du Helper `dc`** (`references/theme-helper.md`) :
   - Couleurs extraites de `dc.color('primary')`, `dc.color('base-300')`, `dc.alpha('primary', 20)`.
   - **Interdiction formelle de coder des codes HEX (`#3b82f6`) ou RGB en dur.**
2. **Réactivité au Changement de Thème** :
   - Les graphiques écoutent les mutations de `data-theme` sur `<html>` et se redessinent sans recharger la page.
3. **Conteneur & Dimensions** :
   - Conteneur avec classe `relative` et hauteur explicite (ex: `h-64`), avec `maintainAspectRatio: false`.
4. **Accessibilité** :
   - Attributs `role="img"` et `aria-label` descriptif obligatoire sur chaque balise `<canvas>`.

---

## 5. Architecture Next.js & Base de Données

### 5.1 Séparation Server / Client Components
- **Server Components (RSC) par défaut** : Pages, layouts, requêtes initiales de lecture, métadonnées.
- **Client Components (`"use client"`) réservés à l'interactivité** :
  - Glisser-déposer Kanban (`@dnd-kit`).
  - Toasts et contrôleurs de modales.
  - Composant de graphe Canvas/WebGL (`ObsidianGraph`).
  - Wrapper graphique Chart.js (`DaisyChart`).
  - Sélecteur de thème avec prévisualisation.
- **Server Actions pour les mutations** :
  - Validation préalable avec schéma **Zod**.
  - Invalidation fine du cache via `revalidatePath` ou `revalidateTag`.

### 5.2 Multi-Tenancy & Sécurité PostgreSQL (Neon)
- **Isolation stricte** : Chaque table métier contient une colonne `workspaceId`.
- **Contrôle d'accès préalable** : Toute Server Action ou lecture vérifie impérativement les droits de session sur le `workspaceId` cible.
- **Connection Pooling Serverless** : Utiliser la chaîne de connexion poolée Neon (avec le port 6543) pour prévenir tout épuisement de sockets sur Vercel Serverless.

---

## 6. Gestion du Thème de l'Application

1. **Mécanisme d'application** : Attribut `data-theme="nom-du-theme"` sur `<html>`.
2. **Prévention du scintillement (FOUC)** : Script inline minuscule dans `<head>` lisant le cookie `app-theme` / `localStorage` avant le premier rendu.
3. **Thèmes supportés** :
   - Clairs : `light`, `corporate`, `nord`, `emerald`.
   - Sombres : `dark`, `business`, `dim`, `synthwave`.

---

## 7. Commandes Fréquentes du Projet

```bash
# Développement avec rechargement rapide Turbopack
pnpm dev

# Exécution de la suite de tests unitaires et intégration (TDD)
pnpm test
pnpm test:watch
pnpm test:coverage

# Tests E2E Playwright
pnpm test:e2e

# Vérification des types TypeScript & Linter
pnpm typecheck
pnpm lint

# Base de données (Drizzle / Prisma)
pnpm db:generate
pnpm db:migrate
pnpm db:studio

# Construction pour déploiement Vercel
pnpm build
```

---

## 8. Discipline de Documentation pour les Agents

À chaque fin d'intervention significative :
1. Mettre à jour l'état d'avancement des tâches dans [**`TASK.md`**](file:///C:/Users/james/OneDrive/Documents/1AA-M1/bisa/TASK.md) (passer de `[ ]` à `[/]` ou `[X]`).
2. Consigner les fonctionnalités livrées, les corrections et les décisions techniques dans [**`CHANGELOG.md`**](file:///C:/Users/james/OneDrive/Documents/1AA-M1/bisa/CHANGELOG.md).
3. S'assurer que tous les tests TDD (`pnpm test`) passent au vert et qu'aucun warning console n'a été introduit.

# Changelog

Toutes les modifications notables apportées à ce projet de gestion de projet type Jira seront consignées dans ce document.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

---

## [0.3.0] - 2026-11-04

### Ajouté
- **Authentification Complète (Connexion, Inscription & Session)** :
  - Écran d'authentification `AuthScreen` (`src/components/auth/auth-screen.tsx`) respectant l'archétype `page-types/auth.md` avec bascule par onglets (`tabs tabs-box`) entre **Connexion** et **Créer un compte (Inscription)**, affichage/masquage du mot de passe, sélecteur de thème et accès rapide aux profils de démonstration.
  - Validation Zod dédiée (`LoginInputSchema`, `RegisterInputSchema`), méthodes du repository (`authenticateUser`, `registerUser`, `getUserById`), et Server Actions (`loginUserAction`, `registerUserAction`, `logoutUserAction`) avec persistance de session par cookie HTTP (`bisa-session-user`).
  - Onglet **Mon Compte** dans les paramètres et bouton **Se déconnecter** dans le menu utilisateur et le pied de barre latérale.
  - Nouveaux tests unitaires TDD pour l'inscription, la connexion et le composant `AuthScreen` (`8 fichiers de test / 20 tests passés`).

### Modifié
- **Expérience Produit SaaS B2B Épurée** :
  - Suppression de toutes les mentions méta d'outils techniques (`Vercel`, `daisyUI`, `Next.js`, `Neon`, `Chart.js`, `Obsidian`, `TDD`, `SOLID`, `line-chart-4`, etc.) dans l'interface utilisateur et les données initiales pour offrir un vocabulaire métier 100 % authentique (projets Paiement SEPA, Portail Mobile, Entrepôt BI).

---

## [0.2.0] - 2026-11-04

### Ajouté
- **Socle Technique Next.js 15, Tailwind CSS 4 & daisyUI 5** :
  - Configuration App Router, React 19, TypeScript strict (`tsc --noEmit` à 0 erreur) et `@import "tailwindcss"; @plugin "daisyui";`.
  - Activation des 8 thèmes daisyUI (`light`, `dark`, `corporate`, `business`, `nord`, `dim`, `emerald`, `synthwave`) avec script anti-FOUC inline dans `<head>`, synchronisation Cookie HTTP (`app-theme`) + `localStorage`.
- **Pipeline TDD (Vitest & React Testing Library) & Architecture SOLID** :
  - 7 suites de tests unitaires et composants (`17 tests passés à 100%`) couvrant la validation Zod (`jira-schema.test.ts`), l'algorithme LexoRank (`lexorank.test.ts`), le moteur de projection de graphe Obsidian (`graph-projection.test.ts`), le moteur analytique (`analytics-engine.test.ts`), le Repository Pattern atomique (`jira-repository.test.ts`), le système de Toasts (`toast-provider.test.tsx`) et les modales/skeletons (`confirm-modal.test.tsx`).
- **Couche Données & PostgreSQL Serverless Neon (`@neondatabase/serverless` + Drizzle ORM)** :
  - Schéma PostgreSQL relationnel complet (`src/repositories/db-schema.ts`), connecteur Serverless Neon (`src/repositories/neon-client.ts`) et adaptateur Repository `IJiraRepository` avec jeu de données B2B réaliste (3 projets `CORE`, `NOVA`, `DATA`, 4 sprints, 5 collaborateurs, 15 tickets interconnectés).
- **100% daisyUI-First : Toasts Sémantiques, Modales Stylisées & Skeletons Géométriques** :
  - `ToastProvider` (`toast toast-bottom toast-end`, `alert alert-{type} alert-soft`) remplaçant tout `window.alert()`.
  - `ConfirmModal` (`<dialog class="modal">`, `modal-box`, `loading loading-spinner`) remplaçant tout `window.confirm()`.
  - Skeletons daisyUI 5 géométriques (`KanbanBoardSkeleton`, `AnalyticsDashboardSkeleton`, `GraphViewSkeleton`) éliminant tout CLS.
- **Fonctionnalités Complètes Jira & Globe 3D Style Obsidian** :
  - **Tableau Kanban & Scrum** : Drag & Drop entre colonnes, alertes de dépassement WIP, regroupement par Swimlanes (Aucun, Par Epic, Par Membre, Par Priorité), filtres combinables et barre de progression des sous-tâches.
  - **Backlog & Planification Scrum** : Estimation Fibonacci en Story Points, affectation aux sprints, démarrage et clôture de sprint avec report automatique des tickets non terminés.
  - **Globe 3D Sphérique & Graphe 2D (Style Obsidian)** : Projection sur sphère Fibonacci 3D avec rotation orbitale interactive et simulation physique Force-Directed 2D à 60 FPS, halo de survol, filtrage des liens bloquants et inspection directe des tickets.
  - **Tableaux de Bord Analytiques (`daisyui-charts`)** : Sprint Burndown Chart (`line-chart-4`), Velocity Chart (`column-chart-3`), Diagramme de Flux Cumulé CFD (`area-chart-4`), Répartition par Statut (`pie-chart-2`), Charge par Collaborateur (`bar-chart-2`) et simulateur interactif des 4 états (Chargé, Skeleton, Vide, Erreur).
  - **Recherche Globale Spotlight (`Cmd+K` / `Ctrl+K`)** et **Galerie de Thèmes Dynamique dans les Paramètres**.

---

## [0.1.0-alpha] - 2026-11-04

### Ajouté
- **Fichiers de cadrage initial & Architecture étendue** :
  - `DESIGN.md` : Charte graphique officielle, design system sémantique daisyUI 5, matrice des 8 thèmes, motifs ergonomiques Kanban, spécification visuelle du graphe/globe Obsidian, règles des 4 états et microcopy.
  - `ARCHITECTURE.md` : Spécification complète intégrant les principes d'ingénierie logicielle (TDD, KISS, DRY, SOLID), schéma relationnel complet (ERD), architecture en couches découplées, et module dédié à la **Vue Graphique / Globe Interactif type Obsidian** pour cartographier les liens entre projets, epics, tâches et dépendances.
  - `TASK.md` : Backlog structuré découpé en 10 phases exhaustives, incluant le harnais de tests TDD et le développement du moteur de graphe interactif 2D/3D.
  - `AGENT.md` : Charte de développement imposant les cycles TDD (Red-Green-Refactor), l'application stricte de KISS, DRY et SOLID, le respect des tokens daisyUI 5 et les règles d'implémentation du graphe Canvas/WebGL.
  - `CHANGELOG.md` : Suivi continu des versions et décisions d'architecture.

### Décisions d'architecture (ADR)
- **ADR-001 : Framework Next.js App Router & Server Actions**
  - Choix de Next.js 15+ pour un rendu hybride (RSC pour les tableaux de bord et métadonnées, Client Components légers pour l'interactivité Drag-and-Drop, Canvas Chart.js et Graphe Obsidian).
- **ADR-002 : Hébergement Vercel & Base de données Serverless PostgreSQL (Neon / Vercel Postgres)**
  - Déploiement sans restriction ni surcoût de pooler sur Vercel grâce au driver HTTP/WebSocket `@neondatabase/serverless` avec connection pooling natif.
- **ADR-003 : Design System daisyUI 5 & Tailwind CSS 4**
  - Utilisation exclusive des classes sémantiques daisyUI 5 (`bg-base-100`, `bg-base-200`, `btn-primary`, `badge-soft`, `join`, `fieldset`).
  - Zéro couleur hexadécimale codée en dur pour garantir un rendu irréprochable dans l'ensemble des thèmes daisyUI (`light`, `dark`, `corporate`, `business`, `nord`, `dim`, `emerald`, `synthwave`, etc.).
- **ADR-004 : Graphiques de bord réactifs aux thèmes via `daisyui-charts`**
  - Intégration de Chart.js 4 piloté par le helper `dc` (`references/theme-helper.md`) lisant dynamiquement les variables CSS daisyUI (`--color-primary`, `--color-base-300`, etc.) et s'actualisant via MutationObserver sans rechargement de page.
- **ADR-005 : Gestion de thèmes dynamiques dans les Paramètres**
  - Stockage de la préférence utilisateur en cookie HTTP + `localStorage` avec injection d'un script inline bloquant dans le `<head>` pour un rendu instantané sans scintillement (`data-theme`).
- **ADR-006 : Cadre d'Ingénierie Logicielle (TDD, KISS, DRY, SOLID)**
  - Adoption du cycle Red-Green-Refactor avec **Vitest** pour les tests unitaires et d'intégration, et **Playwright** pour les tests E2E critiques (Drag & Drop, cycle de sprint).
  - Découpage architectural en couches : *Domain Models* -> *Repositories / Interfaces* -> *Application Services* -> *Server Actions* -> *UI Components*.
  - Validation unique Zod partagée (DRY) entre les formulaires clients et les Server Actions sécurisées.
- **ADR-007 : Moteur de Visualisation en Graphe / Globe Réseau (Inspiration Obsidian)**
  - Projection des entités (Projets, Epics, Stories, Tâches, Bugs, Dépendances) sous forme de graphe relationnel interactif avec moteur force-directed (Canvas 2D / 3D Force Graph).
  - Couleurs des nœuds alignées sur les tokens sémantiques daisyUI (Epics en `secondary`, Tâches en `info`, Bugs en `error`, Projets en `primary`).
- **ADR-008 : Charte Graphique, Design System & Ergonomie UI/UX (DESIGN.md)**
  - Formalisation de la charte visuelle, règles de densité (`*-sm`), interdiction absolue de classes fixes (`bg-white`), règle obligatoire des 4 états (Loading, Empty, Error, Loaded) et stratégie de micro-typographie B2B localisée.
- **ADR-009 : Système Exclusif de Toasts Sémantiques & Modales Stylisées (Bannissement des Alertes JS Natives)**
  - Interdiction stricte de `window.alert()`, `window.confirm()` et `window.prompt()`.
  - Implémentation centralisée d'un `ToastProvider` daisyUI 5 (`toast toast-bottom toast-end`, `alert alert-{type} alert-soft`) pour tout retour d'erreur ou d'action, et d'un composant générique `ConfirmModal` basé sur `<dialog class="modal">` daisyUI 5 avec backdrop flouté pour toute interaction de confirmation.
- **ADR-010 : Standardisation Intégrale daisyUI 5 (Skeletons & Loaders Natifs Exclusifs)**
  - Adoption de la règle "100% daisyUI-First" pour tous les composants de l'application.
  - Utilisation obligatoire des skeletons daisyUI (`skeleton`) pour tout état de chargement de données (reproduisant les formes finales pour éliminer le CLS).
  - Utilisation obligatoire des loaders daisyUI (`loading loading-spinner`, `loading-dots`) dans les boutons et traitements asynchrones, avec bannissement des GIFs et spinners SVG artisanaux.

# Plan de Développement & Backlog des Tâches (TASK.md)

Ce document répertorie l'ensemble des fonctionnalités et tâches d'ingénierie nécessaires pour concevoir, développer et tester sous les principes **TDD**, **KISS**, **DRY** et **SOLID** une application de gestion de projet complète type **Jira**, enrichie d'une **vue graphe/globe interactive type Obsidian**, construite avec **Next.js (App Router)**, **Vercel**, **PostgreSQL Serverless (Neon)**, **daisyUI 5** et **daisyui-charts**.

---

## Vue d'Ensemble des Phases & Statuts

- [X] **Phase 0 : Socle Technique, Tooling TDD & Design System daisyUI 5** `[P0 - Fondations]`
- [X] **Phase 1 : Authentification, Multi-Tenancy & Permissions RBAC (Architecture SOLID)** `[P0 - Critique]`
- [X] **Phase 2 : Modèle Projet, Numérotation Atomique & Workflows Jira** `[P0 - Cœur de domaine]`
- [X] **Phase 3 : Tableau Kanban & Scrum Board Interactif (Drag & Drop)** `[P0 - Cœur de domaine]`
- [X] **Phase 4 : Backlog, Planification & Gestion des Sprints** `[P1 - Majeur]`
- [X] **Phase 5 : Fiche Détaillée d'Issue & Collaboration** `[P1 - Majeur]`
- [X] **Phase 6 : Vue Graphe & Globe Interactif des Tâches & Projets (Style Obsidian)** `[P1 - Majeur & Différenciateur]`
- [X] **Phase 7 : Tableaux de Bord & Graphiques d'Analyse (daisyui-charts)** `[P1 - Majeur]`
- [X] **Phase 8 : Paramètres de l'Application & Switcher de Thèmes Dynamique** `[P1 - Majeur]`
- [X] **Phase 9 : Recherche Rapide (CMD+K), Filtres & Raccourcis Clavier** `[P2 - Confort]`
- [X] **Phase 10 : Audit Qualité daisyUI, Tests & Préparation Déploiement Vercel** `[P0 - Livraison]`

---

## Légende des Métadonnées
- **Priorité** : `P0` (Bloquant / Essentiel), `P1` (Important), `P2` (Confort / Amélioration).
- **Statut** : `[ ]` Non démarré, `[/]` En cours, `[X]` Terminé.
- **Estimation** : Story Points (Fibonacci : 1, 2, 3, 5, 8, 13).

---

## Phase 0 : Socle Technique, Tooling TDD & Design System daisyUI 5

> **Objectif** : Mettre en place un projet Next.js 15+ ultra-performant avec pipeline TDD rigoureux (Vitest + RTL + Playwright), Tailwind CSS 4, daisyUI 5 et connection pooling PostgreSQL Vercel.

- [X] **TASK-001** `[P0]` `[3 SP]` **Initialisation du projet Next.js 15+ & TypeScript Strict**
  - Configuration Next.js 15+ (App Router, Turbopack, TypeScript strict, ESLint, Prettier).
  - Structure modulaire en couches SOLID : `src/domain`, `src/services`, `src/repositories`, `src/server/actions`, `src/components`, `src/lib`.
  - Configuration des alias de chemins (`@/*`).
  - *Critère d'acceptation* : `pnpm dev` et `pnpm build` s'exécutent sans erreur ni avertissement.

- [X] **TASK-002** `[P0]` `[3 SP]` **Environnement de Test TDD (Vitest, Testing Library & Mocks)**
  - Configuration de **Vitest** avec environnement `jsdom`, prise en charge de React 19 et `@testing-library/react`.
  - Configuration du harnais de mock pour la base de données Neon PostgreSQL et les sessions utilisateurs.
  - Script de couverture de code (`pnpm test:coverage`).
  - *Critère d'acceptation* : Un test unitaire exemple passe au vert avec le cycle Red-Green-Refactor documenté.

- [X] **TASK-003** `[P0]` `[3 SP]` **Intégration de Tailwind CSS 4 & daisyUI 5 (100% daisyUI-First)**
  - Configuration de `globals.css` avec `@import "tailwindcss";` et `@plugin "daisyui";`.
  - Configuration des thèmes autorisés dans daisyUI (`light`, `dark`, `corporate`, `business`, `nord`, `dim`, `emerald`, `synthwave`).
  - Validation des composants clés daisyUI 5 (`btn-soft`, `badge-soft`, `fieldset`, `join`, `table-sm`).
  - Standardisation des états de chargement : composants `skeleton` géométriques et loaders `<span class="loading loading-spinner"></span>` dans les boutons.
  - *Critère d'acceptation* : Rendu parfait des composants daisyUI natifs sans aucun fichier `tailwind.config.js` obsolète et zéro spinner SVG non-daisyUI.

- [X] **TASK-004** `[P0]` `[5 SP]` **Couche Persistance Serverless (Neon / Vercel Postgres) & Repository Pattern**
  - Mise en place du schéma relationnel (Drizzle ORM ou Prisma optimisé serverless) avec driver `@neondatabase/serverless` (pooling port 6543).
  - Création de l'interface abstraite de persistance (`IDatabaseClient`) respectant le principe d'inversion des dépendances (DIP).
  - Configuration des scripts de migration (`migrate`, `push`, `seed`).
  - *Critère d'acceptation* : Tests d'intégration automatisés validant la connexion et les transactions ACID.

- [X] **TASK-005** `[P1]` `[3 SP]` **Infrastructure du Sélecteur de Thème (Theme Controller sans FOUC)**
  - Script inline dans `<head>` pour appliquer `data-theme` avant le premier rendu visuel.
  - `ThemeProvider` synchronisé avec Cookie HTTP et `localStorage`.
  - *Critère d'acceptation* : Bascule de thème instantanée sans rechargement de page et sans flash blanc en mode sombre.

- [X] **TASK-006** `[P0]` `[3 SP]` **Système Global de Toasts & Modales de Confirmation Stylisées (daisyUI 5)**
  - Création du `ToastProvider` et hook réutilisable `useToast()` pour toutes les erreurs, avertissements et succès (interdiction de `window.alert()`).
  - Toasts sémantiques animés avec temporisateur auto-dismiss (`toast toast-bottom toast-end`, `alert alert-{type} alert-soft shadow-lg border border-base-300`).
  - Composant générique accessible `ConfirmModal` (`<dialog class="modal">` daisyUI 5, backdrop flouté, bouton d'annulation `btn-ghost`, bouton d'action contextuel) remplaçant tout `window.confirm()`.
  - *Critère d'acceptation* : 100% des erreurs et dialogues de confirmation sont stylisés via daisyUI 5 sans aucune pop-up ou alerte native brute.

---

## Phase 1 : Authentification, Multi-Tenancy & Permissions RBAC (Architecture SOLID)

> **Objectif** : Gérer les comptes, les espaces de travail isolés et le contrôle d'accès avec séparation stricte des responsabilités.

- [X] **TASK-101** `[P0]` `[5 SP]` **Service d'Authentification (TDD)**
  - Tests unitaires et d'intégration écrits préalablement pour valider l'inscription, la connexion et la gestion de session.
  - Implémentation via Auth.js (NextAuth v5) ou solution gérée avec hachage sécurisé et OAuth (GitHub/Google).
  - Écrans de login et d'inscription avec composants daisyUI 5 (`card`, `fieldset`, `input`, `btn-primary`).
  - *Critère d'acceptation* : Suite de tests `auth.test.ts` à 100% au vert. Sessions transmises via cookies sécurisés HTTPOnly.

- [X] **TASK-102** `[P0]` `[5 SP]` **Gestion des Espaces de Travail Multi-Tenant (DRY & SRP)**
  - Modèle `Workspace` et table de liaison `WorkspaceMember`.
  - Service de domaine `WorkspaceService` injecté avec isolation des données par `workspaceId`.
  - Sélecteur de workspace dans le shell applicatif daisyUI (`dropdown` avec avatar d'organisation).
  - *Critère d'acceptation* : Aucune requête vers la base de données ne peut s'exécuter sans spécifier et valider le `workspaceId` de l'utilisateur actif.

- [X] **TASK-103** `[P1]` `[5 SP]` **Matrice des Permissions RBAC (Open/Closed Principle)**
  - Définition des rôles : `WORKSPACE_ADMIN`, `MEMBER`, `GUEST` et rôles projet (`PROJECT_ADMIN`, `DEVELOPER`, `VIEWER`).
  - Gardiens de permissions extensibles (`canPerformAction(user, action, resource)`).
  - *Critère d'acceptation* : Tests unitaires exhaustifs pour chaque combinaison de rôles et d'actions sensibles.

---

## Phase 2 : Modèle Projet, Numérotation Atomique & Workflows Jira

> **Objectif** : Développer le cœur de domaine Jira avec numérotation de tickets `PROJ-101`, types d'issues et transitions d'étapes.

- [X] **TASK-201** `[P0]` `[5 SP]` **Gestion des Projets & Générateur de Clé Atomique (TDD)**
  - Modèle `Project` : Nom, Clé unique en majuscules (ex: `JRA`, `API`), Lead, Compteur séquentiel d'issues (`issueCounter`).
  - Test unitaire validant l'incrémentation atomique sans collision concurrente lors de la création simultanée de tickets.
  - Page de gestion des projets avec `table table-sm` daisyUI et filtres de recherche.
  - *Critère d'acceptation* : Unicité stricte garantie en base de données et tests de concurrence réussis.

- [X] **TASK-202** `[P0]` `[5 SP]` **Types d'Issues, Priorités & Validation Zod Unique (DRY)**
  - Schéma Zod unifié pour les types Jira :
    - `EPIC` (violet, macro-objectif)
    - `STORY` (vert, fonctionnalité utilisateur)
    - `TASK` (bleu, tâche technique)
    - `BUG` (rouge, anomalie)
    - `SUBTASK` (cyan, sous-tâche dépendante)
  - Priorités sémantiques : `Lowest`, `Low`, `Medium`, `High`, `Highest`, `Blocker`.
  - *Critère d'acceptation* : Validation partagée entre les formulaires clients et les Server Actions.

- [X] **TASK-203** `[P1]` `[5 SP]` **Machine à États des Workflows (SOLID - Open/Closed)**
  - Modèle `IssueStatus` et catégories (`TODO`, `IN_PROGRESS`, `DONE`).
  - Service pur `WorkflowService` validant si une transition d'état est autorisée pour un rôle donné.
  - Traçage automatique des transitions dans l'historique d'audit `IssueActivity`.
  - *Critère d'acceptation* : Tests unitaires de la machine à états validant chaque branche autorisée et bloquant les transitions illégales.

---

## Phase 3 : Tableau Kanban & Scrum Board Interactif (Drag & Drop)

> **Objectif** : Offrir l'expérience visuelle maîtresse de Jira : tableau agile fluide, réactif et optimiste avec `@dnd-kit`.

- [X] **TASK-301** `[P0]` `[8 SP]` **Moteur de Glisser-Déposer Accessible (`@dnd-kit`)**
  - Implémentation du tableau avec `@dnd-kit/core` et `@dnd-kit/sortable` pour le déplacement des cartes entre colonnes et réordonnancement vertical.
  - Navigation au clavier complète et support tactile pour écrans mobiles.
  - *Critère d'acceptation* : Animation 60 FPS sans saccade et respect des normes WCAG pour l'interaction au clavier.

- [X] **TASK-302** `[P0]` `[5 SP]` **Mises à Jour Optimistes & Algorithme LexoRank (KISS & DRY)**
  - Ordonnancement LexoRank calculé côté client et validé côté serveur pour éviter les réécritures complètes de rangs.
  - Mise à jour optimiste de l'UI avec rollback automatique et notification daisyUI `toast alert-error` en cas d'incident réseau.
  - *Critère d'acceptation* : Latence perçue nulle pour l'utilisateur lors du déplacement d'une carte.

- [X] **TASK-303** `[P1]` `[5 SP]` **Composant Carte de Ticket (Issue Card)**
  - Conception modulaire respectant les tokens `card bg-base-100 border border-base-300 shadow-xs`.
  - Affichage : Clé cliquable (`PROJ-42`), Type d'issue avec badge adouci (`badge-soft`), Titre, Avatar assigné, Priorité, Story points.
  - *Critère d'acceptation* : Tests de rendu RTL validant la bonne restitution de chaque variante de ticket.

- [X] **TASK-304** `[P1]` `[5 SP]` **Limites WIP & Swimlanes Dynamiques**
  - Alerte visuelle daisyUI si le nombre d'éléments dépasse la limite fixée sur la colonne (`badge-warning`).
  - Organisation par Swimlanes (regroupement horizontal par Epic, par Assigné ou par Priorité).
  - *Critère d'acceptation* : La bascule de swimlane s'effectue sans recharger les données ni perturber le drag-and-drop.

---

## Phase 4 : Backlog, Planification & Gestion des Sprints

> **Objectif** : Implémenter le mode Scrum complet avec backlog priorisé et cycle de vie des sprints.

- [X] **TASK-401** `[P0]` `[5 SP]` **Gestion du Backlog & Priorisation**
  - Vue scindée : Sprints actifs / futurs en haut, Backlog général en bas.
  - Glisser-déposer de tickets entre le Backlog et un Sprint dédié.
  - Calcul instantané des totaux de Story Points par colonne d'avancement.
  - *Critère d'acceptation* : Tests unitaires du calcul de charge et de vélocité prévisionnelle.

- [X] **TASK-402** `[P0]` `[5 SP]` **Cycle de Vie des Sprints (Start / Complete Sprint)**
  - Modale native daisyUI (`<dialog class="modal">`) pour configurer la durée, les dates et l'objectif du sprint.
  - Modale de clôture : synthèse des points accomplis vs restants et transfert automatisé des tickets non finis.
  - *Critère d'acceptation* : Tests d'intégration validant le passage d'état de sprint de `FUTURE` à `ACTIVE`, puis `CLOSED`.

- [X] **TASK-403** `[P1]` `[3 SP]` **Estimation en Story Points**
  - Sélecteur de points basé sur la suite de Fibonacci (0.5, 1, 2, 3, 5, 8, 13, 20).
  - Badges distinctifs daisyUI affichant la répartition `TODO`, `IN_PROGRESS`, `DONE`.
  - *Critère d'acceptation* : Mise à jour réactive des métadonnées du sprint lors de chaque réestimation.

---

## Phase 5 : Fiche Détaillée d'Issue & Collaboration

> **Objectif** : Écran complet de consultation et d'édition d'un ticket avec riche métadonnées, sous-tâches et historique.

- [X] **TASK-501** `[P0]` `[5 SP]` **Composant Fiche Ticket (Modal Interceptée ou Vue Tiroir)**
  - Utilisation des routes parallèles et interceptées Next.js (`@modal/(.)issues/[key]`) pour une ouverture instantanée conservant l'URL directe.
  - Édition en ligne (inline editing) du titre, de la description, de l'assigné et de la priorité avec sauvegarde automatique au blur.
  - *Critère d'acceptation* : L'accès direct via l'URL complète affiche la page complète ; le clic depuis le tableau ouvre la modale sans rechargement.

- [X] **TASK-502** `[P1]` `[5 SP]` **Éditeur Markdown & Blocs de Code**
  - Zone de saisie Markdown ergonomique avec prévisualisation en direct.
  - Support des blocs de code syntaxés (`mockup-code`), listes de tâches cochables et mentions `@utilisateur`.
  - *Critère d'acceptation* : Rendu irréprochable dans l'ensemble des thèmes daisyUI (light et dark).

- [X] **TASK-503** `[P1]` `[5 SP]` **Gestion des Sous-tâches & Liens de Dépendance**
  - Ajout rapide de sous-tâches inline avec barre de progression daisyUI (`progress progress-primary`).
  - Gestion des liens : *Bloque / Est bloqué par*, *Duplique*, *Relatif à*.
  - *Critère d'acceptation* : Les blocages actifs mettent en évidence un badge d'avertissement sur la carte parente.

- [X] **TASK-504** `[P1]` `[5 SP]` **Commentaires, Historique d'Activité & Suivi du Temps**
  - Fil de discussion avec horodatage relatif (`Intl.RelativeTimeFormat`) et avatars utilisateurs.
  - Journal d'audit complet (Activity Log) consignant chaque modification côté serveur.
  - Module de Time Tracking (Temps estimé vs Temps passé avec jauge).
  - *Critère d'acceptation* : Traçabilité infalsifiable générée par le service de domaine lors de chaque mutation.

- [X] **TASK-505** `[P2]` `[3 SP]` **Stockage des Pièces Jointes (Vercel Blob / S3)**
  - Service abstrait `StorageService` respectant le principe de substitution de Liskov (LSP).
  - Téléversement direct sécurisé de captures de bugs et fichiers de spécifications.
  - *Critère d'acceptation* : Tests d'intégration validant le téléversement et la suppression de fichiers.

---

## Phase 6 : Vue Graphe & Globe Interactif des Tâches & Projets (Style Obsidian)

> **Objectif** : Concevoir la vue cartographique en réseau force-directed 2D et globe 3D sphérique pour visualiser l'ensemble de l'écosystème de tâches et dépendances.

- [X] **TASK-601** `[P0]` `[5 SP]` **Service de Projection de Graphe (TDD & SOLID)**
  - Service pur `GraphProjectionService` transformant les entités PostgreSQL en structure normalisée `{ nodes: GraphNode[], links: GraphLink[] }`.
  - Calcul de la centralité des nœuds et des rayons (Story Points et nombre d'interconnexions).
  - Attribution automatique des tokens sémantiques daisyUI : Projets en `primary`, Epics en `secondary`, Tâches en `info`, Bugs en `error`, Terminés en `success`.
  - *Critère d'acceptation* : Tests unitaires validant l'exactitude de la structure de projection et le typage strict des nœuds et arêtes.

- [X] **TASK-602** `[P0]` `[8 SP]` **Moteur de Visualisation 2D Force-Directed (Canvas HTML5)**
  - Intégration d'un moteur de simulation physique (ex: `d3-force` ou `force-graph`) sur Canvas 2D pour un rendu fluide à 60 FPS sans surcharge du DOM.
  - Simulation de gravité centrale, répulsion de Coulomb et tension des liens.
  - Liens orientés avec flèches discrètes et pointillés pour les blocages `BLOCKS`.
  - *Critère d'acceptation* : Navigation fluide (zoom, pan, drag des nœuds) même avec plus de 500 éléments interconnectés.

- [X] **TASK-603** `[P1]` `[8 SP]` **Mode Globe 3D Sphérique Interactif (WebGL / Three.js)**
  - Option de bascule vers un globe tridimensionnel projetant les nœuds sur la surface ou le volume d'une sphère céleste.
  - Contrôles orbitaux à la souris ou au tactile avec rotation gyroscopique fluide.
  - *Critère d'acceptation* : Bascule instantanée entre la vue 2D Force Graph et la vue Globe 3D via la barre d'outils daisyUI `join`.

- [X] **TASK-604** `[P1]` `[5 SP]` **Interactivité, Halo & Panneau d'Inspection Latéral**
  - Au survol d'un nœud : effet de halo lumineux, mise en surbrillance des connexions directes et atténuation du reste du réseau.
  - Au clic sur un nœud : ouverture immédiate du tiroir latéral daisyUI (`drawer`) pour consulter et modifier le ticket sans quitter le graphe.
  - *Critère d'acceptation* : Synchronisation bidirectionnelle : toute modification d'état dans le tiroir met à jour immédiatement la couleur du nœud sur le graphe.

- [X] **TASK-605** `[P1]` `[3 SP]` **Barre d'Outils, Filtres & Réactivité aux Thèmes**
  - Barre d'outils flottante daisyUI (`join`) : masquer les tickets terminés, isoler un projet, filtrer par priorité ou par type d'issue.
  - Curseur d'ajustement de la force de répulsion (`range range-primary`).
  - Extraction dynamique des couleurs du graphe via le helper `dc.color()`, actualisant le rendu sur mutation de `data-theme`.
  - *Critère d'acceptation* : Le changement de thème dans les paramètres adapte immédiatement les couleurs du graphe sans réinitialiser la simulation physique.

---

## Phase 7 : Tableaux de Bord & Graphiques d'Analyse (daisyui-charts)

> **Objectif** : Développer la suite complète de graphiques analytiques Jira (Burndown, Vélocité, Flux Cumulé, Répartition) avec Chart.js 4 et le helper `dc`.

- [X] **TASK-701** `[P0]` `[5 SP]` **Wrapper React `DaisyChart` & Helper `dc` (TDD)**
  - Composant Client React encapsulant Chart.js 4 et le helper `dc` (`references/theme-helper.md`).
  - Observation dynamique des mutations de l'attribut `data-theme` pour réappliquer les palettes daisyUI sans recharger la page.
  - Respect strict des 4 états de chaque carte : `Loading` (skeleton), `Empty` (message d'action), `Error` (alert-error + retry), et `Loaded`.
  - *Critère d'acceptation* : Tests de rendu RTL validant la bonne restitution de chaque état.

- [X] **TASK-702** `[P0]` `[5 SP]` **Graphique de Burndown du Sprint (Sprint Burndown Chart)**
  - Implémentation basée sur la recette `line-chart-4` / `line-chart-7`.
  - Tracé de la ligne d'avancement idéal (pointillés `base-content/40`) et de la courbe réelle des points restants en `primary`.
  - Attributs `role="img"` et `aria-label` descriptif pour l'accessibilité.
  - *Critère d'acceptation* : Tests unitaires du calcul mathématique de la trajectoire d'échéance.

- [X] **TASK-703** `[P1]` `[5 SP]` **Graphique de Vélocité de l'Équipe (Velocity Chart)**
  - Recette `column-chart-3` : colonnes bicolores comparant les Story Points engagés (`base-300`) vs livrés (`success`).
  - Calcul et tracé de la ligne moyenne mobile de vélocité.
  - *Critère d'acceptation* : Affichage dynamique de l'historique sur les 5 à 10 derniers sprints.

- [X] **TASK-704** `[P1]` `[5 SP]` **Diagramme de Flux Cumulé (Cumulative Flow Diagram - CFD)**
  - Recette `area-chart-4` (aires empilées) représentant la distribution dans le temps des états (`TODO`, `IN_PROGRESS`, `DONE`).
  - Détection visuelle des goulets d'étranglement.
  - *Critère d'acceptation* : Tooltips détaillés par date et rendu optimal sur grand écran et mobile.

- [X] **TASK-705** `[P1]` `[3 SP]` **Graphiques de Répartition & Charge de Travail**
  - Donut `pie-chart-2` avec chiffre total au centre : répartition par Type et Priorité.
  - Barres horizontales `bar-chart-2` : charge de travail par collaborateur.
  - *Critère d'acceptation* : Disposition en grille responsive `grid gap-4 lg:grid-cols-2` sans dépassement horizontal.

---

## Phase 8 : Paramètres de l'Application & Switcher de Thèmes Dynamique

> **Objectif** : Offrir l'interface de personnalisation complète de l'application selon les recommandations de `daisyui-dashboard-skill`.

- [X] **TASK-801** `[P0]` `[5 SP]` **Page Paramètres Utilisateur & Galerie de Thèmes Visuelle**
  - Navigation par onglets daisyUI (`tabs tabs-box`) : *Profil*, *Apparence & Thèmes*, *Espaces de travail*.
  - Galerie interactive d'échantillons montrant la palette réelle de chaque thème daisyUI (`light`, `dark`, `corporate`, `business`, `nord`, `dim`, `emerald`, `synthwave`).
  - Synchronisation instantanée avec le cookie HTTP `app-theme` et le profil utilisateur en base.
  - *Critère d'acceptation* : Sélection immédiate sans rechargement de page ; conservation du thème choisi lors des prochaines connexions.

- [X] **TASK-802** `[P1]` `[5 SP]` **Paramètres du Projet & Gestion des Membres**
  - Table de gestion des membres avec `select select-sm` pour changer les rôles et actions de révocation.
  - Zone sensible de suppression de projet protégée par modale avec saisie de confirmation (`btn-error`).
  - *Critère d'acceptation* : Validation des autorisations avec mise à jour immédiate des droits.

---

## Phase 9 : Recherche Rapide (CMD+K), Filtres & Raccourcis Clavier

> **Objectif** : Maximiser la vitesse de travail quotidienne grâce à une recherche instantanée et des filtres puissants.

- [X] **TASK-901** `[P0]` `[5 SP]` **Palette de Commande Globale (Spotlight CMD+K)**
  - Modale de recherche rapide déclenchée par `Ctrl+K` / `Cmd+K` (`kbd` daisyUI).
  - Recherche floue instantanée par clé (`PROJ-12`), titre ou membre avec index PostgreSQL optimisé.
  - Navigation complète au clavier (flèches, Entrée, Échap).
  - *Critère d'acceptation* : Temps de réponse moyen < 100 ms.

- [X] **TASK-902** `[P1]` `[5 SP]` **Barre de Filtres Rapides & Persistance URL (DRY)**
  - Filtres en 1 clic : "Mes tickets", "Bugs uniquement", "Récemment modifiés".
  - Filtres combinables via composants `join` daisyUI (par assigné, priorité, label, sprint).
  - Synchronisation de l'état dans les SearchParams de l'URL pour un partage direct de la vue.
  - *Critère d'acceptation* : La copie du lien partage fidèlement la vue filtrée.

---

## Phase 10 : Audit Qualité daisyUI, Tests E2E Playwright & Déploiement Vercel

> **Objectif** : Garantir la conformité avec la checklist `daisyui-dashboard-skill`, assurer une couverture E2E complète et réussir le déploiement sur Vercel.

- [X] **TASK-1001** `[P0]` `[3 SP]` **Audit Design System & Conformité DESIGN.md**
  - Vérification de la stricte conformité avec le guide [**`DESIGN.md`**](file:///C:/Users/james/OneDrive/Documents/1AA-M1/bisa/DESIGN.md).
  - Vérification de l'absence totale de couleurs fixes (`bg-white`, codes HEX en dur).
  - Contrôle du contraste textuel (≥ 4.5:1) sur chaque thème configurable.
  - Contrôle des 4 états (Loading, Empty, Error, Loaded) sur tous les composants.
  - *Critère d'acceptation* : Validation sans avertissement de la checklist de `DESIGN.md` et de `daisyui-dashboard-skill/audit/checklist.md`.

- [X] **TASK-1002** `[P0]` `[5 SP]` **Suite de Tests E2E Playwright**
  - Parcours complet : Inscription/Connexion -> Création de projet -> Ajout d'issue -> Déplacement Kanban drag & drop -> Planification & Clôture de sprint -> Consultation du graphe Obsidian -> Changement de thème.
  - *Critère d'acceptation* : 100% des tests E2E passent au vert sur les navigateurs Chromium, Firefox et WebKit.

- [X] **TASK-1003** `[P0]` `[5 SP]` **Déploiement Vercel & Intégration Base de Données Serverless**
  - Configuration de `vercel.json` et des variables d'environnement de production.
  - Intégration de la base de données Neon PostgreSQL avec chaîne de pooling (`POSTGRES_URL`).
  - Optimisation des temps de build Turbopack et politiques de cache.
  - *Critère d'acceptation* : Déploiement vert sur Vercel, base de données connectée sans restriction et sans aucune anomalie dans les logs de production.

import type { UserRole } from "@/lib/validations/jira-schema";

export interface RoleMetadata {
  id: UserRole;
  label: string;
  shortLabel: string;
  badgeClass: string;
  description: string;
}

export const ROLE_METADATA: Record<UserRole, RoleMetadata> = {
  ADMIN: {
    id: "ADMIN",
    label: "Administrateur",
    shortLabel: "Admin",
    badgeClass: "badge-primary",
    description:
      "Accès complet : peut inviter des utilisateurs, choisir et modifier leurs rôles, accéder à l'annuaire complet, créer des projets et tout éditer.",
  },
  EDITOR: {
    id: "EDITOR",
    label: "Éditeur (Utilisateur)",
    shortLabel: "Éditeur",
    badgeClass: "badge-info badge-soft",
    description:
      "Peut créer et éditer le nom des tickets, les tickets, les colonnes Kanban, les sprints et les éléments du diagramme de Gantt.",
  },
  VIEWER: {
    id: "VIEWER",
    label: "Visiteur",
    shortLabel: "Visiteur",
    badgeClass: "badge-ghost",
    description:
      "Accès en lecture seule : peut consulter les vues (Gantt, Kanban, Backlog, Globe 3D, Rapports) et ajouter des images de contexte (WebP) sur les tickets sans pouvoir les modifier.",
  },
};

export function isAdminRole(role?: UserRole | null): boolean {
  return role === "ADMIN";
}

export function canEditWorkspaceContent(role?: UserRole | null): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

export function canAttachImageToIssue(role?: UserRole | null): boolean {
  return role === "ADMIN" || role === "EDITOR" || role === "VIEWER";
}

export function isViewerOnly(role?: UserRole | null): boolean {
  return role === "VIEWER";
}

export function canAccessUsersDirectory(role?: UserRole | null): boolean {
  return role === "ADMIN";
}

export function canInviteUsers(role?: UserRole | null): boolean {
  return role === "ADMIN";
}

export function canChangeUserRole(role?: UserRole | null): boolean {
  return role === "ADMIN";
}

export function canCreateOrDeleteProject(role?: UserRole | null): boolean {
  return role === "ADMIN";
}

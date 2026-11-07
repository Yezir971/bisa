"use client";

import React, { useEffect, useMemo, useState, useTransition } from "react";
import type {
  GanttItem,
  Issue,
  Project,
  Sprint,
  User,
  Workspace,
} from "@/domain/entities";
import type {
  AttachIssueImageInput,
  CreateGanttItemInput,
  CreateIssueInput,
  CreateProjectInput,
  CreateSprintInput,
  InviteUserInput,
  RelationType,
  StatusCategory,
  UserRole,
} from "@/lib/validations/jira-schema";
import {
  canCreateOrDeleteProject,
  canEditWorkspaceContent,
  isAdminRole,
  ROLE_METADATA,
} from "@/domain/services/rbac";
import {
  addCommentAction,
  addIssueAttachmentAction,
  addProjectColumnAction,
  addRelationAction,
  addSubtaskAction,
  completeSprintAction,
  createGanttItemAction,
  createIssueAction,
  createProjectAction,
  createSprintAction,
  deleteGanttItemAction,
  deleteIssueAction,
  deleteProjectAction,
  deleteProjectColumnAction,
  inviteUserAction,
  logoutUserAction,
  removeIssueAttachmentAction,
  renameProjectColumnAction,
  startSprintAction,
  switchSessionUserAction,
  toggleSubtaskAction,
  updateGanttItemAction,
  updateIssueDetailsAction,
  updateIssueStatusAction,
  updateProjectWipLimitsAction,
  updateSprintAction,
  updateUserRoleAction,
} from "@/server/actions/jira-actions";
import { useToast } from "@/components/providers/toast-provider";
import { useTheme } from "@/components/providers/theme-provider";
import { AuthScreen } from "@/components/auth/auth-screen";
import { GanttView } from "@/components/gantt/gantt-view";
import { KanbanBoard } from "@/components/board/kanban-board";
import { BacklogView } from "@/components/backlog/backlog-view";
import { ObsidianGraphView } from "@/components/graph/obsidian-graph-view";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { UsersAdminView } from "@/components/users/users-admin-view";
import { SettingsView } from "@/components/settings/settings-view";
import { IssueDetailModal } from "@/components/issues/issue-detail-modal";
import {
  CreateIssueModal,
  CreateProjectModal,
  CreateSprintModal,
} from "@/components/issues/create-modals";
import { SpotlightModal } from "@/components/search/spotlight-modal";
import { UserAvatarBadge } from "@/components/ui/issue-badges";
import {
  BarChart3,
  CalendarRange,
  FolderKanban,
  FolderPlus,
  Globe,
  Layers,
  ListTodo,
  LogOut,
  Menu,
  Palette,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

export type AppSection =
  | "GANTT"
  | "BOARD"
  | "BACKLOG"
  | "GRAPH"
  | "ANALYTICS"
  | "USERS"
  | "SETTINGS";

interface JiraWorkspaceShellProps {
  initialData: {
    workspace: Workspace;
    users: User[];
    projects: Project[];
    sprints: Sprint[];
    issues: Issue[];
    ganttItems?: GanttItem[];
  };
  initialCurrentUser?: User | null;
}

export function JiraWorkspaceShell({
  initialData,
  initialCurrentUser = null,
}: JiraWorkspaceShellProps) {
  const { notifySuccess, notifyError, notifyWarning } = useToast();
  const { theme, setTheme, themes } = useTheme();
  const [isPending, startTransition] = useTransition();

  const [workspace] = useState<Workspace>(initialData.workspace);
  const [users, setUsers] = useState<User[]>(initialData.users);
  const [projects, setProjects] = useState<Project[]>(initialData.projects);
  const [sprints, setSprints] = useState<Sprint[]>(initialData.sprints);
  const [issues, setIssues] = useState<Issue[]>(initialData.issues);
  const [ganttItems, setGanttItems] = useState<GanttItem[]>(
    initialData.ganttItems || []
  );

  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(
    initialCurrentUser
  );
  // Le Diagramme de Gantt est placé en première étape du workflow projet
  const [activeSection, setActiveSection] = useState<AppSection>("GANTT");
  const [activeProjectId, setActiveProjectId] = useState<string>(
    initialData.projects[0]?.id || "proj-core"
  );
  const [currentUserId, setCurrentUserId] = useState<string>(
    initialCurrentUser?.id || initialData.users[0]?.id || "usr-1"
  );

  // Modals state
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [createIssueModalState, setCreateIssueModalState] = useState<{
    open: boolean;
    defaultStatus: StatusCategory;
  }>({ open: false, defaultStatus: "TODO" });
  const [isCreateProjectOpen, setIsCreateProjectOpen] =
    useState<boolean>(false);
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState<boolean>(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState<boolean>(false);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const activeProject = useMemo(
    () =>
      projects.find((p) => p.id === activeProjectId) ||
      projects[0],
    [projects, activeProjectId]
  );

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) || users[0],
    [users, currentUserId]
  );

  const isAdmin = isAdminRole(currentUser?.role);
  const canEdit = canEditWorkspaceContent(currentUser?.role);
  const canManageProjects = canCreateOrDeleteProject(currentUser?.role);

  // Redirige immédiatement hors de la vue USERS si l'utilisateur actif n'est pas Admin
  useEffect(() => {
    if (activeSection === "USERS" && !isAdmin) {
      setActiveSection("GANTT");
    }
  }, [activeSection, isAdmin]);

  const projectIssues = useMemo(
    () => issues.filter((i) => i.projectId === activeProject.id),
    [issues, activeProject.id]
  );

  const projectSprints = useMemo(
    () => sprints.filter((s) => s.projectId === activeProject.id),
    [sprints, activeProject.id]
  );

  const projectEpics = useMemo(
    () => projectIssues.filter((i) => i.type === "EPIC"),
    [projectIssues]
  );

  const projectGanttItems = useMemo(
    () => ganttItems.filter((g) => g.projectId === activeProject.id),
    [ganttItems, activeProject.id]
  );

  const selectedIssue = useMemo(
    () => issues.find((i) => i.id === selectedIssueId) || null,
    [issues, selectedIssueId]
  );

  // Optimistic + Server Action Mutations
  const handleMoveIssueStatus = async (
    issueId: string,
    newStatus: StatusCategory
  ) => {
    const targetIssue = issues.find((i) => i.id === issueId);
    if (!targetIssue || targetIssue.status === newStatus) return;

    // Optimistic UI update
    const previousIssues = [...issues];
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status: newStatus } : i))
    );

    // Check WIP limit warning
    const newColCount =
      projectIssues.filter((i) => i.status === newStatus && i.id !== issueId)
        .length + 1;
    const wipLimit = activeProject.wipLimits[newStatus] || 20;
    if (newStatus !== "DONE" && newColCount > wipLimit) {
      notifyWarning(
        `Seuil WIP dépassé sur "${newStatus}" (${newColCount}/${wipLimit})`,
        "Attention aux goulets d'étranglement dans le flux Kanban."
      );
    }

    const res = await updateIssueStatusAction(
      issueId,
      newStatus,
      currentUser.id
    );
    if (res.ok) {
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? res.data : i))
      );
      notifySuccess(
        `${targetIssue.key} déplacé vers ${newStatus}`
      );
    } else {
      setIssues(previousIssues);
      notifyError("Échec du déplacement du ticket", res.error);
    }
  };

  const handleCreateIssue = async (
    input: CreateIssueInput
  ): Promise<boolean> => {
    const res = await createIssueAction(input);
    if (res.ok) {
      setIssues((prev) => [res.data, ...prev]);
      notifySuccess(
        `Ticket ${res.data.key} créé avec succès`,
        res.data.title
      );
      return true;
    }
    notifyError("Impossible de créer le ticket", res.error);
    return false;
  };

  const handleUpdateIssueDetails = async (
    issueId: string,
    patch: Parameters<typeof updateIssueDetailsAction>[1]
  ) => {
    const res = await updateIssueDetailsAction(
      issueId,
      patch,
      currentUser.id
    );
    if (res.ok) {
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? res.data : i))
      );
      notifySuccess(`Ticket ${res.data.key} mis à jour`);
    } else {
      notifyError("Erreur lors de la mise à jour", res.error);
    }
  };

  const handleDeleteIssue = async (issueId: string) => {
    const target = issues.find((i) => i.id === issueId);
    const res = await deleteIssueAction(issueId);
    if (res.ok) {
      setIssues((prev) => prev.filter((i) => i.id !== issueId));
      notifySuccess(
        `Ticket ${target?.key || ""} supprimé définitivement`
      );
    } else {
      notifyError("Impossible de supprimer le ticket", res.error);
    }
  };

  const handleAddComment = async (issueId: string, body: string) => {
    const res = await addCommentAction(issueId, currentUser.id, body);
    if (res.ok) {
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? res.data : i))
      );
      notifySuccess("Commentaire publié");
    } else {
      notifyError("Impossible d'ajouter le commentaire", res.error);
    }
  };

  const handleAddSubtask = async (issueId: string, title: string) => {
    const res = await addSubtaskAction(issueId, title);
    if (res.ok) {
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? res.data : i))
      );
      notifySuccess("Sous-tâche ajoutée");
    } else {
      notifyError("Erreur sur la sous-tâche", res.error);
    }
  };

  const handleToggleSubtask = async (
    issueId: string,
    subtaskId: string
  ) => {
    const res = await toggleSubtaskAction(issueId, subtaskId);
    if (res.ok) {
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? res.data : i))
      );
    } else {
      notifyError("Erreur lors de la mise à jour", res.error);
    }
  };

  const handleAddRelation = async (
    sourceId: string,
    targetId: string,
    type: RelationType
  ) => {
    const res = await addRelationAction(sourceId, targetId, type);
    if (res.ok) {
      setIssues((prev) =>
        prev.map((i) => (i.id === sourceId ? res.data : i))
      );
      notifySuccess(
        "Dépendance enregistrée",
        "Le lien est immédiatement visible sur le Globe 3D des tâches."
      );
    } else {
      notifyError("Impossible de lier les tickets", res.error);
    }
  };

  const handleAttachImageToIssue = async (
    issueId: string,
    input: AttachIssueImageInput
  ) => {
    const res = await addIssueAttachmentAction(issueId, currentUser.id, input);
    if (res.ok) {
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? res.data : i))
      );
    } else {
      throw new Error(res.error);
    }
  };

  const handleRemoveImageFromIssue = async (
    issueId: string,
    attachmentId: string
  ) => {
    const res = await removeIssueAttachmentAction(
      issueId,
      attachmentId,
      currentUser.id
    );
    if (res.ok) {
      setIssues((prev) =>
        prev.map((i) => (i.id === issueId ? res.data : i))
      );
      notifySuccess("Image retirée du ticket");
    } else {
      notifyError("Impossible de retirer l'image", res.error);
    }
  };

  const handleCreateProject = async (
    input: CreateProjectInput
  ): Promise<boolean> => {
    const res = await createProjectAction(input, currentUser.id);
    if (res.ok) {
      setProjects((prev) => [...prev, res.data]);
      setActiveProjectId(res.data.id);
      notifySuccess(
        `Projet [${res.data.key}] ${res.data.name} créé`
      );
      return true;
    }
    notifyError("Impossible de créer le projet", res.error);
    return false;
  };

  const handleDeleteProject = async (projectId: string) => {
    const target = projects.find((p) => p.id === projectId);
    const res = await deleteProjectAction(projectId, currentUser.id);
    if (res.ok) {
      const remaining = projects.filter((p) => p.id !== projectId);
      setProjects(remaining);
      setIssues((prev) => prev.filter((i) => i.projectId !== projectId));
      setSprints((prev) => prev.filter((s) => s.projectId !== projectId));
      if (remaining[0]) {
        setActiveProjectId(remaining[0].id);
      }
      setActiveSection("BOARD");
      notifySuccess(`Projet ${target?.key || ""} supprimé`);
    } else {
      notifyError("Impossible de supprimer le projet", res.error);
    }
  };

  const handleCreateSprint = async (
    input: CreateSprintInput
  ): Promise<boolean> => {
    const res = await createSprintAction(input, currentUser.id);
    if (res.ok) {
      setSprints((prev) => [...prev, res.data]);
      notifySuccess(`Sprint "${res.data.name}" planifié`);
      return true;
    }
    notifyError("Impossible de créer le sprint", res.error);
    return false;
  };

  const handleUpdateSprint = async (
    sprintId: string,
    patch: Parameters<typeof updateSprintAction>[1]
  ) => {
    const res = await updateSprintAction(sprintId, patch, currentUser.id);
    if (res.ok) {
      setSprints((prev) =>
        prev.map((s) => (s.id === sprintId ? res.data : s))
      );
      notifySuccess(`Sprint "${res.data.name}" mis à jour`);
    } else {
      notifyError("Impossible de modifier le sprint", res.error);
    }
  };

  const handleInviteUser = async (
    input: InviteUserInput
  ): Promise<boolean> => {
    const res = await inviteUserAction(currentUser.id, input);
    if (res.ok) {
      const { user: invitedUser, emailDelivery } = res.data;
      setUsers((prev) => [...prev, invitedUser]);
      if (emailDelivery.sent) {
        notifySuccess(
          `E-mail d'invitation envoyé via Brevo à ${invitedUser.email}`,
          `Rôle attribué : ${ROLE_METADATA[invitedUser.role].label}`
        );
      } else if (emailDelivery.mode === "SIMULATED_NO_API_KEY") {
        notifySuccess(
          `${invitedUser.name} invité (${ROLE_METADATA[invitedUser.role].label})`,
          "Payload Brevo généré (configurez BREVO_API_KEY pour l'expédition SMTP Brevo en direct)."
        );
      } else {
        notifyWarning(
          `${invitedUser.name} ajouté, mais l'envoi Brevo a échoué`,
          emailDelivery.error
        );
      }
      return true;
    }
    notifyError("Impossible d'inviter cet utilisateur", res.error);
    return false;
  };

  const handleChangeUserRole = async (
    targetUserId: string,
    newRole: UserRole
  ) => {
    const res = await updateUserRoleAction(
      currentUser.id,
      targetUserId,
      newRole
    );
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUserId ? res.data : u))
      );
      if (authenticatedUser?.id === targetUserId) {
        setAuthenticatedUser(res.data);
      }
      notifySuccess(
        `Rôle de ${res.data.name} mis à jour`,
        `Nouveau rôle : ${ROLE_METADATA[res.data.role].label}`
      );
    } else {
      notifyError("Impossible de modifier le rôle", res.error);
    }
  };

  const handleStartSprint = async (sprintId: string) => {
    const res = await startSprintAction(sprintId);
    if (res.ok) {
      setSprints((prev) =>
        prev.map((s) => (s.id === sprintId ? res.data : s))
      );
      notifySuccess(`Sprint "${res.data.name}" démarré !`);
    } else {
      notifyError("Impossible de démarrer le sprint", res.error);
    }
  };

  const handleCompleteSprint = async (
    sprintId: string,
    moveToSprintId: string | null
  ) => {
    const res = await completeSprintAction(sprintId, moveToSprintId);
    if (res.ok) {
      setSprints((prev) =>
        prev.map((s) => (s.id === sprintId ? res.data : s))
      );
      setIssues((prev) =>
        prev.map((i) =>
          i.sprintId === sprintId && i.status !== "DONE"
            ? { ...i, sprintId: moveToSprintId }
            : i
        )
      );
      notifySuccess(
        `Sprint "${res.data.name}" clôturé avec ${res.data.completedPoints} SP livrés`
      );
    } else {
      notifyError("Impossible de clôturer le sprint", res.error);
    }
  };

  const handleUpdateWipLimits = async (
    projectId: string,
    wipLimits: Record<StatusCategory, number>
  ) => {
    const res = await updateProjectWipLimitsAction(projectId, wipLimits);
    if (res.ok) {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? res.data : p))
      );
      notifySuccess("Seuils WIP du projet mis à jour");
    } else {
      notifyError("Erreur lors de la sauvegarde WIP", res.error);
    }
  };

  const handleRenameColumn = async (
    columnId: StatusCategory,
    newLabel: string
  ) => {
    const res = await renameProjectColumnAction(
      activeProject.id,
      columnId,
      newLabel
    );
    if (res.ok) {
      setProjects((prev) =>
        prev.map((p) => (p.id === activeProject.id ? res.data : p))
      );
      notifySuccess(`Catégorie renommée en "${newLabel}"`);
    } else {
      notifyError("Impossible de renommer la catégorie", res.error);
    }
  };

  const handleAddColumn = async (
    label: string,
    colorVariant:
      | "neutral"
      | "info"
      | "warning"
      | "success"
      | "secondary"
      | "primary"
      | "accent",
    wipLimit: number
  ) => {
    const res = await addProjectColumnAction(
      activeProject.id,
      label,
      colorVariant,
      wipLimit
    );
    if (res.ok) {
      setProjects((prev) =>
        prev.map((p) => (p.id === activeProject.id ? res.data : p))
      );
      notifySuccess(
        `Catégorie "${label}" ajoutée`,
        "Vous pouvez maintenant y glisser ou créer des tickets."
      );
    } else {
      notifyError("Impossible d'ajouter la catégorie", res.error);
    }
  };

  const handleDeleteColumn = async (columnId: StatusCategory) => {
    const res = await deleteProjectColumnAction(activeProject.id, columnId);
    if (res.ok) {
      setProjects((prev) =>
        prev.map((p) => (p.id === activeProject.id ? res.data : p))
      );
      const fallbackStatus = res.data.columns?.[0]?.id || "TODO";
      setIssues((prev) =>
        prev.map((i) =>
          i.projectId === activeProject.id && i.status === columnId
            ? { ...i, status: fallbackStatus }
            : i
        )
      );
      notifySuccess("Catégorie supprimée du tableau");
    } else {
      notifyError("Impossible de supprimer la catégorie", res.error);
    }
  };

  const handleCreateGanttItem = async (
    input: CreateGanttItemInput
  ): Promise<boolean> => {
    const res = await createGanttItemAction(input);
    if (res.ok) {
      setGanttItems((prev) => [...prev, res.data.ganttItem]);
      if (res.data.createdEpic) {
        const epic = res.data.createdEpic;
        setIssues((prev) => [epic, ...prev]);
        notifySuccess(
          `Epic [${epic.key}] créé et synchronisé`,
          "Planifié sur le Gantt et disponible dans le Backlog & Kanban."
        );
      } else {
        notifySuccess(
          `Étape [${res.data.ganttItem.wbsCode}] ajoutée au Gantt`,
          res.data.ganttItem.title
        );
      }
      return true;
    }
    notifyError("Impossible d'ajouter l'étape au Gantt", res.error);
    return false;
  };

  const handleUpdateGanttItem = async (
    ganttId: string,
    patch: Parameters<typeof updateGanttItemAction>[1]
  ) => {
    const res = await updateGanttItemAction(ganttId, patch);
    if (res.ok) {
      setGanttItems((prev) =>
        prev.map((g) => (g.id === ganttId ? res.data : g))
      );
      notifySuccess(`Étape [${res.data.wbsCode}] mise à jour`);
    } else {
      notifyError("Erreur lors de la mise à jour du Gantt", res.error);
    }
  };

  const handleDeleteGanttItem = async (ganttId: string) => {
    const res = await deleteGanttItemAction(ganttId);
    if (res.ok) {
      setGanttItems((prev) => prev.filter((g) => g.id !== ganttId));
      notifySuccess("Étape retirée du diagramme de Gantt");
    } else {
      notifyError("Impossible de supprimer l'étape Gantt", res.error);
    }
  };

  const handleAuthenticated = (user: User) => {
    setUsers((prev) =>
      prev.some((u) => u.id === user.id) ? prev : [...prev, user]
    );
    setAuthenticatedUser(user);
    setCurrentUserId(user.id);
  };

  const handleLogout = async () => {
    await logoutUserAction();
    setAuthenticatedUser(null);
    notifySuccess(
      "Session fermée",
      "Vous avez été déconnecté de votre espace de travail."
    );
  };

  if (!authenticatedUser) {
    return (
      <AuthScreen
        demoUsers={users}
        onAuthenticated={handleAuthenticated}
      />
    );
  }

  const sectionLabels: Record<AppSection, string> = {
    GANTT: "Diagramme de Gantt & Feuille de Route",
    BOARD: "Tableau Agile Kanban",
    BACKLOG: "Backlog & Sprints Scrum",
    GRAPH: "Globe 3D & Réseau des Tâches",
    ANALYTICS: "Tableaux de Bord & Métriques",
    USERS: "Administration des Utilisateurs & Rôles",
    SETTINGS: "Paramètres & Thèmes",
  };

  // Un compte de démonstration par rôle (Admin, Éditeur, Visiteur) pour tester facilement les droits RBAC
  const demoRoleProfiles = useMemo(() => {
    const adminUser = users.find((u) => u.role === "ADMIN");
    const editorUser = users.find((u) => u.role === "EDITOR");
    const viewerUser = users.find((u) => u.role === "VIEWER");
    return [adminUser, editorUser, viewerUser].filter(
      (u): u is User => Boolean(u)
    );
  }, [users]);

  return (
    <div className="drawer lg:drawer-open min-h-screen w-full max-w-full bg-base-200 text-base-content overflow-x-clip">
      <input
        id="bisa-app-drawer"
        type="checkbox"
        className="drawer-toggle"
      />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col min-w-0 max-w-full overflow-x-clip">
        {/* Sticky Top Navbar */}
        <header className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-30 px-4 gap-3">
          {/* Mobile Drawer Hamburger */}
          <div className="flex-none lg:hidden">
            <label
              htmlFor="bisa-app-drawer"
              className="btn btn-square btn-ghost btn-sm"
              aria-label="Ouvrir le menu latéral"
            >
              <Menu className="size-5" aria-hidden="true" />
            </label>
          </div>

          {/* Breadcrumbs & Page Title (Single h1) */}
          <div className="flex-1 min-w-0">
            <div className="breadcrumbs text-xs py-0 hidden sm:block">
              <ul>
                <li className="text-base-content/60">{workspace.name}</li>
                <li>
                  <span className="font-mono font-semibold text-primary">
                    [{activeProject.key}]
                  </span>{" "}
                  {activeProject.name}
                </li>
                <li className="font-semibold">
                  {sectionLabels[activeSection]}
                </li>
              </ul>
            </div>
            <h1 className="text-sm sm:text-base font-bold truncate">
              {activeProject.name} — {sectionLabels[activeSection]}
            </h1>
          </div>

          {/* Right Navbar Actions */}
          <div className="flex-none flex items-center gap-2">
            {/* Spotlight Search Trigger Cmd+K */}
            <button
              type="button"
              onClick={() => setIsSpotlightOpen(true)}
              className="btn btn-ghost btn-sm bg-base-200/80 gap-2 font-normal text-base-content/70"
              aria-label="Ouvrir la recherche globale rapide"
            >
              <Search className="size-4" aria-hidden="true" />
              <span className="hidden md:inline text-xs">
                Rechercher un ticket...
              </span>
              <kbd className="kbd kbd-xs hidden sm:inline-flex">⌘K</kbd>
            </button>

            {/* Quick Theme Switcher Dropdown */}
            <div className="dropdown dropdown-end">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost btn-sm gap-1.5"
                aria-label="Changer le thème de l'application"
              >
                <Palette className="size-4 text-primary" aria-hidden="true" />
                <span className="hidden xl:inline text-xs capitalize">
                  {theme}
                </span>
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-40 w-52 p-2 shadow-xl border border-base-300 text-xs"
              >
                <li className="menu-title text-[10px] uppercase">
                  Thèmes d&apos;interface
                </li>
                {themes.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setTheme(t.id, currentUser.id);
                        notifySuccess(`Thème "${t.label}" activé`);
                      }}
                      className={theme === t.id ? "menu-active" : ""}
                    >
                      <span className="flex-1 text-left">{t.label}</span>
                      <span className="badge badge-ghost badge-xs">
                        {t.category}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary CTA Button (Affiché uniquement pour Admin & Éditeur) */}
            {canEdit ? (
              <button
                type="button"
                onClick={() =>
                  setCreateIssueModalState({
                    open: true,
                    defaultStatus: "TODO",
                  })
                }
                className="btn btn-primary btn-sm gap-1.5"
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <Plus className="size-4" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">Créer un ticket</span>
              </button>
            ) : (
              <span className="badge badge-ghost badge-sm font-semibold hidden sm:inline-flex">
                Visiteur (Lecture seule)
              </span>
            )}

            {/* User Profile & Role Switcher Dropdown */}
            <div className="dropdown dropdown-end">
              <button
                type="button"
                tabIndex={0}
                className="btn btn-ghost btn-sm gap-2 px-2"
                aria-label="Profil utilisateur actif"
              >
                <UserAvatarBadge user={currentUser} size="sm" />
                <span
                  className={`badge badge-xs hidden md:inline-flex font-semibold ${ROLE_METADATA[currentUser.role].badgeClass}`}
                >
                  {ROLE_METADATA[currentUser.role].shortLabel}
                </span>
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-40 w-72 p-2 shadow-xl border border-base-300 text-xs"
              >
                <li className="menu-title">
                  <span>
                    {currentUser.name} ·{" "}
                    <strong>{ROLE_METADATA[currentUser.role].label}</strong>
                  </span>
                </li>
                {isAdmin && (
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveSection("USERS")}
                      className="text-primary font-semibold"
                    >
                      <Users className="size-3.5" aria-hidden="true" />
                      <span>
                        Gérer tous les utilisateurs ({users.length})
                      </span>
                    </button>
                  </li>
                )}
                <li className="menu-title text-[10px] uppercase pt-1">
                  Tester un rôle (Profils démo)
                </li>
                {demoRoleProfiles.map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      onClick={async () => {
                        setCurrentUserId(u.id);
                        setAuthenticatedUser(u);
                        await switchSessionUserAction(u.id);
                        notifySuccess(
                          `Session active : ${u.name}`,
                          `Rôle : ${ROLE_METADATA[u.role].label}`
                        );
                      }}
                      className={u.id === currentUser.id ? "menu-active" : ""}
                    >
                      <span className="font-semibold flex-1 text-left truncate">
                        {u.name}
                      </span>
                      <span
                        className={`badge badge-xs ${ROLE_METADATA[u.role].badgeClass}`}
                      >
                        {ROLE_METADATA[u.role].shortLabel}
                      </span>
                    </button>
                  </li>
                ))}
                <div className="divider my-1"></div>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-error font-medium"
                  >
                    <LogOut className="size-3.5" aria-hidden="true" />
                    <span>Se déconnecter</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Main Workspace Viewport */}
        <main className="p-4 lg:p-6 space-y-6 max-w-screen-2xl w-full mx-auto flex-1">
          {activeSection === "GANTT" && (
            <GanttView
              project={activeProject}
              ganttItems={projectGanttItems}
              issues={projectIssues}
              users={users}
              currentUserId={currentUser.id}
              onCreateGanttItem={handleCreateGanttItem}
              onUpdateGanttItem={handleUpdateGanttItem}
              onDeleteGanttItem={handleDeleteGanttItem}
              onSelectIssue={(iss) => setSelectedIssueId(iss.id)}
              onNavigateToBoard={() => setActiveSection("BOARD")}
              canEdit={canEdit}
            />
          )}

          {activeSection === "BOARD" && (
            <KanbanBoard
              project={activeProject}
              issues={projectIssues}
              users={users}
              sprints={projectSprints}
              currentUserId={currentUser.id}
              onMoveIssueStatus={handleMoveIssueStatus}
              onSelectIssue={(iss) => setSelectedIssueId(iss.id)}
              onOpenCreateIssue={(st = "TODO") =>
                setCreateIssueModalState({ open: true, defaultStatus: st })
              }
              onRenameColumn={handleRenameColumn}
              onAddColumn={handleAddColumn}
              onDeleteColumn={handleDeleteColumn}
              onRenameIssueTitle={(issueId, newTitle) =>
                handleUpdateIssueDetails(issueId, { title: newTitle })
              }
              canEdit={canEdit}
            />
          )}

          {activeSection === "BACKLOG" && (
            <BacklogView
              project={activeProject}
              issues={projectIssues}
              sprints={projectSprints}
              users={users}
              onSelectIssue={(iss) => setSelectedIssueId(iss.id)}
              onAssignIssueToSprint={(issueId, sprintId) =>
                void handleUpdateIssueDetails(issueId, { sprintId })
              }
              onUpdateStoryPoints={(issueId, storyPoints) =>
                void handleUpdateIssueDetails(issueId, { storyPoints })
              }
              onStartSprint={handleStartSprint}
              onCompleteSprint={handleCompleteSprint}
              onUpdateSprint={handleUpdateSprint}
              onOpenCreateSprint={() => setIsCreateSprintOpen(true)}
              onOpenCreateIssue={() =>
                setCreateIssueModalState({
                  open: true,
                  defaultStatus: "TODO",
                })
              }
              canEdit={canEdit}
            />
          )}

          {activeSection === "GRAPH" && (
            <ObsidianGraphView
              projects={projects}
              issues={issues}
              onSelectIssue={(iss) => setSelectedIssueId(iss.id)}
              onSelectProject={(projId) => {
                setActiveProjectId(projId);
                notifySuccess("Projet ciblé depuis le Globe 3D");
              }}
            />
          )}

          {activeSection === "ANALYTICS" && (
            <AnalyticsDashboard
              issues={projectIssues}
              sprints={projectSprints}
              users={users}
              onOpenCreateIssue={() =>
                setCreateIssueModalState({
                  open: true,
                  defaultStatus: "TODO",
                })
              }
            />
          )}

          {activeSection === "USERS" && (
            <UsersAdminView
              workspace={workspace}
              users={users}
              currentUser={currentUser}
              onInviteUser={handleInviteUser}
              onChangeUserRole={handleChangeUserRole}
            />
          )}

          {activeSection === "SETTINGS" && (
            <SettingsView
              workspace={workspace}
              activeProject={activeProject}
              projects={projects}
              users={users}
              currentUserId={currentUser.id}
              onUpdateWipLimits={handleUpdateWipLimits}
              onDeleteProject={handleDeleteProject}
              onThemeChangedToast={(label) =>
                notifySuccess(
                  `Thème "${label}" appliqué`,
                  "Préférence sauvegardée dans les paramètres."
                )
              }
              onOpenUsersDirectory={
                isAdmin ? () => setActiveSection("USERS") : undefined
              }
              onLogout={handleLogout}
            />
          )}
        </main>
      </div>

      {/* Left Sidebar Drawer (Sticky on Desktop) */}
      <div className="drawer-side z-40 lg:sticky lg:top-0 lg:h-dvh overflow-x-hidden">
        <label
          htmlFor="bisa-app-drawer"
          aria-label="Fermer le menu latéral"
          className="drawer-overlay"
        ></label>
        <aside className="bg-base-100 border-r border-base-300 w-72 min-h-full lg:h-dvh overflow-y-auto overflow-x-hidden flex flex-col justify-between p-4">
          <div className="space-y-5">
            {/* Brand Header */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary text-primary-content size-8 rounded-box flex items-center justify-center font-black text-base shadow-xs">
                  B
                </div>
                <div>
                  <p className="font-bold text-sm leading-tight">
                    Bisa Workspace
                  </p>
                  <p className="text-[11px] text-base-content/60">
                    Gestion de projets & Sprints
                  </p>
                </div>
              </div>
              <span className="badge badge-primary badge-soft badge-xs">
                Entreprise
              </span>
            </div>

            {/* Project Switcher Section (Création réservée aux Admins) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                  Projets ({projects.length})
                </span>
                {canManageProjects && (
                  <button
                    type="button"
                    onClick={() => setIsCreateProjectOpen(true)}
                    className="btn btn-ghost btn-xs gap-1 text-primary"
                  >
                    <FolderPlus className="size-3.5" aria-hidden="true" />
                    Nouveau
                  </button>
                )}
              </div>

              <ul className="menu menu-sm bg-base-200/60 rounded-box p-1.5 gap-1 w-full">
                {projects.map((p) => {
                  const count = issues.filter(
                    (i) => i.projectId === p.id
                  ).length;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() =>
                          startTransition(() => {
                            setActiveProjectId(p.id);
                          })
                        }
                        className={`flex items-center justify-between ${
                          p.id === activeProject.id ? "menu-active" : ""
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span className="badge badge-neutral badge-xs font-mono">
                            {p.key}
                          </span>
                          <span className="truncate font-medium">
                            {p.name}
                          </span>
                        </span>
                        <span className="badge badge-ghost badge-xs tabular-nums">
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Main Navigation Menu */}
            <nav aria-label="Navigation principale du projet" className="space-y-1">
              <span className="px-2 text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                Pilotage & Vues
              </span>
              <ul className="menu menu-sm w-full p-0 gap-1">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveSection("GANTT")}
                    className={
                      activeSection === "GANTT" ? "menu-active" : ""
                    }
                  >
                    <CalendarRange
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                    <span className="flex-1 text-left">
                      Diagramme de Gantt
                    </span>
                    <span className="badge badge-primary badge-soft badge-xs">
                      Étape 1
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveSection("BOARD")}
                    className={
                      activeSection === "BOARD" ? "menu-active" : ""
                    }
                  >
                    <FolderKanban className="size-4" aria-hidden="true" />
                    <span>Tableau Kanban & Scrum</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveSection("BACKLOG")}
                    className={
                      activeSection === "BACKLOG" ? "menu-active" : ""
                    }
                  >
                    <ListTodo className="size-4" aria-hidden="true" />
                    <span>Backlog & Planification</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveSection("GRAPH")}
                    className={
                      activeSection === "GRAPH" ? "menu-active" : ""
                    }
                  >
                    <Globe className="size-4 text-secondary" aria-hidden="true" />
                    <span className="flex-1 text-left">
                      Globe 3D & Réseau des Tâches
                    </span>
                    <span className="badge badge-secondary badge-soft badge-xs">
                      3D
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveSection("ANALYTICS")}
                    className={
                      activeSection === "ANALYTICS" ? "menu-active" : ""
                    }
                  >
                    <BarChart3 className="size-4 text-info" aria-hidden="true" />
                    <span>Rapports & Graphiques</span>
                  </button>
                </li>
                {isAdmin && (
                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveSection("USERS")}
                      className={
                        activeSection === "USERS" ? "menu-active" : ""
                      }
                    >
                      <Users
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                      <span className="flex-1 text-left">
                        Utilisateurs & Rôles
                      </span>
                      <span className="badge badge-primary badge-soft badge-xs">
                        Admin
                      </span>
                    </button>
                  </li>
                )}
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveSection("SETTINGS")}
                    className={
                      activeSection === "SETTINGS" ? "menu-active" : ""
                    }
                  >
                    <Settings className="size-4" aria-hidden="true" />
                    <span className="flex-1 text-left">
                      Paramètres & Thèmes
                    </span>
                    <span className="badge badge-ghost badge-xs capitalize">
                      {theme}
                    </span>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Epics Quick Overview */}
            <div className="space-y-1.5 pt-2 border-t border-base-300">
              <span className="px-2 text-[11px] font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
                <Layers className="size-3.5 text-secondary" aria-hidden="true" />
                Epics du Projet ({projectEpics.length})
              </span>
              <div className="space-y-1.5 px-1">
                {projectEpics.map((ep) => {
                  const childIssues = projectIssues.filter(
                    (i) => i.epicId === ep.id
                  );
                  const doneCount = childIssues.filter(
                    (i) => i.status === "DONE"
                  ).length;
                  const pct =
                    childIssues.length > 0
                      ? Math.round((doneCount / childIssues.length) * 100)
                      : ep.status === "DONE"
                        ? 100
                        : 0;
                  return (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => setSelectedIssueId(ep.id)}
                      className="w-full text-left p-2 rounded-field bg-base-200/50 hover:bg-base-200 transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-secondary">
                          {ep.key}
                        </span>
                        <span className="tabular-nums text-[11px] text-base-content/60">
                          {pct} %
                        </span>
                      </div>
                      <p className="text-xs font-medium truncate">
                        {ep.title}
                      </p>
                      <progress
                        className="progress progress-secondary w-full h-1"
                        value={pct}
                        max={100}
                        aria-label={`Avancement de l'Epic ${ep.key}`}
                      ></progress>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <footer className="pt-4 border-t border-base-300 px-2 flex items-center justify-between text-[11px] text-base-content/60">
            <span className="flex items-center gap-1.5 truncate">
              <Sparkles className="size-3.5 text-primary shrink-0" aria-hidden="true" />
              <span className="truncate">{currentUser.name}</span>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="link link-hover text-error font-medium"
            >
              Déconnexion
            </button>
          </footer>
        </aside>
      </div>

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        allIssues={issues}
        projects={projects}
        sprints={projectSprints}
        users={users}
        currentUserId={currentUser.id}
        onClose={() => setSelectedIssueId(null)}
        onUpdateStatus={handleMoveIssueStatus}
        onUpdateDetails={handleUpdateIssueDetails}
        onAddComment={handleAddComment}
        onAddSubtask={handleAddSubtask}
        onToggleSubtask={handleToggleSubtask}
        onAddRelation={handleAddRelation}
        onAttachImage={handleAttachImageToIssue}
        onRemoveImage={handleRemoveImageFromIssue}
        onDeleteIssue={handleDeleteIssue}
        canEdit={canEdit}
      />

      {/* Create Issue Modal */}
      <CreateIssueModal
        isOpen={createIssueModalState.open}
        defaultProjectId={activeProject.id}
        defaultStatus={createIssueModalState.defaultStatus}
        projects={projects}
        sprints={projectSprints}
        users={users}
        epics={projectEpics}
        currentUserId={currentUser.id}
        onClose={() =>
          setCreateIssueModalState({ open: false, defaultStatus: "TODO" })
        }
        onSubmit={handleCreateIssue}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        users={users}
        currentUserId={currentUser.id}
        onClose={() => setIsCreateProjectOpen(false)}
        onSubmit={handleCreateProject}
      />

      {/* Create Sprint Modal */}
      <CreateSprintModal
        isOpen={isCreateSprintOpen}
        projectId={activeProject.id}
        onClose={() => setIsCreateSprintOpen(false)}
        onSubmit={handleCreateSprint}
      />

      {/* Spotlight Search Cmd+K Modal */}
      <SpotlightModal
        isOpen={isSpotlightOpen}
        issues={issues}
        projects={projects}
        onClose={() => setIsSpotlightOpen(false)}
        onSelectIssue={(iss) => {
          setActiveProjectId(iss.projectId);
          setSelectedIssueId(iss.id);
        }}
        onSelectProject={(projId) => {
          setActiveProjectId(projId);
          setActiveSection("BOARD");
        }}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import type { Project, User, Workspace } from "@/domain/entities";
import type {
  StatusCategory,
  ThemeName,
} from "@/lib/validations/jira-schema";
import {
  canEditWorkspaceContent,
  isAdminRole,
  ROLE_METADATA,
} from "@/domain/services/rbac";
import { useTheme } from "@/components/providers/theme-provider";
import { UserAvatarBadge } from "@/components/ui/issue-badges";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
  Check,
  Lock,
  LogOut,
  Palette,
  Settings,
  Sliders,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";

interface SettingsViewProps {
  workspace: Workspace;
  activeProject: Project;
  projects: Project[];
  users: User[];
  currentUserId: string;
  onUpdateWipLimits: (
    projectId: string,
    wipLimits: Record<StatusCategory, number>
  ) => Promise<void>;
  onDeleteProject: (projectId: string) => Promise<void>;
  onThemeChangedToast: (themeLabel: string) => void;
  onOpenUsersDirectory?: () => void;
  onLogout?: () => void;
}

export function SettingsView({
  workspace,
  activeProject,
  projects,
  users,
  currentUserId,
  onUpdateWipLimits,
  onDeleteProject,
  onThemeChangedToast,
  onOpenUsersDirectory,
  onLogout,
}: SettingsViewProps) {
  const { theme, setTheme, themes } = useTheme();
  const [activeTab, setActiveTab] = useState<
    "THEMES" | "PROJECT" | "ACCOUNT"
  >("THEMES");
  const currentUser =
    users.find((u) => u.id === currentUserId) || users[0];
  const isAdmin = isAdminRole(currentUser?.role);
  const canEdit = canEditWorkspaceContent(currentUser?.role);

  const [wipTodo, setWipTodo] = useState<number>(
    activeProject.wipLimits.TODO || 12
  );
  const [wipInProgress, setWipInProgress] = useState<number>(
    activeProject.wipLimits.IN_PROGRESS || 4
  );
  const [wipInReview, setWipInReview] = useState<number>(
    activeProject.wipLimits.IN_REVIEW || 3
  );
  const [isSavingWip, setIsSavingWip] = useState<boolean>(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] =
    useState<boolean>(false);

  const handleSelectTheme = (newTheme: ThemeName, label: string) => {
    setTheme(newTheme, currentUserId);
    onThemeChangedToast(label);
  };

  const handleSaveWip = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingWip(true);
    try {
      await onUpdateWipLimits(activeProject.id, {
        TODO: wipTodo,
        IN_PROGRESS: wipInProgress,
        IN_REVIEW: wipInReview,
        DONE: 50,
      });
    } finally {
      setIsSavingWip(false);
    }
  };

  const handleConfirmDeleteProject = async () => {
    setIsSavingWip(true);
    try {
      await onDeleteProject(activeProject.id);
      setShowDeleteProjectModal(false);
    } finally {
      setIsSavingWip(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-base-100 border border-base-300 p-4 rounded-box shadow-xs">
        <div>
          <h2 className="text-base font-bold text-base-content flex items-center gap-2">
            <Settings className="size-5 text-primary" aria-hidden="true" />
            Paramètres de l&apos;Application & Personnalisation
          </h2>
          <p className="text-xs text-base-content/70">
            Personnalisez le thème visuel en temps réel, configurez les limites WIP du workflow et gérez votre compte et votre équipe.
          </p>
        </div>

        <div role="tablist" className="tabs tabs-box tabs-sm">
          <button
            type="button"
            role="tab"
            onClick={() => setActiveTab("THEMES")}
            className={`tab gap-1.5 ${
              activeTab === "THEMES" ? "tab-active" : ""
            }`}
          >
            <Palette className="size-3.5" aria-hidden="true" />
            Apparence & Thèmes
          </button>
          <button
            type="button"
            role="tab"
            onClick={() => setActiveTab("PROJECT")}
            className={`tab gap-1.5 ${
              activeTab === "PROJECT" ? "tab-active" : ""
            }`}
          >
            <Sliders className="size-3.5" aria-hidden="true" />
            Workflow & Limites WIP
          </button>
          {isAdmin && onOpenUsersDirectory && (
            <button
              type="button"
              role="tab"
              onClick={onOpenUsersDirectory}
              className="tab gap-1.5 text-primary font-semibold"
            >
              <Users className="size-3.5" aria-hidden="true" />
              Annuaire Utilisateurs (Admin)
            </button>
          )}
          <button
            type="button"
            role="tab"
            onClick={() => setActiveTab("ACCOUNT")}
            className={`tab gap-1.5 ${
              activeTab === "ACCOUNT" ? "tab-active" : ""
            }`}
          >
            <UserCheck className="size-3.5" aria-hidden="true" />
            Mon Compte & Rôle
          </button>
        </div>
      </div>

      {/* TAB 1: THEME SWITCHER GALLERY */}
      {activeTab === "THEMES" && (
        <section
          className="card bg-base-100 border border-base-300 shadow-xs"
          aria-labelledby="themes-gallery-title"
        >
          <div className="card-body p-6 gap-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-base-300 pb-4">
              <div>
                <h3
                  id="themes-gallery-title"
                  className="text-base font-bold text-base-content"
                >
                  Thème Visuel de l&apos;Espace de Travail
                </h3>
                <p className="text-xs text-base-content/70 mt-0.5">
                  Le thème sélectionné s&apos;applique instantanément à toute l&apos;interface, aux graphiques analytiques et à la cartographie 3D.
                </p>
              </div>
              <span className="badge badge-primary badge-soft badge-sm">
                Thème actif : {theme.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {themes.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTheme(t.id, t.label)}
                    className={`text-left rounded-box border-2 transition-all overflow-hidden cursor-pointer ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/30 shadow-md"
                        : "border-base-300 hover:border-primary/50"
                    }`}
                  >
                    {/* Live Nested Theme Preview Box */}
                    <div
                      data-theme={t.id}
                      className="bg-base-100 text-base-content p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{t.label}</span>
                        <span className="badge badge-soft badge-xs">
                          {t.category}
                        </span>
                      </div>

                      <p className="text-xs text-base-content/70 line-clamp-2 min-h-[2.25rem]">
                        {t.description}
                      </p>

                      {/* Color Swatch Strip */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <span
                          className="size-5 rounded-full bg-primary"
                          title="primary"
                        ></span>
                        <span
                          className="size-5 rounded-full bg-secondary"
                          title="secondary"
                        ></span>
                        <span
                          className="size-5 rounded-full bg-accent"
                          title="accent"
                        ></span>
                        <span
                          className="size-5 rounded-full bg-info"
                          title="info"
                        ></span>
                        <span
                          className="size-5 rounded-full bg-success"
                          title="success"
                        ></span>
                        <span
                          className="size-5 rounded-full bg-warning"
                          title="warning"
                        ></span>
                        <span
                          className="size-5 rounded-full bg-error"
                          title="error"
                        ></span>
                      </div>

                      {/* Mini UI Preview */}
                      <div className="bg-base-200 p-2 rounded-field flex items-center justify-between">
                        <span className="badge badge-primary badge-xs">
                          CORE-1
                        </span>
                        {isSelected ? (
                          <span className="badge badge-success badge-xs gap-1">
                            <Check className="size-3" aria-hidden="true" />
                            Actif
                          </span>
                        ) : (
                          <span className="text-[11px] text-base-content/60">
                            Appliquer
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: PROJECT & WIP LIMITS */}
      {activeTab === "PROJECT" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="card bg-base-100 border border-base-300 shadow-xs">
            <div className="card-body p-6 gap-4">
              <h3 className="text-base font-bold">
                Limites WIP (Work In Progress) — [{activeProject.key}]{" "}
                {activeProject.name}
              </h3>
              <p className="text-xs text-base-content/70">
                Définissez le nombre maximal de tickets recommandés par colonne Kanban avant déclenchement d&apos;une alerte de goulet d&apos;étranglement.
              </p>

              <form onSubmit={handleSaveWip} className="space-y-4">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">
                    Limite Colonne &laquo; À faire (TODO) &raquo;
                  </legend>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    disabled={!canEdit}
                    className="input input-sm w-full tabular-nums"
                    value={wipTodo}
                    onChange={(e) => setWipTodo(Number(e.target.value))}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">
                    Limite Colonne &laquo; En cours (IN PROGRESS) &raquo;
                  </legend>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    disabled={!canEdit}
                    className="input input-sm w-full tabular-nums"
                    value={wipInProgress}
                    onChange={(e) => setWipInProgress(Number(e.target.value))}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">
                    Limite Colonne &laquo; En revue (IN REVIEW) &raquo;
                  </legend>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    disabled={!canEdit}
                    className="input input-sm w-full tabular-nums"
                    value={wipInReview}
                    onChange={(e) => setWipInReview(Number(e.target.value))}
                  />
                </fieldset>

                {canEdit ? (
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingWip}
                      className="btn btn-primary btn-sm"
                    >
                      {isSavingWip && (
                        <span className="loading loading-spinner loading-xs"></span>
                      )}
                      Enregistrer les seuils WIP
                    </button>
                  </div>
                ) : (
                  <div className="alert alert-info alert-soft text-xs">
                    <span>
                      Mode Visiteur : les seuils WIP sont affichés en lecture seule.
                    </span>
                  </div>
                )}
              </form>
            </div>
          </section>

          {isAdmin ? (
            <section className="card bg-base-100 border border-error/40 shadow-xs">
              <div className="card-body p-6 gap-4 justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-error flex items-center gap-2">
                    <Trash2 className="size-4" aria-hidden="true" />
                    Zone Sensible — Suppression du Projet (Admin)
                  </h3>
                  <p className="text-xs text-base-content/70 leading-relaxed">
                    La suppression du projet <strong>{activeProject.name}</strong>{" "}
                    entraînera la suppression irréversible de tous ses sprints, de ses tickets (`{activeProject.key}-*`) et de ses nœuds dans le Globe 3D.
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={projects.length <= 1}
                    onClick={() => setShowDeleteProjectModal(true)}
                    className="btn btn-error btn-sm gap-1.5"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    Supprimer le projet {activeProject.key}
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <section className="card bg-base-100 border border-base-300 shadow-xs">
              <div className="card-body p-6 gap-3 justify-center items-start">
                <div className="flex items-center gap-2 text-xs font-bold text-base-content/70">
                  <Lock className="size-4 text-primary" aria-hidden="true" />
                  Administration des Projets réservée aux Admins
                </div>
                <p className="text-xs text-base-content/70 leading-relaxed">
                  La création et la suppression de projets ainsi que la gestion des rôles utilisateurs sont exclusivement réservées aux comptes{" "}
                  <strong>Administrateur</strong>.
                </p>
              </div>
            </section>
          )}
        </div>
      )}

      {/* TAB 3: MON COMPTE & SESSION */}
      {activeTab === "ACCOUNT" && currentUser && (
        <section className="card bg-base-100 border border-base-300 shadow-xs">
          <div className="card-body p-6 gap-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-300 pb-4">
              <div className="flex items-center gap-3">
                <UserAvatarBadge user={currentUser} size="md" />
                <div>
                  <h3 className="text-base font-bold">{currentUser.name}</h3>
                  <p className="text-xs text-base-content/70">
                    {currentUser.email} · {currentUser.department} · {workspace.name}
                  </p>
                </div>
              </div>
              <span
                className={`badge badge-sm font-semibold ${ROLE_METADATA[currentUser.role].badgeClass}`}
              >
                Rôle : {ROLE_METADATA[currentUser.role].label}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-base-200/60 border border-base-300 rounded-box p-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="status status-success"></span>
                  Permissions du Rôle ({ROLE_METADATA[currentUser.role].shortLabel})
                </div>
                <p className="text-sm font-semibold">
                  {ROLE_METADATA[currentUser.role].label}
                </p>
                <p className="text-xs text-base-content/60">
                  {ROLE_METADATA[currentUser.role].description}
                </p>
              </div>

              <div className="bg-base-200/60 border border-base-300 rounded-box p-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="status status-info"></span>
                  Équipe de rattachement
                </div>
                <p className="text-sm font-semibold">{currentUser.department}</p>
                <p className="text-xs text-base-content/60">
                  Notifications et assignations actives sur {projects.length} projets.
                </p>
              </div>

              <div className="bg-base-200/60 border border-base-300 rounded-box p-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="status status-primary"></span>
                  Préférence visuelle
                </div>
                <p className="text-sm font-semibold capitalize">{theme}</p>
                <p className="text-xs text-base-content/60">
                  Synchronisée automatiquement sur votre profil utilisateur.
                </p>
              </div>
            </div>

            {onLogout && (
              <div className="flex justify-end pt-2 border-t border-base-300">
                <button
                  type="button"
                  onClick={onLogout}
                  className="btn btn-error btn-outline btn-sm gap-1.5"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Se déconnecter de cet espace
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <ConfirmModal
        isOpen={showDeleteProjectModal}
        title={`Supprimer le projet [${activeProject.key}] ${activeProject.name} ?`}
        description="Tous les tickets, sprints et liens associés à ce projet seront définitivement détruits. Confirmez-vous cette suppression ?"
        confirmLabel={`Supprimer ${activeProject.key}`}
        variant="error"
        isLoading={isSavingWip}
        onConfirm={handleConfirmDeleteProject}
        onCancel={() => setShowDeleteProjectModal(false)}
      />
    </div>
  );
}

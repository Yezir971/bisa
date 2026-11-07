"use client";

import React, { useState } from "react";
import type { User, Workspace } from "@/domain/entities";
import type {
  InvitableUserRole,
  InviteUserInput,
  UserRole,
} from "@/lib/validations/jira-schema";
import { isAdminRole, ROLE_METADATA } from "@/domain/services/rbac";
import { UserAvatarBadge } from "@/components/ui/issue-badges";
import {
  CheckCircle2,
  Eye,
  Lock,
  Mail,
  Pencil,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";

interface UsersAdminViewProps {
  workspace: Workspace;
  users: User[];
  currentUser: User;
  onInviteUser: (input: InviteUserInput) => Promise<boolean>;
  onChangeUserRole: (targetUserId: string, newRole: UserRole) => Promise<void>;
}

export function UsersAdminView({
  workspace,
  users,
  currentUser,
  onInviteUser,
  onChangeUserRole,
}: UsersAdminViewProps) {
  const [isInviteOpen, setIsInviteOpen] = useState<boolean>(false);
  const [inviteName, setInviteName] = useState<string>("");
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [inviteDepartment, setInviteDepartment] = useState<string>(
    "Ingénierie & Produit"
  );
  const [inviteRole, setInviteRole] = useState<InvitableUserRole>("EDITOR");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");

  // Sécurité stricte : seuls les Administrateurs ont accès à la vue de tous les utilisateurs
  if (!isAdminRole(currentUser.role)) {
    return (
      <section className="card bg-base-100 border border-error/40 shadow-xs">
        <div className="card-body items-center text-center py-12 gap-3">
          <div className="size-12 rounded-full bg-error/10 text-error grid place-items-center">
            <ShieldAlert className="size-6" aria-hidden="true" />
          </div>
          <h2 className="text-base font-bold text-base-content">
            Accès réservé aux Administrateurs
          </h2>
          <p className="text-xs text-base-content/70 max-w-md">
            Seuls les utilisateurs disposant du rôle{" "}
            <strong>Administrateur</strong> peuvent consulter l&apos;annuaire complet des utilisateurs, inviter de nouveaux membres ou modifier les rôles.
          </p>
        </div>
      </section>
    );
  }

  const adminsCount = users.filter((u) => u.role === "ADMIN").length;
  const editorsCount = users.filter((u) => u.role === "EDITOR").length;
  const viewersCount = users.filter((u) => u.role === "VIEWER").length;

  const filteredUsers = users.filter((u) =>
    roleFilter === "ALL" ? true : u.role === roleFilter
  );

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const ok = await onInviteUser({
        name: inviteName,
        email: inviteEmail,
        department: inviteDepartment,
        role: inviteRole,
      });
      if (ok) {
        setInviteName("");
        setInviteEmail("");
        setInviteDepartment("Ingénierie & Produit");
        setInviteRole("EDITOR");
        setIsInviteOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (targetUserId: string, newRole: UserRole) => {
    setUpdatingUserId(targetUserId);
    try {
      await onChangeUserRole(targetUserId, newRole);
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête Administration des Utilisateurs & Rôles */}
      <section className="card bg-base-100 border border-base-300 shadow-xs">
        <div className="card-body p-5 gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="badge badge-primary badge-sm font-bold gap-1">
                  <Lock className="size-3" aria-hidden="true" />
                  Vue Administrateur
                </span>
                <h2 className="text-base font-bold text-base-content flex items-center gap-2">
                  <Users className="size-5 text-primary" aria-hidden="true" />
                  Annuaire des Utilisateurs & Gestion des Rôles —{" "}
                  {workspace.name}
                </h2>
              </div>
              <p className="text-xs text-base-content/70 max-w-3xl leading-relaxed">
                En tant qu&apos;<strong>Administrateur</strong>, vous seul avez accès à cette vue listant tous les collaborateurs. Vous pouvez inviter de nouveaux membres en choisissant leur rôle (<strong>Utilisateur / Éditeur</strong> ou <strong>Visiteur</strong>) et modifier le rôle de n&apos;importe quel compte à tout moment.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsInviteOpen(true)}
              className="btn btn-primary btn-sm gap-1.5"
            >
              <UserPlus className="size-4" aria-hidden="true" />
              Inviter un utilisateur
            </button>
          </div>

          {/* KPIs par Rôle */}
          <div className="stats stats-vertical sm:stats-horizontal bg-base-200/60 border border-base-300 w-full">
            <div className="stat py-2.5 px-4">
              <div className="stat-figure text-primary">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </div>
              <div className="stat-title text-xs">Administrateurs (Admin)</div>
              <div className="stat-value text-lg text-primary tabular-nums">
                {adminsCount}
              </div>
              <div className="stat-desc text-[11px]">
                Création de projets, invitations & gestion des rôles
              </div>
            </div>

            <div className="stat py-2.5 px-4">
              <div className="stat-figure text-info">
                <Pencil className="size-5" aria-hidden="true" />
              </div>
              <div className="stat-title text-xs">
                Éditeurs / Utilisateurs
              </div>
              <div className="stat-value text-lg text-info tabular-nums">
                {editorsCount}
              </div>
              <div className="stat-desc text-[11px]">
                Édition des tickets, sprints, Kanban & Gantt
              </div>
            </div>

            <div className="stat py-2.5 px-4">
              <div className="stat-figure text-base-content/60">
                <Eye className="size-5" aria-hidden="true" />
              </div>
              <div className="stat-title text-xs">Visiteurs (Lecture seule)</div>
              <div className="stat-value text-lg tabular-nums">
                {viewersCount}
              </div>
              <div className="stat-desc text-[11px]">
                Consultation des vues sans modification
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matrice des 3 Rôles */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(["ADMIN", "EDITOR", "VIEWER"] as const).map((r) => {
          const meta = ROLE_METADATA[r];
          return (
            <div
              key={r}
              className="card bg-base-100 border border-base-300 shadow-xs"
            >
              <div className="card-body p-4 gap-2">
                <div className="flex items-center justify-between">
                  <span className={`badge badge-sm font-bold ${meta.badgeClass}`}>
                    {meta.label}
                  </span>
                  <span className="font-mono text-[11px] text-base-content/50">
                    {r}
                  </span>
                </div>
                <p className="text-xs text-base-content/70 leading-relaxed">
                  {meta.description}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Table complète des utilisateurs avec modification du rôle en direct */}
      <section className="card bg-base-100 border border-base-300 shadow-xs overflow-hidden">
        <div className="card-body p-5 gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-base-content">
                Tous les utilisateurs de l&apos;espace ({filteredUsers.length})
              </h3>
              <p className="text-xs text-base-content/60">
                Sélectionnez un rôle dans la colonne de droite pour mettre à jour les permissions d&apos;un utilisateur immédiatement.
              </p>
            </div>

            <div className="join" role="group" aria-label="Filtrer par rôle">
              {(
                [
                  { id: "ALL", label: `Tous (${users.length})` },
                  { id: "ADMIN", label: `Admins (${adminsCount})` },
                  { id: "EDITOR", label: `Éditeurs (${editorsCount})` },
                  { id: "VIEWER", label: `Visiteurs (${viewersCount})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRoleFilter(tab.id)}
                  className={`btn btn-xs join-item ${
                    roleFilter === tab.id
                      ? "btn-primary"
                      : "btn-ghost bg-base-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto border border-base-300 rounded-box">
            <table className="table table-sm">
              <thead>
                <tr className="bg-base-200/70 text-xs">
                  <th>Collaborateur</th>
                  <th>Département / Équipe</th>
                  <th>Adresse E-mail</th>
                  <th>Rôle Actuel</th>
                  <th>Droits d&apos;accès</th>
                  <th className="text-right">Modifier le rôle (Admin)</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const meta = ROLE_METADATA[u.role];
                  const isSelf = u.id === currentUser.id;
                  return (
                    <tr key={u.id} className="hover:bg-base-200/40">
                      <td>
                        <div className="flex items-center gap-2.5">
                          <UserAvatarBadge user={u} size="sm" />
                          <div>
                            <div className="font-semibold text-sm flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isSelf && (
                                <span className="badge badge-primary badge-soft badge-xs">
                                  Vous
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-xs text-base-content/70">
                        {u.department}
                      </td>
                      <td className="font-mono text-xs">{u.email}</td>
                      <td>
                        <span
                          className={`badge badge-sm font-semibold ${meta.badgeClass}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="text-xs text-base-content/70">
                        {u.role === "ADMIN" &&
                          "Accès total + Projets + Utilisateurs"}
                        {u.role === "EDITOR" &&
                          "Édition tickets, titres, sprints, Kanban & Gantt"}
                        {u.role === "VIEWER" &&
                          "Lecture seule (aucune modification)"}
                      </td>
                      <td className="text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <select
                            className="select select-xs w-48 font-semibold"
                            value={u.role}
                            disabled={updatingUserId === u.id}
                            onChange={(e) =>
                              void handleRoleChange(
                                u.id,
                                e.target.value as UserRole
                              )
                            }
                            aria-label={`Changer le rôle de ${u.name}`}
                          >
                            <option value="ADMIN">Administrateur (Admin)</option>
                            <option value="EDITOR">
                              Éditeur / Utilisateur
                            </option>
                            <option value="VIEWER">
                              Visiteur (Lecture seule)
                            </option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modale d'invitation d'un nouvel utilisateur (Choix du rôle : Utilisateur/Éditeur ou Visiteur) */}
      {isInviteOpen && (
        <dialog
          open
          className="modal modal-open modal-bottom sm:modal-middle z-50"
          aria-labelledby="invite-user-modal-title"
        >
          <div className="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-lg">
            <div className="flex items-center justify-between border-b border-base-300 pb-3">
              <h3
                id="invite-user-modal-title"
                className="font-bold text-base flex items-center gap-2"
              >
                <UserPlus className="size-4 text-primary" aria-hidden="true" />
                Inviter un utilisateur dans {workspace.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="btn btn-ghost btn-xs btn-circle"
                aria-label="Fermer"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 pt-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-xs">
                  Nom complet du collaborateur *
                </legend>
                <input
                  type="text"
                  required
                  minLength={2}
                  className="input input-sm w-full"
                  placeholder="Ex: Antoine Lefèvre"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend text-xs">
                  Adresse e-mail professionnelle *
                </legend>
                <div className="join w-full">
                  <span className="join-item bg-base-200 px-3 flex items-center border border-base-300">
                    <Mail className="size-3.5 text-base-content/60" aria-hidden="true" />
                  </span>
                  <input
                    type="email"
                    required
                    className="input input-sm join-item w-full"
                    placeholder="antoine.lefevre@bisa.fr"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend text-xs">
                  Équipe / Département
                </legend>
                <input
                  type="text"
                  required
                  className="input input-sm w-full"
                  placeholder="Ex: Ingénierie & Produit, Marketing, Produit..."
                  value={inviteDepartment}
                  onChange={(e) => setInviteDepartment(e.target.value)}
                />
              </fieldset>

              {/* Sélection du rôle à l'invitation : Utilisateur (Éditeur) ou Visiteur */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-xs">
                  Rôle attribué à l&apos;utilisateur invité *
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setInviteRole("EDITOR")}
                    className={`text-left p-3 rounded-box border-2 transition-all cursor-pointer ${
                      inviteRole === "EDITOR"
                        ? "border-primary bg-primary/5"
                        : "border-base-300 hover:border-base-content/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <Pencil className="size-3.5 text-primary" aria-hidden="true" />
                        Utilisateur (Éditeur)
                      </span>
                      {inviteRole === "EDITOR" && (
                        <CheckCircle2
                          className="size-4 text-primary"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <p className="text-[11px] text-base-content/70 leading-snug">
                      Peut éditer le nom des tickets, les tickets, les sprints, le Kanban et les éléments du Gantt.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInviteRole("VIEWER")}
                    className={`text-left p-3 rounded-box border-2 transition-all cursor-pointer ${
                      inviteRole === "VIEWER"
                        ? "border-primary bg-primary/5"
                        : "border-base-300 hover:border-base-content/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        <Eye className="size-3.5 text-base-content/70" aria-hidden="true" />
                        Visiteur
                      </span>
                      {inviteRole === "VIEWER" && (
                        <CheckCircle2
                          className="size-4 text-primary"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <p className="text-[11px] text-base-content/70 leading-snug">
                      Lecture seule : peut consulter le Gantt, le Kanban, le Backlog et les rapports sans édition.
                    </p>
                  </button>
                </div>
              </fieldset>

              <div className="bg-base-200/60 border border-base-300 rounded-field p-3 text-[11px] text-base-content/70 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-base-content flex items-center gap-1.5">
                    <Mail className="size-3.5 text-primary" aria-hidden="true" />
                    Expédition transactionnelle via Brevo
                  </span>
                  <span className="badge badge-primary badge-soft badge-xs font-mono">
                    Brevo SMTP API
                  </span>
                </div>
                <p>
                  Un e-mail d&apos;invitation contenant le rôle attribué et le mot de passe temporaire{" "}
                  <code className="font-mono font-bold text-base-content">
                    Bisa2026!
                  </code>{" "}
                  est automatiquement envoyé au destinataire via <strong>Brevo</strong>.
                </p>
              </div>

              <div className="modal-action pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm gap-1.5"
                >
                  {isSubmitting && (
                    <span className="loading loading-spinner loading-xs" />
                  )}
                  <Mail className="size-4" aria-hidden="true" />
                  Envoyer l&apos;invitation via Brevo (
                  {inviteRole === "EDITOR" ? "Éditeur" : "Visiteur"})
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop bg-neutral/40 backdrop-blur-xs"
            onClick={() => setIsInviteOpen(false)}
          />
        </dialog>
      )}
    </div>
  );
}

"use client";

import React, { useMemo, useState } from "react";
import type { Issue, Project, Sprint, User } from "@/domain/entities";
import {
  IssuePriorityBadge,
  IssueStatusBadge,
  IssueTypeBadge,
  UserAvatarBadge,
} from "@/components/ui/issue-badges";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
  Calendar,
  CheckCircle2,
  ListTodo,
  Pencil,
  Play,
  Plus,
  Rocket,
  Target,
  X,
} from "lucide-react";

interface BacklogViewProps {
  project: Project;
  issues: Issue[];
  sprints: Sprint[];
  users: User[];
  onSelectIssue: (issue: Issue) => void;
  onAssignIssueToSprint: (issueId: string, sprintId: string | null) => void;
  onUpdateStoryPoints: (issueId: string, points: number) => void;
  onStartSprint: (sprintId: string) => Promise<void>;
  onCompleteSprint: (
    sprintId: string,
    moveToSprintId: string | null
  ) => Promise<void>;
  onUpdateSprint?: (
    sprintId: string,
    patch: Partial<Pick<Sprint, "name" | "goal" | "startDate" | "endDate">>
  ) => Promise<void>;
  onOpenCreateSprint: () => void;
  onOpenCreateIssue: () => void;
  canEdit?: boolean;
}

const FIBONACCI_POINTS = [1, 2, 3, 5, 8, 13, 20];

export function BacklogView({
  project,
  issues,
  sprints,
  users,
  onSelectIssue,
  onAssignIssueToSprint,
  onUpdateStoryPoints,
  onStartSprint,
  onCompleteSprint,
  onUpdateSprint,
  onOpenCreateSprint,
  onOpenCreateIssue,
  canEdit = true,
}: BacklogViewProps) {
  const [confirmSprintAction, setConfirmSprintAction] = useState<{
    type: "START" | "COMPLETE";
    sprint: Sprint;
  } | null>(null);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const userMap = useMemo(() => {
    const map = new Map<string, User>();
    for (const u of users) map.set(u.id, u);
    return map;
  }, [users]);

  const activeAndFutureSprints = useMemo(
    () =>
      sprints.filter(
        (s) => s.status === "ACTIVE" || s.status === "FUTURE"
      ),
    [sprints]
  );

  const backlogIssues = useMemo(
    () => issues.filter((i) => !i.sprintId),
    [issues]
  );

  const futureSprintForRollover = useMemo(
    () => sprints.find((s) => s.status === "FUTURE") || null,
    [sprints]
  );

  const handleConfirmModal = async () => {
    if (!confirmSprintAction) return;
    setIsProcessing(true);
    try {
      if (confirmSprintAction.type === "START") {
        await onStartSprint(confirmSprintAction.sprint.id);
      } else {
        await onCompleteSprint(
          confirmSprintAction.sprint.id,
          futureSprintForRollover ? futureSprintForRollover.id : null
        );
      }
      setConfirmSprintAction(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderIssueTable = (sectionIssues: Issue[]) => {
    if (sectionIssues.length === 0) {
      return (
        <div className="p-6 text-center text-xs text-base-content/60 border-t border-base-300">
          Aucun ticket affecté à cette section. Utilisez le sélecteur de sprint ou créez un ticket.
        </div>
      );
    }

    return (
      <div className="overflow-x-auto border-t border-base-300">
        <table className="table table-sm">
          <thead>
            <tr className="bg-base-200/60 text-xs">
              <th>Clé</th>
              <th>Type</th>
              <th>Titre du Ticket</th>
              <th>Statut</th>
              <th>Priorité</th>
              <th>Sprint</th>
              <th className="text-right">Story Points</th>
              <th className="text-center">Assigné</th>
            </tr>
          </thead>
          <tbody>
            {sectionIssues.map((issue) => {
              const assignee = issue.assigneeId
                ? userMap.get(issue.assigneeId)
                : null;
              return (
                <tr
                  key={issue.id}
                  onClick={() => onSelectIssue(issue)}
                  className="hover:bg-base-200/60 cursor-pointer transition-colors"
                >
                  <td className="font-mono text-xs font-bold text-primary whitespace-nowrap">
                    {issue.key}
                  </td>
                  <td>
                    <IssueTypeBadge type={issue.type} />
                  </td>
                  <td className="font-medium text-sm max-w-md truncate">
                    {issue.title}
                  </td>
                  <td>
                    <IssueStatusBadge
                      status={issue.status}
                      columns={project.columns}
                    />
                  </td>
                  <td>
                    <IssuePriorityBadge priority={issue.priority} />
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className="select select-xs w-40"
                      disabled={!canEdit}
                      value={issue.sprintId || ""}
                      onChange={(e) =>
                        onAssignIssueToSprint(
                          issue.id,
                          e.target.value ? e.target.value : null
                        )
                      }
                      aria-label={`Changer le sprint de ${issue.key}`}
                    >
                      <option value="">Backlog général</option>
                      {activeAndFutureSprints.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      className="select select-xs w-20 tabular-nums font-semibold"
                      disabled={!canEdit}
                      value={issue.storyPoints}
                      onChange={(e) =>
                        onUpdateStoryPoints(issue.id, Number(e.target.value))
                      }
                      aria-label={`Story points de ${issue.key}`}
                    >
                      {FIBONACCI_POINTS.map((pt) => (
                        <option key={pt} value={pt}>
                          {pt} SP
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="text-center">
                    <UserAvatarBadge user={assignee} size="xs" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Backlog Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-base-100 border border-base-300 p-4 rounded-box shadow-xs">
        <div>
          <h2 className="text-base font-bold text-base-content flex items-center gap-2">
            <ListTodo className="size-5 text-primary" aria-hidden="true" />
            Backlog Scrum & Planification des Sprints — {project.name}
          </h2>
          <p className="text-xs text-base-content/70">
            Estimez vos tickets en Story Points (Fibonacci), répartissez la charge et pilotez le cycle de vie des sprints.
          </p>
        </div>

        {canEdit ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenCreateSprint}
              className="btn btn-outline btn-sm gap-1.5"
            >
              <Calendar className="size-4" aria-hidden="true" />
              Créer un sprint
            </button>
            <button
              type="button"
              onClick={onOpenCreateIssue}
              className="btn btn-primary btn-sm gap-1.5"
            >
              <Plus className="size-4" aria-hidden="true" />
              Créer un ticket
            </button>
          </div>
        ) : (
          <span className="badge badge-ghost badge-sm font-semibold">
            Mode Visiteur · Lecture seule
          </span>
        )}
      </div>

      {/* Active & Future Sprints Sections */}
      {activeAndFutureSprints.map((sprint) => {
        const sprintIssues = issues.filter((i) => i.sprintId === sprint.id);
        const todoPts = sprintIssues
          .filter((i) => i.status === "TODO")
          .reduce((a, i) => a + i.storyPoints, 0);
        const wipPts = sprintIssues
          .filter(
            (i) => i.status === "IN_PROGRESS" || i.status === "IN_REVIEW"
          )
          .reduce((a, i) => a + i.storyPoints, 0);
        const donePts = sprintIssues
          .filter((i) => i.status === "DONE")
          .reduce((a, i) => a + i.storyPoints, 0);
        const totalPts = todoPts + wipPts + donePts;

        return (
          <section
            key={sprint.id}
            className="card bg-base-100 border border-base-300 shadow-xs overflow-hidden"
            aria-label={sprint.name}
          >
            <header className="p-4 flex flex-wrap items-center justify-between gap-3 bg-base-200/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`badge badge-sm font-semibold ${
                      sprint.status === "ACTIVE"
                        ? "badge-primary"
                        : "badge-ghost"
                    }`}
                  >
                    {sprint.status === "ACTIVE"
                      ? "Sprint Actif"
                      : "Sprint Planifié"}
                  </span>
                  <h3 className="font-bold text-sm text-base-content">
                    {sprint.name}
                  </h3>
                  <span className="text-xs text-base-content/60 tabular-nums">
                    ({sprint.startDate} → {sprint.endDate})
                  </span>
                </div>
                <p className="text-xs text-base-content/70 flex items-center gap-1.5">
                  <Target className="size-3.5 text-primary" aria-hidden="true" />
                  Objectif : {sprint.goal}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Points breakdown badges */}
                <div className="join" title="Répartition des Story Points">
                  <span className="badge badge-ghost badge-sm join-item tabular-nums">
                    À faire : {todoPts} SP
                  </span>
                  <span className="badge badge-info badge-soft badge-sm join-item tabular-nums">
                    En cours : {wipPts} SP
                  </span>
                  <span className="badge badge-success badge-soft badge-sm join-item tabular-nums">
                    Terminé : {donePts} SP
                  </span>
                  <span className="badge badge-neutral badge-sm join-item tabular-nums font-bold">
                    Total : {totalPts} SP
                  </span>
                </div>

                {canEdit && (
                  <>
                    {onUpdateSprint && (
                      <button
                        type="button"
                        onClick={() => setEditingSprint(sprint)}
                        className="btn btn-ghost btn-xs border border-base-300 gap-1"
                        title={`Modifier le sprint ${sprint.name}`}
                      >
                        <Pencil className="size-3" aria-hidden="true" />
                        Modifier le sprint
                      </button>
                    )}
                    {sprint.status === "FUTURE" ? (
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmSprintAction({ type: "START", sprint })
                        }
                        className="btn btn-primary btn-xs gap-1.5"
                      >
                        <Play className="size-3.5" aria-hidden="true" />
                        Démarrer le sprint
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmSprintAction({ type: "COMPLETE", sprint })
                        }
                        className="btn btn-success btn-soft btn-xs gap-1.5"
                      >
                        <CheckCircle2 className="size-3.5" aria-hidden="true" />
                        Clôturer le sprint
                      </button>
                    )}
                  </>
                )}
              </div>
            </header>

            {renderIssueTable(sprintIssues)}
          </section>
        );
      })}

      {/* General Unassigned Backlog Section */}
      <section
        className="card bg-base-100 border border-base-300 shadow-xs overflow-hidden"
        aria-label="Backlog Général"
      >
        <header className="p-4 flex flex-wrap items-center justify-between gap-3 bg-base-200/40">
          <div>
            <div className="flex items-center gap-2">
              <Rocket className="size-4 text-secondary" aria-hidden="true" />
              <h3 className="font-bold text-sm text-base-content">
                Backlog Général ({backlogIssues.length} tickets)
              </h3>
            </div>
            <p className="text-xs text-base-content/60">
              Tickets en attente de planification dans un prochain sprint
            </p>
          </div>

          <span className="badge badge-neutral badge-sm tabular-nums">
            Total Backlog :{" "}
            {backlogIssues.reduce((a, i) => a + i.storyPoints, 0)} SP
          </span>
        </header>

        {renderIssueTable(backlogIssues)}
      </section>

      {/* Modale d'édition d'un sprint (Éditeur & Admin) */}
      {editingSprint && (
        <dialog
          open
          className="modal modal-open modal-bottom sm:modal-middle z-50"
          aria-labelledby="edit-sprint-modal-title"
        >
          <div className="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-md">
            <div className="flex items-center justify-between border-b border-base-300 pb-3">
              <h3
                id="edit-sprint-modal-title"
                className="font-bold text-base flex items-center gap-2"
              >
                <Pencil className="size-4 text-primary" aria-hidden="true" />
                Modifier le sprint
              </h3>
              <button
                type="button"
                onClick={() => setEditingSprint(null)}
                className="btn btn-ghost btn-xs btn-circle"
                aria-label="Fermer"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editingSprint) return;
                setIsProcessing(true);
                try {
                  await onUpdateSprint?.(editingSprint.id, {
                    name: editingSprint.name,
                    goal: editingSprint.goal,
                    startDate: editingSprint.startDate,
                    endDate: editingSprint.endDate,
                  });
                  setEditingSprint(null);
                } finally {
                  setIsProcessing(false);
                }
              }}
              className="space-y-4 pt-4"
            >
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-xs">
                  Nom du Sprint *
                </legend>
                <input
                  type="text"
                  required
                  minLength={2}
                  className="input input-sm w-full"
                  value={editingSprint.name}
                  onChange={(e) =>
                    setEditingSprint({ ...editingSprint, name: e.target.value })
                  }
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend text-xs">
                  Objectif du Sprint *
                </legend>
                <textarea
                  required
                  className="textarea textarea-sm w-full"
                  value={editingSprint.goal}
                  onChange={(e) =>
                    setEditingSprint({ ...editingSprint, goal: e.target.value })
                  }
                />
              </fieldset>

              <div className="grid grid-cols-2 gap-3">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">
                    Date de début *
                  </legend>
                  <input
                    type="date"
                    required
                    className="input input-sm w-full"
                    value={editingSprint.startDate}
                    onChange={(e) =>
                      setEditingSprint({
                        ...editingSprint,
                        startDate: e.target.value,
                      })
                    }
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">
                    Date de fin *
                  </legend>
                  <input
                    type="date"
                    required
                    className="input input-sm w-full"
                    value={editingSprint.endDate}
                    onChange={(e) =>
                      setEditingSprint({
                        ...editingSprint,
                        endDate: e.target.value,
                      })
                    }
                  />
                </fieldset>
              </div>

              <div className="modal-action pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSprint(null)}
                  className="btn btn-ghost btn-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn btn-primary btn-sm"
                >
                  Enregistrer le sprint
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop bg-neutral/40 backdrop-blur-xs"
            onClick={() => setEditingSprint(null)}
          />
        </dialog>
      )}

      {/* Styled daisyUI 5 Confirmation Modal for Sprint Lifecycle */}
      <ConfirmModal
        isOpen={confirmSprintAction !== null}
        title={
          confirmSprintAction?.type === "START"
            ? `Démarrer ${confirmSprintAction.sprint.name}`
            : `Clôturer ${confirmSprintAction?.sprint.name}`
        }
        description={
          confirmSprintAction?.type === "START"
            ? `Vous êtes sur le point de lancer officiellement "${confirmSprintAction.sprint.name}". Les Story Points actuels seront enregistrés comme engagement initial de vélocité de l'équipe.`
            : `La clôture de "${confirmSprintAction?.sprint.name}" figera la vélocité accomplie. Tous les tickets non terminés seront automatiquement transférés vers ${
                futureSprintForRollover
                  ? `"${futureSprintForRollover.name}"`
                  : "le Backlog Général"
              }.`
        }
        confirmLabel={
          confirmSprintAction?.type === "START"
            ? "Confirmer le démarrage"
            : "Clôturer et archiver le sprint"
        }
        variant={confirmSprintAction?.type === "START" ? "primary" : "warning"}
        isLoading={isProcessing}
        onConfirm={handleConfirmModal}
        onCancel={() => setConfirmSprintAction(null)}
      />
    </div>
  );
}

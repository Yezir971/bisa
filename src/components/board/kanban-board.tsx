"use client";

import React, { useMemo, useState } from "react";
import type { Issue, Project, Sprint, User } from "@/domain/entities";
import {
  type IssuePriority,
  type IssueType,
  type StatusCategory,
} from "@/lib/validations/jira-schema";
import {
  getProjectColumns,
  IssuePriorityBadge,
  IssueTypeBadge,
  UserAvatarBadge,
} from "@/components/ui/issue-badges";
import { KanbanBoardSkeleton } from "@/components/ui/daisy-skeletons";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckSquare,
  Columns3,
  FolderKanban,
  Link2,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
} from "lucide-react";

export type ColumnColorVariant =
  | "neutral"
  | "info"
  | "warning"
  | "success"
  | "secondary"
  | "primary"
  | "accent";

interface KanbanBoardProps {
  project: Project;
  issues: Issue[];
  users: User[];
  sprints: Sprint[];
  currentUserId: string;
  isLoading?: boolean;
  onMoveIssueStatus: (issueId: string, newStatus: StatusCategory) => void;
  onSelectIssue: (issue: Issue) => void;
  onOpenCreateIssue: (defaultStatus?: StatusCategory) => void;
  onRenameColumn?: (
    columnId: StatusCategory,
    newLabel: string
  ) => Promise<void> | void;
  onAddColumn?: (
    label: string,
    colorVariant: ColumnColorVariant,
    wipLimit: number
  ) => Promise<void> | void;
  onDeleteColumn?: (columnId: StatusCategory) => Promise<void> | void;
  onRenameIssueTitle?: (issueId: string, newTitle: string) => Promise<void> | void;
  canEdit?: boolean;
}

type SwimlaneMode = "NONE" | "EPIC" | "ASSIGNEE" | "PRIORITY";

export function KanbanBoard({
  project,
  issues,
  users,
  sprints,
  currentUserId,
  isLoading = false,
  onMoveIssueStatus,
  onSelectIssue,
  onOpenCreateIssue,
  onRenameColumn,
  onAddColumn,
  onDeleteColumn,
  onRenameIssueTitle,
  canEdit = true,
}: KanbanBoardProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<IssueType | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<IssuePriority | "ALL">(
    "ALL"
  );
  const [onlyMyIssues, setOnlyMyIssues] = useState<boolean>(false);
  const [swimlane, setSwimlane] = useState<SwimlaneMode>("NONE");
  const [draggedIssueId, setDraggedIssueId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<StatusCategory | null>(
    null
  );

  // État pour renommer une catégorie en ligne
  const [editingColumnId, setEditingColumnId] = useState<StatusCategory | null>(
    null
  );
  const [editingColumnLabel, setEditingColumnLabel] = useState<string>("");

  // État pour renommer le titre d'un ticket en ligne sur la carte
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
  const [editingIssueTitle, setEditingIssueTitle] = useState<string>("");

  // État pour ajouter une nouvelle catégorie
  const [isAddColumnOpen, setIsAddColumnOpen] = useState<boolean>(false);
  const [newColumnLabel, setNewColumnLabel] = useState<string>("");
  const [newColumnColor, setNewColumnColor] =
    useState<ColumnColorVariant>("secondary");
  const [newColumnWip, setNewColumnWip] = useState<number>(6);
  const [isSavingColumn, setIsSavingColumn] = useState<boolean>(false);

  const boardColumns = useMemo(() => getProjectColumns(project), [project]);

  const handleStartRename = (colId: StatusCategory, currentLabel: string) => {
    if (!canEdit) return;
    setEditingColumnId(colId);
    setEditingColumnLabel(currentLabel);
  };

  const handleSubmitIssueRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIssueId || !editingIssueTitle.trim()) {
      setEditingIssueId(null);
      return;
    }
    await onRenameIssueTitle?.(editingIssueId, editingIssueTitle.trim());
    setEditingIssueId(null);
  };

  const handleSubmitRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingColumnId || !editingColumnLabel.trim()) {
      setEditingColumnId(null);
      return;
    }
    await onRenameColumn?.(editingColumnId, editingColumnLabel.trim());
    setEditingColumnId(null);
  };

  const handleSubmitNewColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnLabel.trim()) return;
    setIsSavingColumn(true);
    try {
      await onAddColumn?.(
        newColumnLabel.trim(),
        newColumnColor,
        newColumnWip
      );
      setNewColumnLabel("");
      setNewColumnColor("secondary");
      setNewColumnWip(6);
      setIsAddColumnOpen(false);
    } finally {
      setIsSavingColumn(false);
    }
  };

  const activeSprint = useMemo(
    () => sprints.find((s) => s.status === "ACTIVE") || null,
    [sprints]
  );

  const userMap = useMemo(() => {
    const map = new Map<string, User>();
    for (const u of users) map.set(u.id, u);
    return map;
  }, [users]);

  const filteredIssues = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return issues
      .filter((issue) => {
        if (onlyMyIssues && issue.assigneeId !== currentUserId) return false;
        if (assigneeFilter !== "ALL" && issue.assigneeId !== assigneeFilter)
          return false;
        if (typeFilter !== "ALL" && issue.type !== typeFilter) return false;
        if (priorityFilter !== "ALL" && issue.priority !== priorityFilter)
          return false;
        if (q) {
          const matchKey = issue.key.toLowerCase().includes(q);
          const matchTitle = issue.title.toLowerCase().includes(q);
          const matchLabel = issue.labels.some((l) =>
            l.toLowerCase().includes(q)
          );
          if (!matchKey && !matchTitle && !matchLabel) return false;
        }
        return true;
      })
      .sort((a, b) => a.rank.localeCompare(b.rank));
  }, [
    issues,
    onlyMyIssues,
    currentUserId,
    assigneeFilter,
    typeFilter,
    priorityFilter,
    searchQuery,
  ]);

  const swimlaneGroups = useMemo(() => {
    if (swimlane === "NONE") {
      return [{ id: "all", title: "Tous les tickets du tableau", items: filteredIssues }];
    }
    if (swimlane === "ASSIGNEE") {
      const groups = users.map((u) => ({
        id: u.id,
        title: `${u.name} (${u.department})`,
        items: filteredIssues.filter((i) => i.assigneeId === u.id),
      }));
      const unassigned = filteredIssues.filter((i) => !i.assigneeId);
      if (unassigned.length > 0) {
        groups.push({
          id: "unassigned",
          title: "Non assigné",
          items: unassigned,
        });
      }
      return groups.filter((g) => g.items.length > 0);
    }
    if (swimlane === "PRIORITY") {
      const priorities: IssuePriority[] = [
        "BLOCKER",
        "HIGHEST",
        "HIGH",
        "MEDIUM",
        "LOW",
        "LOWEST",
      ];
      return priorities
        .map((p) => ({
          id: p,
          title: `Priorité : ${p}`,
          items: filteredIssues.filter((i) => i.priority === p),
        }))
        .filter((g) => g.items.length > 0);
    }
    // EPIC swimlane
    const epics = issues.filter((i) => i.type === "EPIC");
    const groups = epics.map((ep) => ({
      id: ep.id,
      title: `Epic [${ep.key}] ${ep.title}`,
      items: filteredIssues.filter(
        (i) => i.epicId === ep.id || i.id === ep.id
      ),
    }));
    const withoutEpic = filteredIssues.filter(
      (i) => !i.epicId && i.type !== "EPIC"
    );
    if (withoutEpic.length > 0) {
      groups.push({
        id: "no-epic",
        title: "Tickets hors Epic",
        items: withoutEpic,
      });
    }
    return groups.filter((g) => g.items.length > 0);
  }, [swimlane, filteredIssues, users, issues]);

  if (isLoading) {
    return <KanbanBoardSkeleton />;
  }

  const handleDrop = (targetStatus: StatusCategory) => {
    if (draggedIssueId) {
      onMoveIssueStatus(draggedIssueId, targetStatus);
    }
    setDraggedIssueId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar & Filters Bar */}
      <section
        className="card bg-base-100 border border-base-300 shadow-xs"
        aria-label="Filtres et options du tableau Kanban"
      >
        <div className="card-body p-3 gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search & Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <label className="input input-sm flex items-center gap-2 w-56">
                <Search
                  className="size-4 text-base-content/60"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Filtrer par clé, titre, tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Filtrer les tickets du tableau"
                />
              </label>

              <button
                type="button"
                onClick={() => setOnlyMyIssues((v) => !v)}
                className={`btn btn-sm ${
                  onlyMyIssues ? "btn-primary" : "btn-ghost bg-base-200"
                }`}
              >
                Mes tickets
              </button>

              <select
                className="select select-sm w-auto"
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                aria-label="Filtrer par collaborateur"
              >
                <option value="ALL">Tous les membres</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <select
                className="select select-sm w-auto"
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as IssueType | "ALL")
                }
                aria-label="Filtrer par type de ticket"
              >
                <option value="ALL">Tous les types</option>
                <option value="EPIC">Epic</option>
                <option value="STORY">Story</option>
                <option value="TASK">Task</option>
                <option value="BUG">Bug</option>
                <option value="SUBTASK">Sous-tâche</option>
              </select>

              <select
                className="select select-sm w-auto"
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(e.target.value as IssuePriority | "ALL")
                }
                aria-label="Filtrer par priorité"
              >
                <option value="ALL">Toutes priorités</option>
                <option value="BLOCKER">Bloquant</option>
                <option value="HIGHEST">Critique</option>
                <option value="HIGH">Haute</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="LOW">Basse</option>
              </select>

              {(searchQuery ||
                onlyMyIssues ||
                assigneeFilter !== "ALL" ||
                typeFilter !== "ALL" ||
                priorityFilter !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setOnlyMyIssues(false);
                    setAssigneeFilter("ALL");
                    setTypeFilter("ALL");
                    setPriorityFilter("ALL");
                  }}
                  className="btn btn-ghost btn-xs text-error"
                >
                  Réinitialiser
                </button>
              )}
            </div>

            {/* Swimlane Group Switcher & Add Category Button */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-base-content/60 flex items-center gap-1">
                <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                Swimlanes :
              </span>
              <div className="join" role="group" aria-label="Regroupement Swimlanes">
                {(
                  [
                    { id: "NONE", label: "Aucun" },
                    { id: "EPIC", label: "Par Epic" },
                    { id: "ASSIGNEE", label: "Par Membre" },
                    { id: "PRIORITY", label: "Par Priorité" },
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSwimlane(mode.id)}
                    className={`btn btn-xs join-item ${
                      swimlane === mode.id
                        ? "btn-primary"
                        : "btn-ghost bg-base-200"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {canEdit ? (
                <button
                  type="button"
                  onClick={() => setIsAddColumnOpen(true)}
                  className="btn btn-outline btn-primary btn-xs gap-1"
                >
                  <Columns3 className="size-3.5" aria-hidden="true" />
                  + Ajouter une catégorie
                </button>
              ) : (
                <span className="badge badge-ghost badge-sm font-semibold">
                  Mode Visiteur · Lecture seule
                </span>
              )}
            </div>
          </div>

          {/* Active Sprint Summary Banner */}
          {activeSprint && (
            <div className="flex flex-wrap items-center justify-between gap-2 bg-base-200/70 px-3 py-1.5 rounded-box text-xs">
              <div className="flex items-center gap-2">
                <span className="badge badge-primary badge-soft badge-xs">
                  Sprint Actif
                </span>
                <span className="font-semibold">{activeSprint.name}</span>
                <span className="text-base-content/60 hidden md:inline">
                  — {activeSprint.goal}
                </span>
              </div>
              <div className="flex items-center gap-3 tabular-nums">
                <span>
                  Échéance : <strong>{activeSprint.endDate}</strong>
                </span>
                <span className="badge badge-neutral badge-xs">
                  {filteredIssues.reduce((a, i) => a + i.storyPoints, 0)} SP affichés
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Empty Filter Results State */}
      {filteredIssues.length === 0 ? (
        <div className="card bg-base-100 border border-base-300 p-10 text-center items-center gap-3">
          <FolderKanban
            className="size-10 text-base-content/40"
            aria-hidden="true"
          />
          <h3 className="font-bold text-base">
            Aucun ticket ne correspond aux critères sélectionnés
          </h3>
          <p className="text-sm text-base-content/60 max-w-md">
            Retirez certains filtres ou créez un nouveau ticket dans le projet{" "}
            <strong>{project.name}</strong>.
          </p>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => onOpenCreateIssue("TODO")}
              className="btn btn-primary btn-sm gap-1.5"
            >
              <Plus className="size-4" aria-hidden="true" />
              Créer un ticket
            </button>
          </div>
        </div>
      ) : (
        /* Swimlanes & Columns Grid */
        <div className="space-y-6">
          {swimlaneGroups.map((group) => (
            <div key={group.id} className="space-y-3">
              {swimlane !== "NONE" && (
                <div className="flex items-center gap-2 px-1">
                  <h3 className="text-sm font-bold text-base-content">
                    {group.title}
                  </h3>
                  <span className="badge badge-neutral badge-xs tabular-nums">
                    {group.items.length} ticket(s)
                  </span>
                </div>
              )}

              <div
                className={`grid grid-cols-1 md:grid-cols-2 ${
                  boardColumns.length <= 4
                    ? "xl:grid-cols-4"
                    : "xl:grid-cols-3 2xl:grid-cols-5"
                } gap-4 items-start`}
              >
                {boardColumns.map((colMeta) => {
                  const statusCat = colMeta.id;
                  const colIssues = group.items.filter(
                    (i) => i.status === statusCat
                  );
                  const totalColIssues = issues.filter(
                    (i) => i.status === statusCat
                  ).length;
                  const wipLimit = project.wipLimits[statusCat] || 15;
                  const isOverWip =
                    statusCat !== "DONE" && totalColIssues > wipLimit;
                  const colPoints = colIssues.reduce(
                    (acc, i) => acc + i.storyPoints,
                    0
                  );
                  const isCustomCol = !["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"].includes(
                    statusCat
                  );

                  return (
                    <section
                      key={statusCat}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverColumn(statusCat);
                      }}
                      onDragLeave={() => setDragOverColumn(null)}
                      onDrop={() => handleDrop(statusCat)}
                      aria-label={`Colonne ${colMeta.label}`}
                      className={`bg-base-200 rounded-box p-3 flex flex-col gap-3 min-h-[420px] border transition-colors ${
                        dragOverColumn === statusCat
                          ? "border-primary bg-primary/5"
                          : isOverWip
                            ? "border-warning"
                            : "border-base-300"
                      }`}
                    >
                      {/* Column Header */}
                      <header className="flex items-center justify-between gap-2 px-1">
                        {editingColumnId === statusCat ? (
                          <form
                            onSubmit={handleSubmitRename}
                            className="join flex-1 min-w-0"
                          >
                            <input
                              type="text"
                              autoFocus
                              required
                              maxLength={40}
                              value={editingColumnLabel}
                              onChange={(e) =>
                                setEditingColumnLabel(e.target.value)
                              }
                              aria-label="Nouveau nom de la catégorie"
                              className="input input-xs join-item flex-1 min-w-0 font-bold"
                            />
                            <button
                              type="submit"
                              className="btn btn-primary btn-xs join-item"
                              aria-label="Enregistrer le nom de la catégorie"
                            >
                              <Check className="size-3.5" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingColumnId(null)}
                              className="btn btn-ghost btn-xs join-item border border-base-300"
                              aria-label="Annuler le renommage"
                            >
                              <X className="size-3.5" aria-hidden="true" />
                            </button>
                          </form>
                        ) : (
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span
                              className={`status ${colMeta.dotClass} shrink-0`}
                              aria-hidden="true"
                            ></span>
                            {canEdit ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleStartRename(statusCat, colMeta.label)
                                }
                                title="Cliquez pour renommer cette catégorie"
                                className="font-bold text-xs uppercase tracking-wider text-base-content hover:text-primary truncate text-left flex items-center gap-1 group cursor-pointer"
                              >
                                <span className="truncate">{colMeta.label}</span>
                                <Pencil
                                  className="size-3 opacity-40 group-hover:opacity-100 shrink-0 transition-opacity"
                                  aria-hidden="true"
                                />
                              </button>
                            ) : (
                              <span className="font-bold text-xs uppercase tracking-wider text-base-content truncate">
                                {colMeta.label}
                              </span>
                            )}
                            <span className="badge badge-neutral badge-xs tabular-nums shrink-0">
                              {colIssues.length}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-1 shrink-0">
                          {statusCat !== "DONE" && (
                            <span
                              className={`badge badge-xs tabular-nums ${
                                isOverWip
                                  ? "badge-warning badge-soft font-bold"
                                  : "badge-ghost text-base-content/60"
                              }`}
                              title={`Limite WIP : max ${wipLimit} tickets`}
                            >
                              {isOverWip && (
                                <AlertTriangle
                                  className="size-3 mr-0.5"
                                  aria-hidden="true"
                                />
                              )}
                              WIP {totalColIssues}/{wipLimit}
                            </span>
                          )}
                          <span className="badge badge-ghost badge-xs tabular-nums">
                            {colPoints} SP
                          </span>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => onOpenCreateIssue(statusCat)}
                              className="btn btn-ghost btn-xs btn-square"
                              aria-label={`Ajouter un ticket dans ${colMeta.label}`}
                              title={`Créer un ticket dans "${colMeta.label}"`}
                            >
                              <Plus className="size-3.5" aria-hidden="true" />
                            </button>
                          )}
                          {canEdit && isCustomCol && onDeleteColumn && (
                            <button
                              type="button"
                              onClick={() => onDeleteColumn(statusCat)}
                              className="btn btn-ghost btn-xs btn-square text-error/70 hover:text-error"
                              aria-label={`Supprimer la catégorie ${colMeta.label}`}
                              title={`Supprimer la catégorie "${colMeta.label}"`}
                            >
                              <Trash2 className="size-3" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </header>

                      {/* Cards Stack */}
                      <div className="flex flex-col gap-2.5 flex-1">
                        {colIssues.map((issue) => {
                          const assignee = issue.assigneeId
                            ? userMap.get(issue.assigneeId)
                            : null;
                          const doneSubs = issue.subtasks.filter(
                            (s) => s.completed
                          ).length;
                          const totalSubs = issue.subtasks.length;
                          const hasBlocker = issue.relations.some(
                            (r) =>
                              r.type === "BLOCKS" || r.type === "IS_BLOCKED_BY"
                          );

                          return (
                            <article
                              key={issue.id}
                              draggable={canEdit && editingIssueId !== issue.id}
                              onDragStart={() => {
                                if (canEdit) setDraggedIssueId(issue.id);
                              }}
                              onDragEnd={() => {
                                setDraggedIssueId(null);
                                setDragOverColumn(null);
                              }}
                              onClick={() => onSelectIssue(issue)}
                              className={`card bg-base-100 border border-base-300 shadow-xs hover:border-primary/60 transition-all ${
                                canEdit
                                  ? "cursor-grab active:cursor-grabbing"
                                  : "cursor-pointer"
                              } ${
                                draggedIssueId === issue.id ? "opacity-40" : ""
                              }`}
                            >
                              <div className="card-body p-3 gap-2">
                                {/* Card Top Row */}
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-xs font-bold text-base-content/70">
                                      {issue.key}
                                    </span>
                                    <IssueTypeBadge type={issue.type} />
                                  </div>

                                  {/* Actions rapides sur la carte (Éditeur & Admin uniquement) */}
                                  {canEdit && (
                                    <div
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex items-center gap-0.5"
                                    >
                                      {onRenameIssueTitle && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setEditingIssueId(issue.id);
                                            setEditingIssueTitle(issue.title);
                                          }}
                                          className="btn btn-ghost btn-xs btn-square"
                                          title="Renommer le ticket"
                                          aria-label={`Renommer le ticket ${issue.key}`}
                                        >
                                          <Pencil
                                            className="size-3"
                                            aria-hidden="true"
                                          />
                                        </button>
                                      )}
                                      <div className="dropdown dropdown-end">
                                        <button
                                          type="button"
                                          tabIndex={0}
                                          className="btn btn-ghost btn-xs btn-square"
                                          aria-label={`Déplacer le ticket ${issue.key}`}
                                        >
                                          <ArrowRight
                                            className="size-3.5"
                                            aria-hidden="true"
                                          />
                                        </button>
                                        <ul
                                          tabIndex={0}
                                          className="dropdown-content menu bg-base-100 rounded-box z-20 w-44 p-1.5 shadow-lg border border-base-300 text-xs"
                                        >
                                          <li className="menu-title text-[10px] uppercase">
                                            Déplacer vers
                                          </li>
                                          {boardColumns
                                            .filter((c) => c.id !== issue.status)
                                            .map((targetCol) => (
                                              <li key={targetCol.id}>
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    onMoveIssueStatus(
                                                      issue.id,
                                                      targetCol.id
                                                    )
                                                  }
                                                >
                                                  <span
                                                    className={`status ${targetCol.dotClass}`}
                                                  ></span>
                                                  {targetCol.label}
                                                </button>
                                              </li>
                                            ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Issue Title (Éditable en direct par les Éditeurs et Admins) */}
                                {editingIssueId === issue.id ? (
                                  <form
                                    onSubmit={handleSubmitIssueRename}
                                    onClick={(e) => e.stopPropagation()}
                                    className="join w-full"
                                  >
                                    <input
                                      type="text"
                                      autoFocus
                                      required
                                      minLength={3}
                                      maxLength={160}
                                      value={editingIssueTitle}
                                      onChange={(e) =>
                                        setEditingIssueTitle(e.target.value)
                                      }
                                      className="input input-xs join-item flex-1 font-semibold"
                                      aria-label={`Nouveau titre pour ${issue.key}`}
                                    />
                                    <button
                                      type="submit"
                                      className="btn btn-primary btn-xs join-item"
                                      aria-label="Valider le nouveau titre"
                                    >
                                      <Check className="size-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setEditingIssueId(null)}
                                      className="btn btn-ghost btn-xs join-item border border-base-300"
                                      aria-label="Annuler"
                                    >
                                      <X className="size-3" />
                                    </button>
                                  </form>
                                ) : (
                                  <h5 className="text-sm font-semibold text-base-content line-clamp-2 leading-snug">
                                    {issue.title}
                                  </h5>
                                )}

                                {/* Aperçu miniature WebP si des images de contexte sont attachées au ticket */}
                                {issue.attachments &&
                                  issue.attachments.length > 0 && (
                                    <div className="relative h-24 rounded-field overflow-hidden border border-base-300 bg-base-200">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={issue.attachments[0]!.dataUrl}
                                        alt={issue.attachments[0]!.name}
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                      />
                                      <span className="absolute bottom-1.5 right-1.5 badge badge-neutral badge-xs font-mono">
                                        {issue.attachments.length} WebP
                                      </span>
                                    </div>
                                  )}

                                {/* Labels & Dependency Alerts */}
                                {(issue.labels.length > 0 || hasBlocker) && (
                                  <div className="flex flex-wrap gap-1">
                                    {hasBlocker && (
                                      <span className="badge badge-error badge-soft badge-xs gap-1">
                                        <Link2
                                          className="size-2.5"
                                          aria-hidden="true"
                                        />
                                        Dépendance critique
                                      </span>
                                    )}
                                    {issue.labels.slice(0, 3).map((lbl) => (
                                      <span
                                        key={lbl}
                                        className="badge badge-ghost badge-xs"
                                      >
                                        {lbl}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Subtasks Progress Bar */}
                                {totalSubs > 0 && (
                                  <div className="space-y-1 pt-0.5">
                                    <div className="flex items-center justify-between text-[11px] text-base-content/70">
                                      <span className="flex items-center gap-1">
                                        <CheckSquare
                                          className="size-3"
                                          aria-hidden="true"
                                        />
                                        Sous-tâches
                                      </span>
                                      <span className="tabular-nums font-medium">
                                        {doneSubs}/{totalSubs}
                                      </span>
                                    </div>
                                    <progress
                                      className="progress progress-primary w-full h-1.5"
                                      value={doneSubs}
                                      max={totalSubs}
                                      aria-label={`Progression des sous-tâches de ${issue.key}`}
                                    ></progress>
                                  </div>
                                )}

                                {/* Card Footer */}
                                <div className="flex items-center justify-between gap-2 pt-2 border-t border-base-300/70 mt-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <IssuePriorityBadge
                                      priority={issue.priority}
                                    />
                                    {issue.comments.length > 0 && (
                                      <span className="text-[11px] text-base-content/60 flex items-center gap-0.5 tabular-nums">
                                        <MessageSquare
                                          className="size-3"
                                          aria-hidden="true"
                                        />
                                        {issue.comments.length}
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span
                                      className="badge badge-neutral badge-xs tabular-nums font-semibold"
                                      title="Story Points"
                                    >
                                      {issue.storyPoints} SP
                                    </span>
                                    <UserAvatarBadge
                                      user={assignee}
                                      size="sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            </article>
                          );
                        })}

                        {colIssues.length === 0 && (
                          <div className="flex flex-col items-center justify-center flex-1 py-8 text-center border border-dashed border-base-300 rounded-box text-xs text-base-content/50">
                            <span>Glissez un ticket ici</span>
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modale d'ajout d'une nouvelle catégorie Kanban */}
      {isAddColumnOpen && (
        <dialog
          open
          className="modal modal-open modal-bottom sm:modal-middle z-50"
          aria-labelledby="add-column-modal-title"
        >
          <div className="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-md p-6">
            <header className="flex items-center justify-between border-b border-base-300 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Columns3
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
                <h3
                  id="add-column-modal-title"
                  className="text-base font-bold text-base-content"
                >
                  Ajouter une catégorie au tableau
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddColumnOpen(false)}
                className="btn btn-ghost btn-xs btn-circle"
                aria-label="Fermer"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </header>

            <form onSubmit={handleSubmitNewColumn} className="space-y-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-xs">
                  Nom de la catégorie *
                </legend>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={40}
                  placeholder="Ex: Recette / QA, En attente, Prêt à livrer..."
                  className="input input-sm w-full"
                  value={newColumnLabel}
                  onChange={(e) => setNewColumnLabel(e.target.value)}
                />
              </fieldset>

              <div className="grid grid-cols-2 gap-3">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">
                    Pastille de couleur
                  </legend>
                  <select
                    className="select select-sm w-full"
                    value={newColumnColor}
                    onChange={(e) =>
                      setNewColumnColor(e.target.value as ColumnColorVariant)
                    }
                  >
                    <option value="secondary">Violet (Secondaire)</option>
                    <option value="info">Bleu (Info)</option>
                    <option value="warning">Orange (Attention)</option>
                    <option value="success">Vert (Validation)</option>
                    <option value="primary">Indigo (Primaire)</option>
                    <option value="accent">Émeraude (Accent)</option>
                    <option value="neutral">Gris (Neutre)</option>
                  </select>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">
                    Limite WIP max
                  </legend>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    className="input input-sm w-full tabular-nums"
                    value={newColumnWip}
                    onChange={(e) => setNewColumnWip(Number(e.target.value))}
                  />
                </fieldset>
              </div>

              <div className="modal-action flex justify-end gap-2 pt-2 border-t border-base-300">
                <button
                  type="button"
                  onClick={() => setIsAddColumnOpen(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSavingColumn || !newColumnLabel.trim()}
                  className="btn btn-primary btn-sm"
                >
                  {isSavingColumn && (
                    <span className="loading loading-spinner loading-xs" />
                  )}
                  Ajouter la catégorie
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop bg-neutral/40 backdrop-blur-xs"
            onClick={() => setIsAddColumnOpen(false)}
          />
        </dialog>
      )}
    </div>
  );
}

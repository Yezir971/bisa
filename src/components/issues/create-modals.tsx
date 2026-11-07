"use client";

import React, { useState } from "react";
import type { Issue, Project, Sprint, User } from "@/domain/entities";
import {
  ISSUE_PRIORITIES,
  ISSUE_TYPES,
  STATUS_CATEGORIES,
  type CreateIssueInput,
  type CreateProjectInput,
  type CreateSprintInput,
  type IssuePriority,
  type IssueType,
  type StatusCategory,
} from "@/lib/validations/jira-schema";
import {
  getProjectColumns,
  ISSUE_TYPE_METADATA,
  PRIORITY_METADATA,
  STATUS_METADATA,
} from "@/components/ui/issue-badges";
import { Calendar, FolderPlus, PlusCircle, X } from "lucide-react";

interface CreateIssueModalProps {
  isOpen: boolean;
  defaultProjectId: string;
  defaultStatus?: StatusCategory;
  projects: Project[];
  sprints: Sprint[];
  users: User[];
  epics: Issue[];
  currentUserId: string;
  onClose: () => void;
  onSubmit: (input: CreateIssueInput) => Promise<boolean>;
}

export function CreateIssueModal({
  isOpen,
  defaultProjectId,
  defaultStatus = "TODO",
  projects,
  sprints,
  users,
  epics,
  currentUserId,
  onClose,
  onSubmit,
}: CreateIssueModalProps) {
  const [projectId, setProjectId] = useState<string>(defaultProjectId);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<IssueType>("STORY");
  const [status, setStatus] = useState<StatusCategory>(defaultStatus);
  const [priority, setPriority] = useState<IssuePriority>("MEDIUM");
  const [storyPoints, setStoryPoints] = useState<number>(3);
  const [assigneeId, setAssigneeId] = useState<string>(currentUserId);
  const [sprintId, setSprintId] = useState<string>(
    sprints.find((s) => s.status === "ACTIVE")?.id || ""
  );
  const [epicId, setEpicId] = useState<string>("");
  const [labelsInput, setLabelsInput] = useState<string>("produit, sprint");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const labels = labelsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const ok = await onSubmit({
        projectId: projectId || defaultProjectId,
        title,
        description,
        type,
        status,
        priority,
        storyPoints,
        assigneeId: assigneeId || null,
        reporterId: currentUserId,
        sprintId: sprintId || null,
        epicId: epicId || null,
        parentId: null,
        labels,
        timeEstimatedHours: storyPoints * 2,
      });
      if (ok) {
        setTitle("");
        setDescription("");
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog
      open
      className="modal modal-open modal-bottom sm:modal-middle z-50"
      aria-labelledby="create-issue-modal-title"
    >
      <div className="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-2xl p-6">
        <header className="flex items-center justify-between border-b border-base-300 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="size-5 text-primary" aria-hidden="true" />
            <h3
              id="create-issue-modal-title"
              className="text-base font-bold text-base-content"
            >
              Créer un nouveau ticket
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-xs btn-circle"
            aria-label="Fermer la fenêtre de création"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xs">
                Projet Cible *
              </legend>
              <select
                className="select select-sm w-full"
                value={projectId || defaultProjectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.key}] {p.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xs">
                Type de Ticket *
              </legend>
              <select
                className="select select-sm w-full"
                value={type}
                onChange={(e) => setType(e.target.value as IssueType)}
              >
                {ISSUE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {ISSUE_TYPE_METADATA[t].label}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend text-xs">
              Titre du Ticket *
            </legend>
            <input
              type="text"
              required
              minLength={3}
              placeholder="ex: Implémenter le filtre de vélocité multi-projets"
              className="input input-sm w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className="label text-[11px] text-base-content/60">
              La clé séquentielle (ex: CORE-10) sera attribuée atomiquement.
            </p>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend text-xs">
              Description & Critères d&apos;acceptation (Markdown)
            </legend>
            <textarea
              className="textarea textarea-sm w-full h-24"
              placeholder="Décrivez le besoin fonctionnel, le contexte et les critères d'acceptation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </fieldset>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xs">Statut Initial</legend>
              <select
                className="select select-sm w-full"
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusCategory)}
              >
                {getProjectColumns(
                  projects.find((p) => p.id === (projectId || defaultProjectId))
                ).map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.label}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xs">Priorité</legend>
              <select
                className="select select-sm w-full"
                value={priority}
                onChange={(e) => setPriority(e.target.value as IssuePriority)}
              >
                {ISSUE_PRIORITIES.map((pr) => (
                  <option key={pr} value={pr}>
                    {PRIORITY_METADATA[pr].label}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xs">
                Story Points (Fibonacci)
              </legend>
              <select
                className="select select-sm w-full tabular-nums"
                value={storyPoints}
                onChange={(e) => setStoryPoints(Number(e.target.value))}
              >
                {[1, 2, 3, 5, 8, 13, 20].map((sp) => (
                  <option key={sp} value={sp}>
                    {sp} SP
                  </option>
                ))}
              </select>
            </fieldset>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xs">Assigné à</legend>
              <select
                className="select select-sm w-full"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                <option value="">Non assigné</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xs">Sprint</legend>
              <select
                className="select select-sm w-full"
                value={sprintId}
                onChange={(e) => setSprintId(e.target.value)}
              >
                <option value="">Backlog général</option>
                {sprints
                  .filter((s) => s.status !== "CLOSED")
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xs">Epic Parent</legend>
              <select
                className="select select-sm w-full"
                value={epicId}
                onChange={(e) => setEpicId(e.target.value)}
              >
                <option value="">Aucun Epic</option>
                {epics.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    [{ep.key}] {ep.title}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend text-xs">
              Labels (séparés par une virgule)
            </legend>
            <input
              type="text"
              className="input input-sm w-full"
              placeholder="ex: paiement, sécurité, api"
              value={labelsInput}
              onChange={(e) => setLabelsInput(e.target.value)}
            />
          </fieldset>

          <div className="modal-action flex justify-end gap-2 pt-2 border-t border-base-300">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-ghost btn-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-sm"
            >
              {isLoading && (
                <span
                  className="loading loading-spinner loading-xs"
                  aria-hidden="true"
                ></span>
              )}
              Créer le ticket
            </button>
          </div>
        </form>
      </div>
      <div
        className="modal-backdrop bg-neutral/40 backdrop-blur-xs"
        onClick={onClose}
      />
    </dialog>
  );
}

interface CreateProjectModalProps {
  isOpen: boolean;
  users: User[];
  currentUserId: string;
  onClose: () => void;
  onSubmit: (input: CreateProjectInput) => Promise<boolean>;
}

export function CreateProjectModal({
  isOpen,
  users,
  currentUserId,
  onClose,
  onSubmit,
}: CreateProjectModalProps) {
  const [name, setName] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [leadId, setLeadId] = useState<string>(currentUserId);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const ok = await onSubmit({
        name,
        key: key.toUpperCase().trim(),
        description,
        leadId,
      });
      if (ok) {
        setName("");
        setKey("");
        setDescription("");
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog
      open
      className="modal modal-open modal-bottom sm:modal-middle z-50"
      aria-labelledby="create-project-title"
    >
      <div className="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-lg p-6">
        <header className="flex items-center justify-between border-b border-base-300 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <FolderPlus className="size-5 text-primary" aria-hidden="true" />
            <h3 id="create-project-title" className="text-base font-bold">
              Créer un nouveau projet
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-xs btn-circle"
            aria-label="Fermer"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-xs">
              Nom du Projet *
            </legend>
            <input
              type="text"
              required
              placeholder="ex: Sécurité & Authentification IAM"
              className="input input-sm w-full"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!key && e.target.value.length >= 3) {
                  setKey(
                    e.target.value
                      .replace(/[^a-zA-Z]/g, "")
                      .slice(0, 4)
                      .toUpperCase()
                  );
                }
              }}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend text-xs">
              Clé Unique du Projet (2-8 lettres majuscules) *
            </legend>
            <input
              type="text"
              required
              maxLength={8}
              placeholder="ex: IAM"
              className="input input-sm w-full font-mono uppercase"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
            />
            <p className="label text-[11px] text-base-content/60">
              Préfixera tous les tickets du projet (ex: {key || "IAM"}-1,{" "}
              {key || "IAM"}-2).
            </p>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend text-xs">
              Responsable du Projet (Project Lead)
            </legend>
            <select
              className="select select-sm w-full"
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.department})
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend text-xs">Description</legend>
            <textarea
              className="textarea textarea-sm w-full h-20"
              placeholder="Objectif et périmètre fonctionnel du projet..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </fieldset>

          <div className="modal-action flex justify-end gap-2 pt-2 border-t border-base-300">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-sm"
            >
              {isLoading && (
                <span className="loading loading-spinner loading-xs"></span>
              )}
              Créer le projet
            </button>
          </div>
        </form>
      </div>
      <div
        className="modal-backdrop bg-neutral/40 backdrop-blur-xs"
        onClick={onClose}
      />
    </dialog>
  );
}

interface CreateSprintModalProps {
  isOpen: boolean;
  projectId: string;
  onClose: () => void;
  onSubmit: (input: CreateSprintInput) => Promise<boolean>;
}

export function CreateSprintModal({
  isOpen,
  projectId,
  onClose,
  onSubmit,
}: CreateSprintModalProps) {
  const [name, setName] = useState<string>("Sprint 13 - Scalabilité Edge");
  const [goal, setGoal] = useState<string>(
    "Optimiser le cache distribué et finaliser les webhooks"
  );
  const [startDate, setStartDate] = useState<string>("2026-11-24");
  const [endDate, setEndDate] = useState<string>("2026-12-08");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const ok = await onSubmit({
        projectId,
        name,
        goal,
        startDate,
        endDate,
      });
      if (ok) {
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog
      open
      className="modal modal-open modal-bottom sm:modal-middle z-50"
      aria-labelledby="create-sprint-title"
    >
      <div className="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-md p-6">
        <header className="flex items-center justify-between border-b border-base-300 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-primary" aria-hidden="true" />
            <h3 id="create-sprint-title" className="text-base font-bold">
              Planifier un nouveau Sprint Scrum
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-xs btn-circle"
            aria-label="Fermer"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-xs">
              Nom du Sprint *
            </legend>
            <input
              type="text"
              required
              className="input input-sm w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend text-xs">
              Objectif du Sprint (Sprint Goal) *
            </legend>
            <textarea
              required
              className="textarea textarea-sm w-full h-20"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
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
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-xs">Date de fin *</legend>
              <input
                type="date"
                required
                className="input input-sm w-full"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </fieldset>
          </div>

          <div className="modal-action flex justify-end gap-2 pt-2 border-t border-base-300">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-sm"
            >
              {isLoading && (
                <span className="loading loading-spinner loading-xs"></span>
              )}
              Créer le sprint
            </button>
          </div>
        </form>
      </div>
      <div
        className="modal-backdrop bg-neutral/40 backdrop-blur-xs"
        onClick={onClose}
      />
    </dialog>
  );
}

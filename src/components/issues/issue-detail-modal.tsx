"use client";

import React, { useRef, useState } from "react";
import type {
  Issue,
  IssueImageAttachment,
  Project,
  Sprint,
  User,
} from "@/domain/entities";
import {
  ISSUE_PRIORITIES,
  RELATION_TYPES,
  type AttachIssueImageInput,
  type IssuePriority,
  type RelationType,
  type StatusCategory,
} from "@/lib/validations/jira-schema";
import { convertImageFileToWebp } from "@/lib/media/webp-image-converter";
import { useToast } from "@/components/providers/toast-provider";
import {
  getProjectColumns,
  IssueTypeBadge,
  PRIORITY_METADATA,
  UserAvatarBadge,
} from "@/components/ui/issue-badges";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
  CheckSquare,
  Clock,
  History,
  ImagePlus,
  Link2,
  Maximize2,
  MessageSquare,
  Pencil,
  Plus,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

interface IssueDetailModalProps {
  issue: Issue | null;
  allIssues: Issue[];
  projects: Project[];
  sprints: Sprint[];
  users: User[];
  currentUserId?: string;
  onClose: () => void;
  onUpdateStatus: (issueId: string, status: StatusCategory) => Promise<void>;
  onUpdateDetails: (
    issueId: string,
    patch: Partial<
      Pick<
        Issue,
        | "title"
        | "description"
        | "priority"
        | "storyPoints"
        | "assigneeId"
        | "sprintId"
        | "epicId"
        | "timeLoggedHours"
        | "timeEstimatedHours"
      >
    >
  ) => Promise<void>;
  onAddComment: (issueId: string, body: string) => Promise<void>;
  onAddSubtask: (issueId: string, title: string) => Promise<void>;
  onToggleSubtask: (issueId: string, subtaskId: string) => Promise<void>;
  onAddRelation: (
    sourceId: string,
    targetId: string,
    type: RelationType
  ) => Promise<void>;
  onAttachImage?: (
    issueId: string,
    input: AttachIssueImageInput
  ) => Promise<void>;
  onRemoveImage?: (issueId: string, attachmentId: string) => Promise<void>;
  onDeleteIssue: (issueId: string) => Promise<void>;
  canEdit?: boolean;
}

function formatSizeKb(bytes: number): string {
  const kb = bytes / 1024;
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} Mo` : `${Math.max(1, Math.round(kb))} Ko`;
}

export function IssueDetailModal({
  issue,
  allIssues,
  projects,
  sprints,
  users,
  currentUserId,
  onClose,
  onUpdateStatus,
  onUpdateDetails,
  onAddComment,
  onAddSubtask,
  onToggleSubtask,
  onAddRelation,
  onAttachImage,
  onRemoveImage,
  onDeleteIssue,
  canEdit = true,
}: IssueDetailModalProps) {
  const { notifySuccess, notifyError } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<"COMMENTS" | "ACTIVITY">(
    "COMMENTS"
  );
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [titleDraft, setTitleDraft] = useState<string>("");
  const [isEditingDesc, setIsEditingDesc] = useState<boolean>(false);
  const [descDraft, setDescDraft] = useState<string>("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>("");
  const [newCommentBody, setNewCommentBody] = useState<string>("");
  const [targetRelationIssueId, setTargetRelationIssueId] =
    useState<string>("");
  const [relationType, setRelationType] = useState<RelationType>("BLOCKS");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isConvertingImage, setIsConvertingImage] = useState<boolean>(false);
  const [previewAttachment, setPreviewAttachment] =
    useState<IssueImageAttachment | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  if (!issue) return null;

  const project = projects.find((p) => p.id === issue.projectId);
  const epics = allIssues.filter(
    (i) => i.type === "EPIC" && i.id !== issue.id
  );
  const linkableIssues = allIssues.filter((i) => i.id !== issue.id);

  const doneSubtasks = issue.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = issue.subtasks.length;
  const subtaskPercent =
    totalSubtasks > 0 ? Math.round((doneSubtasks / totalSubtasks) * 100) : 0;

  const handleSaveTitle = async () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== issue.title) {
      await onUpdateDetails(issue.id, { title: trimmed });
    }
    setIsEditingTitle(false);
  };

  const handleSaveDesc = async () => {
    await onUpdateDetails(issue.id, { description: descDraft });
    setIsEditingDesc(false);
  };

  const handleCreateSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddSubtask(issue.id, newSubtaskTitle.trim());
      setNewSubtaskTitle("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentBody.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddComment(issue.id, newCommentBody.trim());
      setNewCommentBody("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateRelation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRelationIssueId) return;
    setIsSubmitting(true);
    try {
      await onAddRelation(issue.id, targetRelationIssueId, relationType);
      setTargetRelationIssueId("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDeleteIssue(issue.id);
      setShowDeleteConfirm(false);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !onAttachImage) return;
    setIsConvertingImage(true);
    try {
      const converted = await convertImageFileToWebp(file);
      await onAttachImage(issue.id, converted);
      const gainPercent =
        converted.originalSizeBytes > converted.webpSizeBytes
          ? Math.round(
              (1 - converted.webpSizeBytes / converted.originalSizeBytes) * 100
            )
          : 0;
      notifySuccess(
        "Image convertie en WebP et ajoutée",
        `${converted.name} (${converted.originalFormat} → WEBP · ${formatSizeKb(converted.webpSizeBytes)}${gainPercent > 0 ? ` · -${gainPercent}%` : ""})`
      );
    } catch (err) {
      notifyError(
        "Impossible d'ajouter l'image",
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setIsConvertingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const attachments = issue.attachments ?? [];

  return (
    <>
      <dialog
        open
        className="modal modal-open modal-bottom sm:modal-middle z-40"
        aria-labelledby="issue-detail-heading"
      >
        <div className="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-4xl w-full p-0 overflow-hidden max-h-[90vh] flex flex-col">
          {/* Sticky Modal Header */}
          <header className="flex items-center justify-between gap-3 px-6 py-3.5 bg-base-200/70 border-b border-base-300">
            <div className="breadcrumbs text-xs py-0">
              <ul>
                <li className="text-base-content/60">
                  {project ? project.name : "Projet"}
                </li>
                <li>
                  <span className="font-mono font-bold text-primary">
                    {issue.key}
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2">
              <IssueTypeBadge type={issue.type} />
              {!canEdit && (
                <span className="badge badge-ghost badge-xs font-semibold">
                  Mode Visiteur · Lecture seule
                </span>
              )}
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn btn-ghost btn-xs text-error gap-1"
                  aria-label={`Supprimer le ticket ${issue.key}`}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                  Supprimer le ticket
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Fermer la fiche du ticket"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </header>

          {/* Modal Body Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-base-300 overflow-y-auto flex-1">
            {/* Left Column: Title, Description, Subtasks, Relations, Comments */}
            <div className="lg:col-span-2 p-6 space-y-6">
              {/* Inline Editable Title */}
              <div>
                {canEdit && isEditingTitle ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="input input-sm w-full font-bold text-base"
                      value={titleDraft}
                      onChange={(e) => setTitleDraft(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveTitle}
                      className="btn btn-primary btn-xs"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingTitle(false)}
                      className="btn btn-ghost btn-xs"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <h2
                      id="issue-detail-heading"
                      onClick={() => {
                        if (!canEdit) return;
                        setTitleDraft(issue.title);
                        setIsEditingTitle(true);
                      }}
                      className={`text-lg font-bold text-base-content px-2 py-1 -mx-2 rounded-field transition-colors ${
                        canEdit
                          ? "hover:bg-base-200/70 cursor-pointer"
                          : ""
                      }`}
                      title={
                        canEdit
                          ? "Cliquez pour modifier le nom du ticket"
                          : undefined
                      }
                    >
                      {issue.title}
                    </h2>
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => {
                          setTitleDraft(issue.title);
                          setIsEditingTitle(true);
                        }}
                        className="btn btn-ghost btn-xs gap-1 shrink-0"
                        title="Modifier le nom du ticket"
                      >
                        <Pencil className="size-3" aria-hidden="true" />
                        Modifier le titre
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Description Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/70">
                    Description & Spécifications
                  </h3>
                  {canEdit && !isEditingDesc && (
                    <button
                      type="button"
                      onClick={() => {
                        setDescDraft(issue.description);
                        setIsEditingDesc(true);
                      }}
                      className="btn btn-ghost btn-xs"
                    >
                      Modifier la description
                    </button>
                  )}
                </div>

                {isEditingDesc ? (
                  <div className="space-y-2">
                    <textarea
                      className="textarea textarea-sm w-full h-32 font-mono text-xs"
                      value={descDraft}
                      onChange={(e) => setDescDraft(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingDesc(false)}
                        className="btn btn-ghost btn-xs"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveDesc}
                        className="btn btn-primary btn-xs"
                      >
                        Enregistrer la description
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-base-200/60 border border-base-300 rounded-box p-3.5 text-sm whitespace-pre-wrap leading-relaxed">
                    {issue.description || (
                      <span className="text-base-content/50 italic">
                        Aucune description renseignée. Cliquez sur &laquo; Modifier la description &raquo;.
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Images de Contexte (Accessible aux Visiteurs, Éditeurs et Administrateurs — Converties en WebP) */}
              <div className="space-y-3 bg-base-200/40 border border-base-300 rounded-box p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                      <ImagePlus
                        className="size-3.5 text-primary"
                        aria-hidden="true"
                      />
                      Images & Captures de contexte ({attachments.length})
                    </h3>
                    <p className="text-[11px] text-base-content/60">
                      <strong>Admins</strong> · Formats acceptés :{" "}
                      <span className="font-mono font-semibold">JPG, PNG, WEBP</span>
                    </p>
                  </div>

                  {onAttachImage && (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleImageFileChange}
                      />
                      <button
                        type="button"
                        disabled={isConvertingImage}
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-primary btn-xs gap-1.5"
                      >
                        {isConvertingImage ? (
                          <span className="loading loading-spinner loading-xs" />
                        ) : (
                          <ImagePlus className="size-3.5" aria-hidden="true" />
                        )}
                        {isConvertingImage
                          ? "Conversion WebP…"
                          : "Ajouter une image"}
                      </button>
                    </div>
                  )}
                </div>

                {attachments.length === 0 ? (
                  <div className="border border-dashed border-base-300 rounded-field p-4 text-center text-xs text-base-content/60">
                    Aucune image attachée à ce ticket. Ajoutez une capture d&apos;écran (JPG, PNG ou WEBP) pour donner plus de contexte visuel.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {attachments.map((att) => {
                      const uploader = users.find(
                        (u) => u.id === att.uploadedById
                      );
                      const canDeleteAtt =
                        canEdit || att.uploadedById === currentUserId;
                      return (
                        <div
                          key={att.id}
                          className="card bg-base-100 border border-base-300 shadow-2xs overflow-hidden group"
                        >
                          <div className="relative h-36 bg-base-200 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={att.dataUrl}
                              alt={att.name}
                              loading="lazy"
                              className="w-full h-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-105"
                              onClick={() => setPreviewAttachment(att)}
                            />
                            <div className="absolute top-2 left-2 flex items-center gap-1">
                              <span className="badge badge-neutral badge-xs font-mono">
                                {att.originalFormat} → WEBP
                              </span>
                              <span className="badge badge-ghost bg-base-100/90 badge-xs font-mono">
                                {formatSizeKb(att.webpSizeBytes)}
                              </span>
                            </div>
                            <div className="absolute top-2 right-2 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setPreviewAttachment(att)}
                                className="btn btn-xs btn-circle bg-base-100/90 hover:bg-base-100 border border-base-300"
                                title="Agrandir l'image"
                                aria-label={`Agrandir ${att.name}`}
                              >
                                <Maximize2 className="size-3" aria-hidden="true" />
                              </button>
                              {onRemoveImage && canDeleteAtt && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    void onRemoveImage(issue.id, att.id)
                                  }
                                  className="btn btn-xs btn-circle bg-base-100/90 hover:bg-error hover:text-error-content border border-base-300"
                                  title="Supprimer cette image"
                                  aria-label={`Supprimer ${att.name}`}
                                >
                                  <Trash2 className="size-3" aria-hidden="true" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="p-2.5 flex items-center justify-between gap-2 text-xs">
                            <div className="min-w-0">
                              <p
                                className="font-semibold truncate"
                                title={att.name}
                              >
                                {att.name}
                              </p>
                              <p className="text-[10px] text-base-content/60 font-mono">
                                {att.width}×{att.height}px · Par{" "}
                                {uploader ? uploader.name : "Collaborateur"}
                              </p>
                            </div>
                            <UserAvatarBadge user={uploader} size="xs" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Subtasks Checklist Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                    <CheckSquare className="size-3.5 text-primary" aria-hidden="true" />
                    Sous-tâches ({doneSubtasks}/{totalSubtasks})
                  </h3>
                  {totalSubtasks > 0 && (
                    <span className="badge badge-primary badge-soft badge-xs tabular-nums">
                      {subtaskPercent} % complété
                    </span>
                  )}
                </div>

                {totalSubtasks > 0 && (
                  <progress
                    className="progress progress-primary w-full"
                    value={doneSubtasks}
                    max={totalSubtasks}
                    aria-label="Progression des sous-tâches"
                  ></progress>
                )}

                <div className="space-y-1.5">
                  {issue.subtasks.map((sub) => (
                    <label
                      key={sub.id}
                      className={`flex items-center gap-2.5 p-2 rounded-field bg-base-200/50 text-sm ${
                        canEdit ? "hover:bg-base-200 cursor-pointer" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={!canEdit}
                        className="checkbox checkbox-xs checkbox-primary"
                        checked={sub.completed}
                        onChange={() => {
                          if (canEdit) void onToggleSubtask(issue.id, sub.id);
                        }}
                      />
                      <span
                        className={
                          sub.completed
                            ? "line-through text-base-content/50"
                            : "text-base-content"
                        }
                      >
                        {sub.title}
                      </span>
                    </label>
                  ))}
                </div>

                {canEdit && (
                  <form onSubmit={handleCreateSubtask} className="join w-full">
                    <input
                      type="text"
                      placeholder="Ajouter une sous-tâche technique..."
                      className="input input-xs join-item flex-1"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !newSubtaskTitle.trim()}
                      className="btn btn-neutral btn-xs join-item gap-1"
                    >
                      {isSubmitting ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        <Plus className="size-3" aria-hidden="true" />
                      )}
                      Ajouter
                    </button>
                  </form>
                )}
              </div>

              {/* Dependencies & Relations */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                  <Link2 className="size-3.5 text-secondary" aria-hidden="true" />
                  Liens & Dépendances (Cartographiés sur le Globe 3D)
                </h3>

                {issue.relations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {issue.relations.map((rel) => (
                      <span
                        key={rel.id}
                        className={`badge badge-sm gap-1.5 ${
                          rel.type === "BLOCKS" || rel.type === "IS_BLOCKED_BY"
                            ? "badge-error badge-soft"
                            : "badge-info badge-soft"
                        }`}
                      >
                        <strong>{rel.type}</strong> → {rel.targetIssueKey}
                      </span>
                    ))}
                  </div>
                )}

                {canEdit && (
                  <form
                    onSubmit={handleCreateRelation}
                    className="flex flex-wrap items-center gap-2"
                  >
                    <select
                      className="select select-xs w-40"
                      value={relationType}
                      onChange={(e) =>
                        setRelationType(e.target.value as RelationType)
                      }
                      aria-label="Type de relation"
                    >
                      {RELATION_TYPES.map((rt) => (
                        <option key={rt} value={rt}>
                          {rt}
                        </option>
                      ))}
                    </select>
                    <select
                      className="select select-xs flex-1 min-w-[180px]"
                      value={targetRelationIssueId}
                      onChange={(e) => setTargetRelationIssueId(e.target.value)}
                      aria-label="Ticket cible à lier"
                    >
                      <option value="">Sélectionner un ticket à lier...</option>
                      {linkableIssues.map((target) => (
                        <option key={target.id} value={target.id}>
                          [{target.key}] {target.title}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={!targetRelationIssueId || isSubmitting}
                      className="btn btn-outline btn-xs"
                    >
                      Lier le ticket
                    </button>
                  </form>
                )}
              </div>

              {/* Comments & Audit Log Tabs */}
              <div className="space-y-3 pt-2 border-t border-base-300">
                <div role="tablist" className="tabs tabs-box tabs-xs w-fit">
                  <button
                    type="button"
                    role="tab"
                    onClick={() => setActiveTab("COMMENTS")}
                    className={`tab gap-1.5 ${
                      activeTab === "COMMENTS" ? "tab-active" : ""
                    }`}
                  >
                    <MessageSquare className="size-3" aria-hidden="true" />
                    Commentaires ({issue.comments.length})
                  </button>
                  <button
                    type="button"
                    role="tab"
                    onClick={() => setActiveTab("ACTIVITY")}
                    className={`tab gap-1.5 ${
                      activeTab === "ACTIVITY" ? "tab-active" : ""
                    }`}
                  >
                    <History className="size-3" aria-hidden="true" />
                    Journal d&apos;audit ({issue.activities.length})
                  </button>
                </div>

                {activeTab === "COMMENTS" ? (
                  <div className="space-y-3">
                    {issue.comments.map((cmt) => {
                      const author = users.find((u) => u.id === cmt.authorId);
                      return (
                        <div
                          key={cmt.id}
                          className="bg-base-200/60 border border-base-300 rounded-box p-3 space-y-1"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <UserAvatarBadge user={author} size="xs" />
                              <span className="font-semibold">
                                {author ? author.name : "Collaborateur"}
                              </span>
                            </div>
                            <span className="text-base-content/50 tabular-nums">
                              {new Date(cmt.createdAt).toLocaleDateString(
                                "fr-FR"
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-base-content pl-7">
                            {cmt.body}
                          </p>
                        </div>
                      );
                    })}

                    {canEdit && (
                      <form onSubmit={handleCreateComment} className="space-y-2">
                        <fieldset className="fieldset">
                          <legend className="fieldset-legend text-xs">
                            Nouveau commentaire
                          </legend>
                          <textarea
                            className="textarea textarea-sm w-full"
                            placeholder="Partagez une mise à jour technique ou mentionnez un collègue..."
                            value={newCommentBody}
                            onChange={(e) => setNewCommentBody(e.target.value)}
                          />
                        </fieldset>
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isSubmitting || !newCommentBody.trim()}
                            className="btn btn-primary btn-xs gap-1.5"
                          >
                            {isSubmitting ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              <Send className="size-3" aria-hidden="true" />
                            )}
                            Publier le commentaire
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {issue.activities.length === 0 ? (
                      <p className="text-xs text-base-content/60">
                        Aucune modification enregistrée sur ce ticket.
                      </p>
                    ) : (
                      issue.activities.map((act) => {
                        const actor = users.find((u) => u.id === act.actorId);
                        return (
                          <div
                            key={act.id}
                            className="flex items-center justify-between text-xs bg-base-200/40 px-3 py-2 rounded-field border border-base-300"
                          >
                            <span>
                              <strong>
                                {actor ? actor.name : "Système"}
                              </strong>{" "}
                              — {act.action}
                            </span>
                            <span className="text-base-content/50 tabular-nums">
                              {new Date(act.createdAt).toLocaleDateString(
                                "fr-FR"
                              )}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Metadata Controls */}
            <aside className="p-6 bg-base-200/30 space-y-4 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-base-content/70">
                Attributs & Planification
              </h3>

              {/* Status Select */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-xs">
                  Statut du Workflow
                </legend>
                <select
                  className="select select-sm w-full"
                  disabled={!canEdit}
                  value={issue.status}
                  onChange={(e) =>
                    onUpdateStatus(issue.id, e.target.value as StatusCategory)
                  }
                >
                  {getProjectColumns(project).map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.label}
                    </option>
                  ))}
                </select>
              </fieldset>

              {/* Priority Select */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-xs">Priorité</legend>
                <select
                  className="select select-sm w-full"
                  disabled={!canEdit}
                  value={issue.priority}
                  onChange={(e) =>
                    onUpdateDetails(issue.id, {
                      priority: e.target.value as IssuePriority,
                    })
                  }
                >
                  {ISSUE_PRIORITIES.map((pr) => (
                    <option key={pr} value={pr}>
                      {PRIORITY_METADATA[pr].label} ({pr})
                    </option>
                  ))}
                </select>
              </fieldset>

              {/* Assignee Select */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-xs">
                  Collaborateur Assigné
                </legend>
                <select
                  className="select select-sm w-full"
                  disabled={!canEdit}
                  value={issue.assigneeId || ""}
                  onChange={(e) =>
                    onUpdateDetails(issue.id, {
                      assigneeId: e.target.value ? e.target.value : null,
                    })
                  }
                >
                  <option value="">Non assigné</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} — {u.department}
                    </option>
                  ))}
                </select>
              </fieldset>

              {/* Story Points */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-xs">
                  Estimation (Story Points)
                </legend>
                <select
                  className="select select-sm w-full tabular-nums"
                  disabled={!canEdit}
                  value={issue.storyPoints}
                  onChange={(e) =>
                    onUpdateDetails(issue.id, {
                      storyPoints: Number(e.target.value),
                    })
                  }
                >
                  {[1, 2, 3, 5, 8, 13, 20].map((sp) => (
                    <option key={sp} value={sp}>
                      {sp} Story Points
                    </option>
                  ))}
                </select>
              </fieldset>

              {/* Sprint Select */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-xs">
                  Sprint Affecté
                </legend>
                <select
                  className="select select-sm w-full"
                  disabled={!canEdit}
                  value={issue.sprintId || ""}
                  onChange={(e) =>
                    onUpdateDetails(issue.id, {
                      sprintId: e.target.value ? e.target.value : null,
                    })
                  }
                >
                  <option value="">Backlog général</option>
                  {sprints.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.name} ({sp.status})
                    </option>
                  ))}
                </select>
              </fieldset>

              {/* Epic Select */}
              {issue.type !== "EPIC" && (
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">
                    Epic Parent
                  </legend>
                  <select
                    className="select select-sm w-full"
                    disabled={!canEdit}
                    value={issue.epicId || ""}
                    onChange={(e) =>
                      onUpdateDetails(issue.id, {
                        epicId: e.target.value ? e.target.value : null,
                      })
                    }
                  >
                    <option value="">Aucun Epic</option>
                    {epics.map((ep) => (
                      <option key={ep.id} value={ep.id}>
                        [{ep.key}] {ep.title}
                      </option>
                    ))}
                  </select>
                </fieldset>
              )}

              {/* Time Tracking Module */}
              <div className="bg-base-100 border border-base-300 rounded-box p-3 space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary" aria-hidden="true" />
                    Suivi du Temps
                  </span>
                  <span className="tabular-nums">
                    {issue.timeLoggedHours}h / {issue.timeEstimatedHours}h
                  </span>
                </div>
                <progress
                  className="progress progress-info w-full"
                  value={issue.timeLoggedHours}
                  max={Math.max(1, issue.timeEstimatedHours)}
                  aria-label="Suivi du temps consommé"
                ></progress>
                {canEdit && (
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateDetails(issue.id, {
                          timeLoggedHours: issue.timeLoggedHours + 1,
                        })
                      }
                      className="btn btn-outline btn-xs flex-1"
                    >
                      +1h pointée
                    </button>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
        <div
          className="modal-backdrop bg-neutral/40 backdrop-blur-xs"
          onClick={onClose}
        />
      </dialog>

      {/* Modale d'aperçu plein écran d'une image WebP */}
      {previewAttachment && (
        <dialog
          open
          className="modal modal-open z-50"
          aria-label={`Aperçu de ${previewAttachment.name}`}
        >
          <div className="modal-box bg-base-100 border border-base-300 max-w-4xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-base-300 pb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="badge badge-success badge-soft badge-sm font-mono">
                  {previewAttachment.originalFormat} → WEBP
                </span>
                <span className="font-bold text-sm truncate">
                  {previewAttachment.name}
                </span>
                <span className="text-xs text-base-content/60 font-mono">
                  ({previewAttachment.width}×{previewAttachment.height}px ·{" "}
                  {formatSizeKb(previewAttachment.webpSizeBytes)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAttachment(null)}
                className="btn btn-ghost btn-xs btn-circle"
                aria-label="Fermer l'aperçu"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="bg-base-200 rounded-box p-2 flex items-center justify-center max-h-[75vh] overflow-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewAttachment.dataUrl}
                alt={previewAttachment.name}
                className="max-h-[70vh] w-auto object-contain rounded"
              />
            </div>
          </div>
          <div
            className="modal-backdrop bg-neutral/60 backdrop-blur-xs"
            onClick={() => setPreviewAttachment(null)}
          />
        </dialog>
      )}

      {/* Styled daisyUI 5 Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title={`Supprimer définitivement le ticket ${issue.key} ?`}
        description={`Cette action supprimera le ticket "${issue.title}", ses ${issue.subtasks.length} sous-tâches et ses liens sur le graphe des dépendances. Cette opération est irréversible.`}
        confirmLabel={`Supprimer ${issue.key}`}
        variant="error"
        isLoading={isSubmitting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}

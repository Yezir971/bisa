"use client";

import React from "react";
import type {
  IssuePriority,
  IssueType,
  StatusCategory,
} from "@/lib/validations/jira-schema";
import type { BoardColumn, Project, User } from "@/domain/entities";
import {
  AlertOctagon,
  ArrowDown,
  ArrowUp,
  BookOpen,
  Bug,
  CheckSquare,
  Flame,
  GitBranch,
  Layers,
  Minus,
} from "lucide-react";

export const DEFAULT_BOARD_COLUMNS: BoardColumn[] = [
  {
    id: "TODO",
    label: "À faire",
    badgeClass: "badge-ghost",
    dotClass: "status-neutral",
  },
  {
    id: "IN_PROGRESS",
    label: "En cours",
    badgeClass: "badge-info badge-soft",
    dotClass: "status-info",
  },
  {
    id: "IN_REVIEW",
    label: "En revue",
    badgeClass: "badge-warning badge-soft",
    dotClass: "status-warning",
  },
  {
    id: "DONE",
    label: "Terminé",
    badgeClass: "badge-success badge-soft",
    dotClass: "status-success",
  },
];

export const STATUS_METADATA: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  TODO: {
    label: "À faire",
    badgeClass: "badge-ghost",
    dotClass: "status-neutral",
  },
  IN_PROGRESS: {
    label: "En cours",
    badgeClass: "badge-info badge-soft",
    dotClass: "status-info",
  },
  IN_REVIEW: {
    label: "En revue",
    badgeClass: "badge-warning badge-soft",
    dotClass: "status-warning",
  },
  DONE: {
    label: "Terminé",
    badgeClass: "badge-success badge-soft",
    dotClass: "status-success",
  },
};

export function getProjectColumns(project?: Project | null): BoardColumn[] {
  if (project?.columns && project.columns.length > 0) {
    return project.columns;
  }
  return DEFAULT_BOARD_COLUMNS;
}

export function resolveStatusMeta(
  status: StatusCategory,
  columns?: BoardColumn[]
): { label: string; badgeClass: string; dotClass: string } {
  const fromCols = columns?.find((c) => c.id === status);
  if (fromCols) {
    return {
      label: fromCols.label,
      badgeClass: fromCols.badgeClass,
      dotClass: fromCols.dotClass,
    };
  }
  if (STATUS_METADATA[status]) {
    return STATUS_METADATA[status];
  }
  return {
    label: status,
    badgeClass: "badge-secondary badge-soft",
    dotClass: "status-secondary",
  };
}

export const ISSUE_TYPE_METADATA: Record<
  IssueType,
  { label: string; badgeClass: string }
> = {
  EPIC: { label: "Epic", badgeClass: "badge-secondary badge-soft" },
  STORY: { label: "Story", badgeClass: "badge-info badge-soft" },
  TASK: { label: "Task", badgeClass: "badge-primary badge-soft" },
  BUG: { label: "Bug", badgeClass: "badge-error badge-soft" },
  SUBTASK: { label: "Sous-tâche", badgeClass: "badge-accent badge-soft" },
};

export const PRIORITY_METADATA: Record<
  IssuePriority,
  { label: string; badgeClass: string }
> = {
  BLOCKER: { label: "Bloquant", badgeClass: "badge-error" },
  HIGHEST: { label: "Critique", badgeClass: "badge-error badge-soft" },
  HIGH: { label: "Haute", badgeClass: "badge-warning badge-soft" },
  MEDIUM: { label: "Moyenne", badgeClass: "badge-info badge-soft" },
  LOW: { label: "Basse", badgeClass: "badge-ghost" },
  LOWEST: { label: "Mineure", badgeClass: "badge-ghost" },
};

export function IssueTypeBadge({ type }: { type: IssueType }) {
  const meta = ISSUE_TYPE_METADATA[type];
  return (
    <span className={`badge ${meta.badgeClass} badge-xs gap-1 font-medium`}>
      {type === "EPIC" && <Layers className="size-3" aria-hidden="true" />}
      {type === "STORY" && <BookOpen className="size-3" aria-hidden="true" />}
      {type === "TASK" && <CheckSquare className="size-3" aria-hidden="true" />}
      {type === "BUG" && <Bug className="size-3" aria-hidden="true" />}
      {type === "SUBTASK" && <GitBranch className="size-3" aria-hidden="true" />}
      {meta.label}
    </span>
  );
}

export function IssueStatusBadge({
  status,
  columns,
}: {
  status: StatusCategory;
  columns?: BoardColumn[];
}) {
  const meta = resolveStatusMeta(status, columns);
  return (
    <span className={`badge ${meta.badgeClass} badge-sm gap-1.5 font-medium`}>
      <span className={`status ${meta.dotClass}`} aria-hidden="true"></span>
      {meta.label}
    </span>
  );
}

export function IssuePriorityBadge({ priority }: { priority: IssuePriority }) {
  const meta = PRIORITY_METADATA[priority];
  return (
    <span className={`badge ${meta.badgeClass} badge-xs gap-1 font-medium`}>
      {priority === "BLOCKER" && (
        <AlertOctagon className="size-3" aria-hidden="true" />
      )}
      {priority === "HIGHEST" && (
        <Flame className="size-3" aria-hidden="true" />
      )}
      {priority === "HIGH" && <ArrowUp className="size-3" aria-hidden="true" />}
      {priority === "MEDIUM" && <Minus className="size-3" aria-hidden="true" />}
      {(priority === "LOW" || priority === "LOWEST") && (
        <ArrowDown className="size-3" aria-hidden="true" />
      )}
      {meta.label}
    </span>
  );
}

export function UserAvatarBadge({
  user,
  size = "sm",
}: {
  user?: User | null;
  size?: "xs" | "sm" | "md";
}) {
  const dim =
    size === "xs"
      ? "size-5 text-[10px]"
      : size === "sm"
        ? "size-6 text-xs"
        : "size-8 text-sm";

  if (!user) {
    return (
      <div
        className="tooltip"
        data-tip="Non assigné"
      >
        <div className="avatar avatar-placeholder">
          <div
            className={`bg-base-300 text-base-content/60 rounded-full ${dim}`}
          >
            <span>—</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tooltip" data-tip={`${user.name} (${user.department})`}>
      <div className="avatar avatar-placeholder">
        <div
          className={`bg-primary text-primary-content rounded-full font-semibold ${dim}`}
        >
          <span>{user.avatarInitials}</span>
        </div>
      </div>
    </div>
  );
}

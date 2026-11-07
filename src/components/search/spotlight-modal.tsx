"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Issue, Project } from "@/domain/entities";
import {
  IssuePriorityBadge,
  IssueStatusBadge,
  IssueTypeBadge,
} from "@/components/ui/issue-badges";
import { CornerDownLeft, Search, X } from "lucide-react";

interface SpotlightModalProps {
  isOpen: boolean;
  issues: Issue[];
  projects: Project[];
  onClose: () => void;
  onSelectIssue: (issue: Issue) => void;
  onSelectProject: (projectId: string) => void;
}

export function SpotlightModal({
  isOpen,
  issues,
  projects,
  onClose,
  onSelectIssue,
  onSelectProject,
}: SpotlightModalProps) {
  const [query, setQuery] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const matchingIssues = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return issues.slice(0, 8);
    return issues
      .filter(
        (i) =>
          i.key.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.labels.some((l) => l.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [issues, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          Math.min(Math.max(0, matchingIssues.length - 1), prev + 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "Enter" && matchingIssues[selectedIndex]) {
        e.preventDefault();
        onSelectIssue(matchingIssues[selectedIndex]);
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, matchingIssues, selectedIndex, onSelectIssue, onClose]);

  if (!isOpen) return null;

  return (
    <dialog
      open
      className="modal modal-open modal-top sm:modal-middle z-50"
      aria-label="Recherche rapide globale"
    >
      <div className="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-2xl p-0 overflow-hidden">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-base-300 bg-base-200/50">
          <Search
            className="size-4 text-primary shrink-0"
            aria-hidden="true"
          />
          <input
            type="search"
            autoFocus
            placeholder="Rechercher un ticket par clé (ex: CORE-4), titre ou label..."
            className="input input-ghost input-sm w-full focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="kbd kbd-xs">Échap</kbd>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-xs btn-circle"
            aria-label="Fermer la recherche"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        {/* Quick Project Filter Pills */}
        <div className="flex items-center gap-2 px-4 py-2 bg-base-200/30 border-b border-base-300 text-xs overflow-x-auto">
          <span className="text-base-content/60 font-medium">Projets :</span>
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onSelectProject(p.id);
                onClose();
              }}
              className="badge badge-primary badge-soft badge-sm cursor-pointer hover:opacity-80"
            >
              [{p.key}] {p.name}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-base-300/50">
          {matchingIssues.length === 0 ? (
            <div className="py-10 text-center text-sm text-base-content/60">
              Aucun ticket trouvé pour &laquo; {query} &raquo;.
            </div>
          ) : (
            matchingIssues.map((issue, idx) => (
              <button
                key={issue.id}
                type="button"
                onClick={() => {
                  onSelectIssue(issue);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left px-3 py-2.5 rounded-field flex items-center justify-between gap-3 transition-colors ${
                  idx === selectedIndex
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-base-200"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-primary shrink-0">
                    {issue.key}
                  </span>
                  <IssueTypeBadge type={issue.type} />
                  <span className="text-sm font-medium text-base-content truncate">
                    {issue.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <IssueStatusBadge status={issue.status} />
                  <IssuePriorityBadge priority={issue.priority} />
                  <CornerDownLeft
                    className="size-3.5 text-base-content/40"
                    aria-hidden="true"
                  />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer Keyboard Hints */}
        <footer className="px-4 py-2 bg-base-200/60 border-t border-base-300 flex items-center justify-between text-[11px] text-base-content/60">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="kbd kbd-xs">↑</kbd>{" "}
              <kbd className="kbd kbd-xs">↓</kbd> Naviguer
            </span>
            <span>
              <kbd className="kbd kbd-xs">Entrée</kbd> Ouvrir le ticket
            </span>
          </div>
          <span>{matchingIssues.length} résultat(s)</span>
        </footer>
      </div>
      <div
        className="modal-backdrop bg-neutral/40 backdrop-blur-xs"
        onClick={onClose}
      />
    </dialog>
  );
}

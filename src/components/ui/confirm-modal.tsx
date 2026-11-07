"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "error" | "primary" | "warning";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = "Annuler",
  variant = "error",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const confirmBtnClass =
    variant === "error"
      ? "btn-error"
      : variant === "warning"
        ? "btn-warning"
        : "btn-primary";

  return (
    <dialog
      open
      className="modal modal-open modal-bottom sm:modal-middle z-50"
      aria-labelledby="confirm-modal-title"
    >
      <div className="modal-box bg-base-100 border border-base-300 shadow-xl max-w-md p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-box ${
                variant === "error"
                  ? "bg-error/15 text-error"
                  : "bg-warning/15 text-warning"
              }`}
            >
              <AlertTriangle className="size-5" aria-hidden="true" />
            </div>
            <h3
              id="confirm-modal-title"
              className="text-base font-bold text-base-content"
            >
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost btn-xs btn-circle"
            aria-label="Fermer la fenêtre de confirmation"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <p className="py-4 text-sm text-base-content/70 leading-relaxed">
          {description}
        </p>

        <div className="modal-action flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="btn btn-ghost btn-sm"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`btn ${confirmBtnClass} btn-sm`}
          >
            {isLoading && (
              <span
                className="loading loading-spinner loading-xs"
                aria-hidden="true"
              ></span>
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
      <div
        className="modal-backdrop bg-neutral/40 backdrop-blur-xs"
        onClick={onCancel}
      />
    </dialog>
  );
}

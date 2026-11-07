"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

export type ToastVariant = "error" | "success" | "warning" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  notify: (
    title: string,
    variant?: ToastVariant,
    description?: string
  ) => void;
  notifyError: (title: string, description?: string) => void;
  notifySuccess: (title: string, description?: string) => void;
  notifyWarning: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const VARIANT_CLASS_MAP: Record<ToastVariant, string> = {
  error: "alert-error",
  success: "alert-success",
  warning: "alert-warning",
  info: "alert-info",
};

function ToastIcon({ variant }: { variant: ToastVariant }) {
  switch (variant) {
    case "error":
      return <AlertCircle className="size-5 shrink-0" aria-hidden="true" />;
    case "success":
      return <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />;
    case "warning":
      return <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />;
    case "info":
      return <Info className="size-5 shrink-0" aria-hidden="true" />;
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (
      title: string,
      variant: ToastVariant = "info",
      description?: string
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-2), { id, title, description, variant }]);
      setTimeout(() => {
        dismiss(id);
      }, 4000);
    },
    [dismiss]
  );

  const notifyError = useCallback(
    (title: string, description?: string) => notify(title, "error", description),
    [notify]
  );

  const notifySuccess = useCallback(
    (title: string, description?: string) =>
      notify(title, "success", description),
    [notify]
  );

  const notifyWarning = useCallback(
    (title: string, description?: string) =>
      notify(title, "warning", description),
    [notify]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        notify,
        notifyError,
        notifySuccess,
        notifyWarning,
        dismiss,
      }}
    >
      {children}
      {toasts.length > 0 && (
        <div
          className="toast toast-bottom toast-end z-50 pointer-events-none flex flex-col gap-2 w-auto max-w-[calc(100%-2rem)] sm:max-w-sm m-0 p-0"
          role="status"
          aria-live="polite"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              role="alert"
              className={`alert ${VARIANT_CLASS_MAP[t.variant]} alert-soft shadow-lg border border-base-300 pointer-events-auto flex items-start justify-between gap-3 w-full max-w-sm overflow-hidden whitespace-normal`}
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <ToastIcon variant={t.variant} />
                <div className="text-left min-w-0 flex-1 break-words">
                  <p className="font-semibold text-sm leading-snug break-words">
                    {t.title}
                  </p>
                  {t.description && (
                    <p className="text-xs opacity-80 mt-0.5 leading-relaxed break-words">
                      {t.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="btn btn-ghost btn-xs btn-circle shrink-0"
                aria-label="Fermer la notification"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast doit être utilisé au sein d'un ToastProvider");
  }
  return ctx;
}

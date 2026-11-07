import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ToastProvider, useToast } from "./toast-provider";

function ToastTriggerComponent() {
  const { notifyError, notifySuccess } = useToast();
  return (
    <div>
      <button
        type="button"
        onClick={() =>
          notifyError(
            "Impossible de déplacer le ticket",
            "Limite WIP atteinte sur la colonne"
          )
        }
      >
        Trigger Error
      </button>
      <button
        type="button"
        onClick={() => notifySuccess("Ticket CORE-10 créé avec succès")}
      >
        Trigger Success
      </button>
    </div>
  );
}

describe("ToastProvider daisyUI 5 (Zéro alert JS natif - TDD)", () => {
  it("affiche un toast d'erreur sémantique daisyUI (alert-error alert-soft) et permet de le fermer", () => {
    render(
      <ToastProvider>
        <ToastTriggerComponent />
      </ToastProvider>
    );

    // Aucun conteneur toast ne doit encombrer le DOM tant qu'aucun message n'est actif
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Trigger Error"));

    const statusEl = screen.getByRole("status");
    expect(statusEl).toHaveClass("toast", "toast-bottom", "toast-end");
    const alertEl = screen.getByRole("alert");
    expect(alertEl).toHaveClass("alert", "alert-error", "alert-soft");
    expect(
      screen.getByText("Impossible de déplacer le ticket")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Limite WIP atteinte sur la colonne")
    ).toBeInTheDocument();

    const closeBtn = screen.getByLabelText("Fermer la notification");
    fireEvent.click(closeBtn);
    expect(
      screen.queryByText("Impossible de déplacer le ticket")
    ).not.toBeInTheDocument();
  });
});

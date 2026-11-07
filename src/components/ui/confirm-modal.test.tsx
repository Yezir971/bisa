import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmModal } from "./confirm-modal";
import { KanbanBoardSkeleton } from "./daisy-skeletons";

describe("ConfirmModal & Skeletons daisyUI 5 (TDD & 100% daisyUI-First)", () => {
  it("rend une modale <dialog class='modal'> stylisée daisyUI 5 avec loader loading-spinner en état de chargement", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <ConfirmModal
        isOpen={true}
        title="Supprimer le ticket CORE-4 ?"
        description="Cette suppression est définitive."
        confirmLabel="Supprimer définitivement"
        variant="error"
        isLoading={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(
      screen.getByText("Supprimer le ticket CORE-4 ?")
    ).toBeInTheDocument();
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("modal", "modal-open");

    const spinner = dialog.querySelector(".loading.loading-spinner");
    expect(spinner).not.toBeNull();
  });

  it("rend des composants skeleton daisyUI 5 géométriques pour le tableau Kanban", () => {
    const { container } = render(<KanbanBoardSkeleton />);
    const skeletons = container.querySelectorAll(".skeleton");
    expect(skeletons.length).toBeGreaterThan(10);
  });
});

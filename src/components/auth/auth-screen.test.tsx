import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthScreen } from "./auth-screen";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { INITIAL_USERS } from "@/repositories/seed-data";

vi.mock("@/server/actions/jira-actions", () => ({
  loginUserAction: vi.fn(async () => ({
    ok: true,
    data: INITIAL_USERS[0],
  })),
  registerUserAction: vi.fn(async (input: { name: string; email: string }) => ({
    ok: true,
    data: {
      ...INITIAL_USERS[0],
      id: "usr-new",
      name: input.name,
      email: input.email,
    },
  })),
  updateUserThemeAction: vi.fn(async () => ({
    ok: true,
    data: INITIAL_USERS[0],
  })),
}));

describe("AuthScreen Component (Connexion & Inscription)", () => {
  it("affiche le formulaire de connexion par défaut et permet de basculer vers l'inscription", () => {
    const onAuth = vi.fn();
    render(
      <ThemeProvider initialTheme="light">
        <ToastProvider>
          <AuthScreen demoUsers={INITIAL_USERS} onAuthenticated={onAuth} />
        </ToastProvider>
      </ThemeProvider>
    );

    expect(
      screen.getByText("Connectez-vous à votre espace")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Se connecter/i })
    ).toBeInTheDocument();

    // Basculer sur l'onglet d'inscription
    fireEvent.click(screen.getByRole("tab", { name: /Créer un compte/i }));

    expect(
      screen.getByText("Créez votre compte collaborateur")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Créer mon compte/i })
    ).toBeInTheDocument();
  });
});

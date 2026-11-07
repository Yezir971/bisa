"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  FolderKanban,
  LogIn,
  Palette,
  Sparkles,
  UserPlus,
} from "lucide-react";
import type { User } from "@/domain/entities";
import {
  loginUserAction,
  registerUserAction,
} from "@/server/actions/jira-actions";
import { useToast } from "@/components/providers/toast-provider";
import { useTheme } from "@/components/providers/theme-provider";

interface AuthScreenProps {
  demoUsers: User[];
  onAuthenticated: (user: User) => void;
}

export function AuthScreen({ demoUsers, onAuthenticated }: AuthScreenProps) {
  const { notifySuccess, notifyError } = useToast();
  const { theme, setTheme, themes } = useTheme();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState(
    demoUsers[0]?.email || "camille.laurent@bisa.fr"
  );
  const [loginPassword, setLoginPassword] = useState("Bisa2026!");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerDepartment, setRegisterDepartment] = useState(
    "Ingénierie & Produit"
  );
  const [registerPassword, setRegisterPassword] = useState("");

  const activeThemeMeta =
    themes.find((t) => t.id === theme) || themes[0];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const res = await loginUserAction({
        email: loginEmail,
        password: loginPassword,
      });
      if (!res.ok) {
        setErrorMessage(res.error);
        notifyError("Échec de connexion", res.error);
        return;
      }
      notifySuccess(
        `Bienvenue, ${res.data.name}`,
        "Vous êtes connecté à votre espace de pilotage."
      );
      onAuthenticated(res.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const res = await registerUserAction({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        department: registerDepartment,
      });
      if (!res.ok) {
        setErrorMessage(res.error);
        notifyError("Inscription impossible", res.error);
        return;
      }
      notifySuccess(
        "Compte créé avec succès",
        `Bienvenue sur Bisa, ${res.data.name} !`
      );
      onAuthenticated(res.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoSelect = (user: User) => {
    setMode("login");
    setErrorMessage(null);
    setLoginEmail(user.email);
    setLoginPassword("Bisa2026!");
  };

  return (
    <main className="min-h-screen grid place-items-center bg-base-200 p-4 relative">
      {/* Sélecteur de thème discret en haut à droite */}
      <div className="fixed top-4 right-4 z-20">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-sm btn-ghost bg-base-100 border border-base-300 gap-1.5"
            aria-label="Changer le thème"
          >
            <Palette className="size-4 text-primary" />
            <span className="text-xs">{activeThemeMeta?.label}</span>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg border border-base-300 mt-1"
          >
            <li className="menu-title text-xs">Apparence</li>
            {themes.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={theme === t.id ? "menu-active font-semibold" : ""}
                >
                  <span className="flex-1 text-left">{t.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card w-full max-w-md bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body gap-5">
          {/* En-tête de marque */}
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary text-primary-content grid place-items-center font-bold shadow-xs">
              <FolderKanban className="size-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block leading-none">
                Bisa Workspace
              </span>
              <span className="text-xs text-base-content/60">
                Gestion de projets, sprints & suivi d&apos;équipe
              </span>
            </div>
          </div>

          {/* Onglets Connexion / Inscription */}
          <div role="tablist" className="tabs tabs-box bg-base-200 p-1">
            <button
              type="button"
              role="tab"
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
              }}
              className={`tab flex-1 gap-1.5 text-xs font-medium ${
                mode === "login" ? "tab-active" : ""
              }`}
            >
              <LogIn className="size-3.5" />
              Connexion
            </button>
            <button
              type="button"
              role="tab"
              onClick={() => {
                setMode("register");
                setErrorMessage(null);
              }}
              className={`tab flex-1 gap-1.5 text-xs font-medium ${
                mode === "register" ? "tab-active" : ""
              }`}
            >
              <UserPlus className="size-3.5" />
              Créer un compte
            </button>
          </div>

          <div>
            <h1 className="text-xl font-semibold">
              {mode === "login"
                ? "Connectez-vous à votre espace"
                : "Créez votre compte collaborateur"}
            </h1>
            <p className="text-xs text-base-content/60 mt-1">
              {mode === "login"
                ? "Accédez à vos tableaux Kanban, sprints, feuilles de route et rapports."
                : "Rejoignez votre équipe pour créer et piloter vos projets en temps réel."}
            </p>
          </div>

          {errorMessage && (
            <div role="alert" className="alert alert-error alert-soft text-xs">
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Adresse e-mail professionnelle
                </legend>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="input w-full"
                  placeholder="prenom.nom@entreprise.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <div className="flex items-center justify-between">
                  <legend className="fieldset-legend">Mot de passe</legend>
                </div>
                <div className="join w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    className="input join-item w-full"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost join-item border border-base-300"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-block mt-2"
              >
                {isSubmitting && (
                  <span className="loading loading-spinner loading-xs" />
                )}
                Se connecter
              </button>

              {/* Accès rapide comptes de démonstration */}
              {demoUsers.length > 0 && (
                <div className="pt-3 border-t border-base-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-base-content/60">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Sparkles className="size-3.5 text-primary" />
                      Comptes de démonstration (1 clic)
                    </span>
                    <span className="font-mono text-[11px]">
                      Mdp: Bisa2026!
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {demoUsers.slice(0, 3).map((u) => {
                      const roleLabel =
                        u.role === "ADMIN"
                          ? "Admin"
                          : u.role === "EDITOR"
                            ? "Éditeur"
                            : "Visiteur";
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => handleQuickDemoSelect(u)}
                          className={`btn btn-xs gap-1.5 ${
                            loginEmail === u.email
                              ? "btn-primary btn-soft"
                              : "btn-ghost border border-base-300"
                          }`}
                        >
                          <span className="font-semibold">{u.name}</span>
                          <span className="badge badge-ghost badge-xs">
                            {roleLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Nom complet *</legend>
                <input
                  type="text"
                  required
                  minLength={2}
                  autoComplete="name"
                  className="input w-full"
                  placeholder="Ex: Sophie Moreau"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Adresse e-mail professionnelle *
                </legend>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="input w-full"
                  placeholder="sophie.moreau@entreprise.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Équipe / Pôle</legend>
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Ex: Produit & Design, Ingénierie, Data..."
                  value={registerDepartment}
                  onChange={(e) => setRegisterDepartment(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Mot de passe (6 caractères min.) *
                </legend>
                <div className="join w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="input join-item w-full"
                    placeholder="Minimum 6 caractères"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost join-item border border-base-300"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-block mt-2"
              >
                {isSubmitting && (
                  <span className="loading loading-spinner loading-xs" />
                )}
                Créer mon compte
              </button>
            </form>
          )}

          <p className="text-center text-xs text-base-content/60 pt-1">
            {mode === "login" ? (
              <>
                Pas encore de compte ?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMessage(null);
                  }}
                  className="link link-primary font-medium"
                >
                  S&apos;inscrire gratuitement
                </button>
              </>
            ) : (
              <>
                Vous avez déjà un compte ?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage(null);
                  }}
                  className="link link-primary font-medium"
                >
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </main>
  );
}

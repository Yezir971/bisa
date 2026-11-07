"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  SUPPORTED_THEMES,
  type ThemeName,
} from "@/lib/validations/jira-schema";
import { updateUserThemeAction } from "@/server/actions/jira-actions";

export interface ThemeMeta {
  id: ThemeName;
  label: string;
  category: "Clair" | "Sombre";
  description: string;
}

export const THEME_CATALOG: ThemeMeta[] = [
  {
    id: "light",
    label: "Light (Défaut)",
    category: "Clair",
    description: "Clarté universelle et contrastes équilibrés pour la journée",
  },
  {
    id: "corporate",
    label: "Corporate",
    category: "Clair",
    description: "Palette entreprise sobre, géométrique et nette",
  },
  {
    id: "nord",
    label: "Nord",
    category: "Clair",
    description: "Teintes arctiques pastel apaisantes à faible fatigue visuelle",
  },
  {
    id: "emerald",
    label: "Emerald",
    category: "Clair",
    description: "Accents émeraude frais et haute lisibilité typographique",
  },
  {
    id: "dark",
    label: "Dark (Défaut sombre)",
    category: "Sombre",
    description: "Thème nocturne profond adapté aux longues sessions de code",
  },
  {
    id: "business",
    label: "Business",
    category: "Sombre",
    description: "Contraste exécutif sombre pour les tableaux analytiques",
  },
  {
    id: "dim",
    label: "Dim",
    category: "Sombre",
    description: "Mode crépusculaire doux réduisant l'éblouissement des écrans",
  },
  {
    id: "synthwave",
    label: "Synthwave",
    category: "Sombre",
    description: "Esthétique cyber-néon haute énergie à fort contraste",
  },
];

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (newTheme: ThemeName, userId?: string) => void;
  themes: ThemeMeta[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({
  initialTheme = "light",
  children,
}: {
  initialTheme?: ThemeName;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeName>(initialTheme);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bisa-theme") as ThemeName | null;
      if (stored && (SUPPORTED_THEMES as readonly string[]).includes(stored)) {
        setThemeState(stored);
        document.documentElement.setAttribute("data-theme", stored);
      } else {
        document.documentElement.setAttribute("data-theme", initialTheme);
      }
    } catch {
      document.documentElement.setAttribute("data-theme", initialTheme);
    }
  }, [initialTheme]);

  const setTheme = useCallback((newTheme: ThemeName, userId?: string) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    try {
      localStorage.setItem("bisa-theme", newTheme);
      document.cookie = `app-theme=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore storage quota errors
    }
    if (userId) {
      void updateUserThemeAction(userId, newTheme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEME_CATALOG }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme doit être utilisé au sein d'un ThemeProvider");
  }
  return ctx;
}

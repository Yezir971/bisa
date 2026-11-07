import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import {
  SUPPORTED_THEMES,
  type ThemeName,
} from "@/lib/validations/jira-schema";

export const metadata: Metadata = {
  title: "Bisa Workspace — Gestion de Projets, Sprints & Pilotage Agile",
  description:
    "Plateforme collaborative de gestion de projets, planification de sprints Scrum, tableaux Kanban, cartographie 3D des dépendances et suivi analytique.",
};

const ANTI_FOUC_SCRIPT = `
(function() {
  try {
    var saved = localStorage.getItem('bisa-theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) {}
})();
`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawCookieTheme = cookieStore.get("app-theme")?.value;
  const initialTheme: ThemeName =
    rawCookieTheme &&
    (SUPPORTED_THEMES as readonly string[]).includes(rawCookieTheme)
      ? (rawCookieTheme as ThemeName)
      : "light";

  return (
    <html lang="fr" data-theme={initialTheme} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ANTI_FOUC_SCRIPT }} />
      </head>
      <body className="bg-base-200 text-base-content min-h-screen antialiased overflow-x-clip">
        <ThemeProvider initialTheme={initialTheme}>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

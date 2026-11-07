import { describe, it, expect } from "vitest";
import {
  CreateProjectInputSchema,
  CreateIssueInputSchema,
  ThemeSchema,
} from "./jira-schema";

describe("Jira Validation Schemas (DRY & TDD)", () => {
  it("valide une entrée de projet conforme avec clé majuscule", () => {
    const valid = CreateProjectInputSchema.safeParse({
      name: "Plateforme Cloud Core",
      key: "CLOUD",
      description: "Infrastructure cloud et microservices",
      leadId: "usr-1",
    });
    expect(valid.success).toBe(true);
  });

  it("rejette une clé de projet contenant des minuscules ou trop courte", () => {
    const invalid = CreateProjectInputSchema.safeParse({
      name: "Projet Test",
      key: "ab",
      leadId: "usr-1",
    });
    expect(invalid.success).toBe(false);
  });

  it("valide la création d'un ticket avec valeurs par défaut sémantiques", () => {
    const parsed = CreateIssueInputSchema.parse({
      projectId: "proj-1",
      title: "Implémenter le graphe 3D style Obsidian",
      type: "STORY",
      reporterId: "usr-1",
    });
    expect(parsed.status).toBe("TODO");
    expect(parsed.priority).toBe("MEDIUM");
    expect(parsed.storyPoints).toBe(3);
  });

  it("valide uniquement les thèmes daisyUI supportés", () => {
    expect(ThemeSchema.safeParse("nord").success).toBe(true);
    expect(ThemeSchema.safeParse("synthwave").success).toBe(true);
    expect(ThemeSchema.safeParse("unknown-theme").success).toBe(false);
  });
});

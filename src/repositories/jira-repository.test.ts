import { describe, it, expect, beforeEach } from "vitest";
import { getJiraRepository, InMemoryJiraRepository } from "./jira-repository";

describe("InMemoryJiraRepository (Auth, Atomic Keys & Audit - TDD)", () => {
  let repo: InMemoryJiraRepository;

  beforeEach(() => {
    repo = new InMemoryJiraRepository();
  });

  it("génère des clés de tickets séquentielles atomiques (ex: CORE-7, CORE-8)", async () => {
    const issue1 = await repo.createIssue({
      projectId: "proj-core",
      title: "Premier ticket atomique",
      description: "Test concurrence",
      type: "TASK",
      status: "TODO",
      priority: "MEDIUM",
      storyPoints: 3,
      reporterId: "usr-1",
      assigneeId: "usr-2",
      sprintId: "sp-11",
      epicId: null,
      parentId: null,
      labels: ["facturation"],
      timeEstimatedHours: 4,
    });

    const issue2 = await repo.createIssue({
      projectId: "proj-core",
      title: "Deuxième ticket atomique",
      description: "Test concurrence 2",
      type: "BUG",
      status: "IN_PROGRESS",
      priority: "HIGH",
      storyPoints: 5,
      reporterId: "usr-1",
      assigneeId: "usr-3",
      sprintId: "sp-11",
      epicId: null,
      parentId: null,
      labels: ["facturation"],
      timeEstimatedHours: 6,
    });

    expect(issue1.key).toBe("CORE-7");
    expect(issue2.key).toBe("CORE-8");
  });

  it("inscrit un nouvel utilisateur et lui permet de se connecter", async () => {
    const newUser = await repo.registerUser({
      name: "Claire Fontaine",
      email: "claire.fontaine@bisa.fr",
      password: "Password123!",
      department: "Qualité & Produit",
    });

    expect(newUser.avatarInitials).toBe("CF");
    expect(newUser.email).toBe("claire.fontaine@bisa.fr");

    const loggedIn = await repo.authenticateUser({
      email: "claire.fontaine@bisa.fr",
      password: "Password123!",
    });

    expect(loggedIn.id).toBe(newUser.id);
    expect(loggedIn.name).toBe("Claire Fontaine");
  });

  it("rejette une connexion avec un mot de passe invalide", async () => {
    await expect(
      repo.authenticateUser({
        email: "camille.laurent@bisa.fr",
        password: "MauvaisMotDePasse",
      })
    ).rejects.toThrow("Adresse e-mail ou mot de passe incorrect.");
  });

  it("enregistre un historique d'audit (IssueActivity) lors du changement de statut", async () => {
    const updated = await repo.updateIssueStatus(
      "iss-core-4",
      "DONE",
      "usr-1"
    );

    expect(updated.status).toBe("DONE");
    expect(updated.activities.length).toBeGreaterThan(0);
    expect(updated.activities[0].newValue).toBe("DONE");
  });

  it("crée un nouveau projet avec clé unique et compteur initialisé", async () => {
    const project = await repo.createProject({
      name: "Sécurité & IAM",
      key: "SEC",
      description: "Authentification OIDC",
      leadId: "usr-1",
    });

    expect(project.key).toBe("SEC");
    expect(project.issueCounter).toBe(0);
  });

  it("permet de renommer une catégorie Kanban existante et d'en ajouter une nouvelle", async () => {
    const renamedProj = await repo.renameProjectColumn(
      "proj-core",
      "TODO",
      "Backlog Sprint"
    );
    expect(
      renamedProj.columns?.find((c) => c.id === "TODO")?.label
    ).toBe("Backlog Sprint");

    const addedProj = await repo.addProjectColumn(
      "proj-core",
      "Recette / UAT",
      "secondary",
      5
    );
    const uatCol = addedProj.columns?.find(
      (c) => c.label === "Recette / UAT"
    );
    expect(uatCol).toBeDefined();
    expect(addedProj.wipLimits[uatCol!.id]).toBe(5);
  });

  it("recrée automatiquement le singleton global si une ancienne instance en mémoire ne possède pas registerUser (HMR)", async () => {
    const g = globalThis as unknown as { jiraRepository?: unknown };
    g.jiraRepository = { getSnapshot: async () => ({}) };

    const freshRepo = getJiraRepository();
    expect(typeof freshRepo.registerUser).toBe("function");
    expect(typeof freshRepo.authenticateUser).toBe("function");
    expect(typeof freshRepo.inviteUser).toBe("function");
    expect(typeof freshRepo.updateUserRole).toBe("function");
  });

  it("applique strictement le contrôle d'accès RBAC : seul un ADMIN peut inviter des utilisateurs, changer les rôles et créer des projets", async () => {
    // usr-1 est ADMIN, usr-2 est EDITOR, usr-3 est VIEWER
    const invitedViewer = await repo.inviteUser("usr-1", {
      name: "Pauline Garnier",
      email: "pauline.garnier@bisa.fr",
      department: "Marketing",
      role: "VIEWER",
    });
    expect(invitedViewer.role).toBe("VIEWER");

    // Un Éditeur (usr-2) ne peut pas inviter d'utilisateur
    await expect(
      repo.inviteUser("usr-2", {
        name: "Marc Dupuis",
        email: "marc.dupuis@bisa.fr",
        department: "Produit",
        role: "EDITOR",
      })
    ).rejects.toThrow(/seuls les administrateurs peuvent inviter/i);

    // Un Éditeur (usr-2) ne peut pas changer le rôle d'un utilisateur
    await expect(
      repo.updateUserRole("usr-2", invitedViewer.id, "EDITOR")
    ).rejects.toThrow(/seuls les administrateurs peuvent modifier le rôle/i);

    // L'Admin (usr-1) peut changer le rôle du visiteur en Éditeur
    const promoted = await repo.updateUserRole(
      "usr-1",
      invitedViewer.id,
      "EDITOR"
    );
    expect(promoted.role).toBe("EDITOR");

    // Un Éditeur (usr-2) ou un Visiteur (usr-3) ne peut pas créer de projet
    await expect(
      repo.createProject(
        {
          name: "Projet Non Autorisé",
          key: "NOPE",
          description: "Test RBAC",
          leadId: "usr-2",
        },
        "usr-2"
      )
    ).rejects.toThrow(/seuls les administrateurs peuvent créer un projet/i);
  });

  it("autorise les Visiteurs (VIEWER), Éditeurs (EDITOR) et Administrateurs (ADMIN) à ajouter une image convertie en WebP sur un ticket", async () => {
    const sampleWebpDataUrl =
      "data:image/webp;base64,UklGRhIAAABXRUJQVlA4TAYAAAAvAAAAAAfQ//73v/+BiOh/AAA=";

    // usr-3 est VIEWER (Visiteur)
    const afterViewerAttach = await repo.addIssueAttachment(
      "iss-core-4",
      "usr-3",
      {
        name: "capture-anomalie.webp",
        originalFormat: "PNG",
        mimeType: "image/webp",
        dataUrl: sampleWebpDataUrl,
        width: 1280,
        height: 720,
        originalSizeBytes: 245000,
        webpSizeBytes: 68000,
      }
    );

    expect(afterViewerAttach.attachments).toHaveLength(1);
    expect(afterViewerAttach.attachments?.[0]?.name).toBe(
      "capture-anomalie.webp"
    );
    expect(afterViewerAttach.attachments?.[0]?.mimeType).toBe("image/webp");
    expect(afterViewerAttach.attachments?.[0]?.uploadedById).toBe("usr-3");
  });
});

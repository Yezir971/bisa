import type {
  BoardColumn,
  GanttItem,
  Issue,
  IssueImageAttachment,
  Project,
  Sprint,
  User,
  Workspace,
} from "@/domain/entities";
import {
  AttachIssueImageInputSchema,
  CreateGanttItemInputSchema,
  CreateIssueInputSchema,
  CreateProjectInputSchema,
  CreateSprintInputSchema,
  InviteUserInputSchema,
  LoginInputSchema,
  RegisterInputSchema,
  UserRoleSchema,
  type AttachIssueImageInput,
  type CreateGanttItemInput,
  type CreateIssueInput,
  type CreateProjectInput,
  type CreateSprintInput,
  type InviteUserInput,
  type IssuePriority,
  type LoginInput,
  type RegisterInput,
  type RelationType,
  type StatusCategory,
  type ThemeName,
  type UserRole,
} from "@/lib/validations/jira-schema";
import { canAttachImageToIssue, canEditWorkspaceContent } from "@/domain/services/rbac";
import {
  INITIAL_CREDENTIALS,
  INITIAL_GANTT_ITEMS,
  INITIAL_ISSUES,
  INITIAL_PROJECTS,
  INITIAL_SPRINTS,
  INITIAL_USERS,
  INITIAL_WORKSPACE,
} from "./seed-data";
import { generateInitialRank } from "@/domain/services/lexorank";

export interface IJiraRepository {
  getSnapshot(): Promise<{
    workspace: Workspace;
    users: User[];
    projects: Project[];
    sprints: Sprint[];
    issues: Issue[];
    ganttItems: GanttItem[];
  }>;
  authenticateUser(input: LoginInput): Promise<User>;
  registerUser(input: RegisterInput): Promise<User>;
  inviteUser(actorId: string, input: InviteUserInput): Promise<User>;
  updateUserRole(
    actorId: string,
    targetUserId: string,
    newRole: UserRole
  ): Promise<User>;
  getUserById(userId: string): Promise<User | null>;
  createProject(input: CreateProjectInput, actorId?: string): Promise<Project>;
  deleteProject(projectId: string, actorId?: string): Promise<void>;
  createIssue(input: CreateIssueInput): Promise<Issue>;
  updateIssueStatus(
    issueId: string,
    newStatus: StatusCategory,
    actorId: string,
    newRank?: string
  ): Promise<Issue>;
  updateIssueDetails(
    issueId: string,
    patch: Partial<
      Pick<
        Issue,
        | "title"
        | "description"
        | "priority"
        | "storyPoints"
        | "assigneeId"
        | "sprintId"
        | "epicId"
        | "labels"
        | "timeLoggedHours"
        | "timeEstimatedHours"
      >
    >,
    actorId: string
  ): Promise<Issue>;
  deleteIssue(issueId: string): Promise<void>;
  addComment(issueId: string, authorId: string, body: string): Promise<Issue>;
  addSubtask(issueId: string, title: string): Promise<Issue>;
  toggleSubtask(issueId: string, subtaskId: string): Promise<Issue>;
  addRelation(
    sourceIssueId: string,
    targetIssueId: string,
    type: RelationType
  ): Promise<Issue>;
  addIssueAttachment(
    issueId: string,
    actorId: string,
    input: AttachIssueImageInput
  ): Promise<Issue>;
  removeIssueAttachment(
    issueId: string,
    attachmentId: string,
    actorId: string
  ): Promise<Issue>;
  createSprint(input: CreateSprintInput): Promise<Sprint>;
  updateSprint(
    sprintId: string,
    patch: Partial<Pick<Sprint, "name" | "goal" | "startDate" | "endDate">>
  ): Promise<Sprint>;
  startSprint(sprintId: string): Promise<Sprint>;
  completeSprint(
    sprintId: string,
    moveUnfinishedToSprintId: string | null
  ): Promise<Sprint>;
  updateProjectWipLimits(
    projectId: string,
    wipLimits: Record<StatusCategory, number>
  ): Promise<Project>;
  renameProjectColumn(
    projectId: string,
    columnId: StatusCategory,
    newLabel: string
  ): Promise<Project>;
  addProjectColumn(
    projectId: string,
    label: string,
    colorVariant?: "neutral" | "info" | "warning" | "success" | "secondary" | "primary" | "accent",
    wipLimit?: number
  ): Promise<Project>;
  deleteProjectColumn(
    projectId: string,
    columnId: StatusCategory
  ): Promise<Project>;
  createGanttItem(
    input: CreateGanttItemInput
  ): Promise<{ ganttItem: GanttItem; createdEpic: Issue | null }>;
  updateGanttItem(
    ganttId: string,
    patch: Partial<
      Pick<
        GanttItem,
        | "title"
        | "wbsCode"
        | "startDate"
        | "endDate"
        | "progress"
        | "isCritical"
        | "externalProvider"
      >
    >
  ): Promise<GanttItem>;
  deleteGanttItem(ganttId: string): Promise<void>;
  updateUserTheme(userId: string, theme: ThemeName): Promise<User>;
}

const DEFAULT_COLUMNS: BoardColumn[] = [
  {
    id: "TODO",
    label: "À faire",
    badgeClass: "badge-ghost",
    dotClass: "status-neutral",
  },
  {
    id: "IN_PROGRESS",
    label: "En cours",
    badgeClass: "badge-info badge-soft",
    dotClass: "status-info",
  },
  {
    id: "IN_REVIEW",
    label: "En revue",
    badgeClass: "badge-warning badge-soft",
    dotClass: "status-warning",
  },
  {
    id: "DONE",
    label: "Terminé",
    badgeClass: "badge-success badge-soft",
    dotClass: "status-success",
  },
];

const COLOR_VARIANT_CLASSES: Record<
  string,
  { badgeClass: string; dotClass: string }
> = {
  neutral: { badgeClass: "badge-ghost", dotClass: "status-neutral" },
  info: { badgeClass: "badge-info badge-soft", dotClass: "status-info" },
  warning: { badgeClass: "badge-warning badge-soft", dotClass: "status-warning" },
  success: { badgeClass: "badge-success badge-soft", dotClass: "status-success" },
  secondary: {
    badgeClass: "badge-secondary badge-soft",
    dotClass: "status-secondary",
  },
  primary: { badgeClass: "badge-primary badge-soft", dotClass: "status-primary" },
  accent: { badgeClass: "badge-accent badge-soft", dotClass: "status-accent" },
};

function computeInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "UT";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export class InMemoryJiraRepository implements IJiraRepository {
  private workspace: Workspace;
  private users: User[];
  private credentials: Record<string, string>;
  private projects: Project[];
  private sprints: Sprint[];
  private issues: Issue[];
  private ganttItems: GanttItem[];

  constructor() {
    this.workspace = structuredClone(INITIAL_WORKSPACE);
    this.users = structuredClone(INITIAL_USERS);
    this.credentials = structuredClone(INITIAL_CREDENTIALS);
    this.projects = structuredClone(INITIAL_PROJECTS).map((p) => ({
      ...p,
      columns: p.columns && p.columns.length > 0 ? p.columns : structuredClone(DEFAULT_COLUMNS),
    }));
    this.sprints = structuredClone(INITIAL_SPRINTS);
    this.issues = structuredClone(INITIAL_ISSUES).map((i) => ({
      ...i,
      attachments: i.attachments ? structuredClone(i.attachments) : [],
    }));
    this.ganttItems = structuredClone(INITIAL_GANTT_ITEMS);
  }

  async getSnapshot() {
    return {
      workspace: structuredClone(this.workspace),
      users: structuredClone(this.users),
      projects: structuredClone(this.projects),
      sprints: structuredClone(this.sprints),
      issues: structuredClone(this.issues),
      ganttItems: structuredClone(this.ganttItems),
    };
  }

  async authenticateUser(rawInput: LoginInput): Promise<User> {
    const input = LoginInputSchema.parse(rawInput);
    const user = this.users.find(
      (u) => u.email.toLowerCase() === input.email
    );
    const expectedPassword = this.credentials[input.email];
    if (!user || !expectedPassword || expectedPassword !== input.password) {
      throw new Error("Adresse e-mail ou mot de passe incorrect.");
    }
    return structuredClone(user);
  }

  async registerUser(rawInput: RegisterInput): Promise<User> {
    const input = RegisterInputSchema.parse(rawInput);
    const existing = this.users.find(
      (u) => u.email.toLowerCase() === input.email
    );
    if (existing) {
      throw new Error(
        "Un compte est déjà associé à cette adresse e-mail."
      );
    }

    const newUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: input.name.trim(),
      email: input.email,
      role: "EDITOR",
      avatarInitials: computeInitials(input.name),
      department: input.department.trim() || "Ingénierie Produit",
      themePreference: "light",
    };

    this.users.push(newUser);
    this.credentials[input.email] = input.password;
    return structuredClone(newUser);
  }

  async inviteUser(
    actorId: string,
    rawInput: InviteUserInput
  ): Promise<User> {
    const actor = this.users.find((u) => u.id === actorId);
    if (!actor || actor.role !== "ADMIN") {
      throw new Error(
        "Accès refusé : seuls les administrateurs peuvent inviter des utilisateurs."
      );
    }

    const input = InviteUserInputSchema.parse(rawInput);
    const existing = this.users.find(
      (u) => u.email.toLowerCase() === input.email
    );
    if (existing) {
      throw new Error(
        "Un collaborateur utilise déjà cette adresse e-mail dans l'espace de travail."
      );
    }

    const invitedUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: input.name.trim(),
      email: input.email,
      role: input.role, // "EDITOR" (Utilisateur / Éditeur) ou "VIEWER" (Visiteur)
      avatarInitials: computeInitials(input.name),
      department: input.department.trim() || "Ingénierie & Produit",
      themePreference: "light",
    };

    this.users.push(invitedUser);
    this.credentials[input.email] = "Bisa2026!";
    return structuredClone(invitedUser);
  }

  async updateUserRole(
    actorId: string,
    targetUserId: string,
    rawNewRole: UserRole
  ): Promise<User> {
    const actor = this.users.find((u) => u.id === actorId);
    if (!actor || actor.role !== "ADMIN") {
      throw new Error(
        "Accès refusé : seuls les administrateurs peuvent modifier le rôle d'un utilisateur."
      );
    }

    const newRole = UserRoleSchema.parse(rawNewRole);
    const target = this.users.find((u) => u.id === targetUserId);
    if (!target) {
      throw new Error("Utilisateur introuvable.");
    }

    if (target.role === "ADMIN" && newRole !== "ADMIN") {
      const adminCount = this.users.filter((u) => u.role === "ADMIN").length;
      if (adminCount <= 1) {
        throw new Error(
          "Impossible de retirer le rôle Admin du dernier administrateur de l'espace."
        );
      }
    }

    target.role = newRole;
    return structuredClone(target);
  }

  async getUserById(userId: string): Promise<User | null> {
    const found = this.users.find((u) => u.id === userId);
    return found ? structuredClone(found) : null;
  }

  async createProject(
    rawInput: CreateProjectInput,
    actorId?: string
  ): Promise<Project> {
    if (actorId) {
      const actor = this.users.find((u) => u.id === actorId);
      if (!actor || actor.role !== "ADMIN") {
        throw new Error(
          "Accès refusé : seuls les administrateurs peuvent créer un projet."
        );
      }
    }
    const input = CreateProjectInputSchema.parse(rawInput);
    const exists = this.projects.some(
      (p) => p.key.toUpperCase() === input.key.toUpperCase()
    );
    if (exists) {
      throw new Error(`La clé de projet "${input.key}" est déjà utilisée.`);
    }

    const newProject: Project = {
      id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      workspaceId: this.workspace.id,
      key: input.key.toUpperCase(),
      name: input.name,
      description: input.description || "",
      leadId: input.leadId,
      issueCounter: 0,
      wipLimits: {
        TODO: 12,
        IN_PROGRESS: 4,
        IN_REVIEW: 3,
        DONE: 50,
      },
      columns: structuredClone(DEFAULT_COLUMNS),
      createdAt: new Date().toISOString(),
    };

    this.projects.push(newProject);
    return structuredClone(newProject);
  }

  async deleteProject(projectId: string, actorId?: string): Promise<void> {
    if (actorId) {
      const actor = this.users.find((u) => u.id === actorId);
      if (!actor || actor.role !== "ADMIN") {
        throw new Error(
          "Accès refusé : seuls les administrateurs peuvent supprimer un projet."
        );
      }
    }
    if (this.projects.length <= 1) {
      throw new Error(
        "Impossible de supprimer le dernier projet actif de l'espace de travail."
      );
    }
    this.projects = this.projects.filter((p) => p.id !== projectId);
    this.issues = this.issues.filter((i) => i.projectId !== projectId);
    this.sprints = this.sprints.filter((s) => s.projectId !== projectId);
  }

  async createIssue(rawInput: CreateIssueInput): Promise<Issue> {
    const input = CreateIssueInputSchema.parse(rawInput);
    const project = this.projects.find((p) => p.id === input.projectId);
    if (!project) {
      throw new Error("Projet introuvable.");
    }

    project.issueCounter += 1;
    const issueKey = `${project.key}-${project.issueCounter}`;
    const now = new Date().toISOString();

    const newIssue: Issue = {
      id: `iss-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId: project.id,
      key: issueKey,
      title: input.title,
      description: input.description || "",
      type: input.type,
      status: input.status,
      priority: input.priority as IssuePriority,
      storyPoints: input.storyPoints ?? 3,
      assigneeId: input.assigneeId ?? null,
      reporterId: input.reporterId,
      sprintId: input.sprintId ?? null,
      epicId: input.epicId ?? null,
      parentId: input.parentId ?? null,
      labels: input.labels ?? [],
      subtasks: [],
      comments: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          actorId: input.reporterId,
          action: `Ticket ${issueKey} créé`,
          createdAt: now,
        },
      ],
      relations: [],
      attachments: [],
      timeEstimatedHours: input.timeEstimatedHours ?? 4,
      timeLoggedHours: 0,
      rank: generateInitialRank(this.issues.length + 1),
      dueDate: null,
      createdAt: now,
      updatedAt: now,
    };

    this.issues.unshift(newIssue);
    return structuredClone(newIssue);
  }

  async updateIssueStatus(
    issueId: string,
    newStatus: StatusCategory,
    actorId: string,
    newRank?: string
  ): Promise<Issue> {
    const issue = this.issues.find((i) => i.id === issueId);
    if (!issue) {
      throw new Error("Ticket introuvable.");
    }

    const oldStatus = issue.status;
    issue.status = newStatus;
    if (newRank) {
      issue.rank = newRank;
    }
    issue.updatedAt = new Date().toISOString();

    if (oldStatus !== newStatus) {
      issue.activities.unshift({
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        actorId,
        action: `Statut modifié de ${oldStatus} vers ${newStatus}`,
        fieldChanged: "status",
        oldValue: oldStatus,
        newValue: newStatus,
        createdAt: issue.updatedAt,
      });
    }

    return structuredClone(issue);
  }

  async updateIssueDetails(
    issueId: string,
    patch: Partial<
      Pick<
        Issue,
        | "title"
        | "description"
        | "priority"
        | "storyPoints"
        | "assigneeId"
        | "sprintId"
        | "epicId"
        | "labels"
        | "timeLoggedHours"
        | "timeEstimatedHours"
      >
    >,
    actorId: string
  ): Promise<Issue> {
    const issue = this.issues.find((i) => i.id === issueId);
    if (!issue) {
      throw new Error("Ticket introuvable.");
    }

    const now = new Date().toISOString();
    Object.assign(issue, patch, { updatedAt: now });

    issue.activities.unshift({
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      actorId,
      action: "Mise à jour des attributs du ticket",
      createdAt: now,
    });

    return structuredClone(issue);
  }

  async deleteIssue(issueId: string): Promise<void> {
    this.issues = this.issues.filter((i) => i.id !== issueId);
    for (const issue of this.issues) {
      issue.relations = issue.relations.filter(
        (r) => r.targetIssueId !== issueId
      );
    }
  }

  async addComment(
    issueId: string,
    authorId: string,
    body: string
  ): Promise<Issue> {
    const trimmed = body.trim();
    if (!trimmed) {
      throw new Error("Le commentaire ne peut pas être vide.");
    }
    const issue = this.issues.find((i) => i.id === issueId);
    if (!issue) {
      throw new Error("Ticket introuvable.");
    }

    const now = new Date().toISOString();
    issue.comments.push({
      id: `cmt-${Date.now()}`,
      authorId,
      body: trimmed,
      createdAt: now,
    });
    issue.updatedAt = now;

    return structuredClone(issue);
  }

  async addSubtask(issueId: string, title: string): Promise<Issue> {
    const trimmed = title.trim();
    if (!trimmed) {
      throw new Error("Le titre de la sous-tâche est requis.");
    }
    const issue = this.issues.find((i) => i.id === issueId);
    if (!issue) {
      throw new Error("Ticket introuvable.");
    }

    issue.subtasks.push({
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      title: trimmed,
      completed: false,
    });
    issue.updatedAt = new Date().toISOString();

    return structuredClone(issue);
  }

  async toggleSubtask(issueId: string, subtaskId: string): Promise<Issue> {
    const issue = this.issues.find((i) => i.id === issueId);
    if (!issue) {
      throw new Error("Ticket introuvable.");
    }
    const sub = issue.subtasks.find((s) => s.id === subtaskId);
    if (sub) {
      sub.completed = !sub.completed;
      issue.updatedAt = new Date().toISOString();
    }
    return structuredClone(issue);
  }

  async addRelation(
    sourceIssueId: string,
    targetIssueId: string,
    type: RelationType
  ): Promise<Issue> {
    if (sourceIssueId === targetIssueId) {
      throw new Error("Un ticket ne peut pas être lié à lui-même.");
    }
    const source = this.issues.find((i) => i.id === sourceIssueId);
    const target = this.issues.find((i) => i.id === targetIssueId);
    if (!source || !target) {
      throw new Error("Ticket source ou cible introuvable.");
    }

    const alreadyLinked = source.relations.some(
      (r) => r.targetIssueId === targetIssueId && r.type === type
    );
    if (!alreadyLinked) {
      source.relations.push({
        id: `rel-${Date.now()}`,
        targetIssueId: target.id,
        targetIssueKey: target.key,
        type,
      });
    }

    return structuredClone(source);
  }

  async addIssueAttachment(
    issueId: string,
    actorId: string,
    rawInput: AttachIssueImageInput
  ): Promise<Issue> {
    const actor = this.users.find((u) => u.id === actorId);
    if (!actor || !canAttachImageToIssue(actor.role)) {
      throw new Error(
        "Vous devez être connecté (Visiteur, Éditeur ou Administrateur) pour ajouter une image à ce ticket."
      );
    }

    const issue = this.issues.find((i) => i.id === issueId);
    if (!issue) {
      throw new Error("Ticket introuvable.");
    }

    const input = AttachIssueImageInputSchema.parse(rawInput);
    const now = new Date().toISOString();

    const attachment: IssueImageAttachment = {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: input.name,
      originalFormat: input.originalFormat,
      mimeType: "image/webp",
      dataUrl: input.dataUrl,
      width: input.width,
      height: input.height,
      originalSizeBytes: input.originalSizeBytes,
      webpSizeBytes: input.webpSizeBytes,
      uploadedById: actor.id,
      createdAt: now,
    };

    if (!issue.attachments) {
      issue.attachments = [];
    }
    issue.attachments.unshift(attachment);
    issue.updatedAt = now;

    issue.activities.unshift({
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      actorId: actor.id,
      action: `Image de contexte ajoutée (${attachment.name} · convertie de ${attachment.originalFormat} en WEBP)`,
      createdAt: now,
    });

    return structuredClone(issue);
  }

  async removeIssueAttachment(
    issueId: string,
    attachmentId: string,
    actorId: string
  ): Promise<Issue> {
    const actor = this.users.find((u) => u.id === actorId);
    if (!actor) {
      throw new Error("Utilisateur introuvable.");
    }

    const issue = this.issues.find((i) => i.id === issueId);
    if (!issue) {
      throw new Error("Ticket introuvable.");
    }

    const existing = (issue.attachments ?? []).find((a) => a.id === attachmentId);
    if (!existing) {
      throw new Error("Image introuvable sur ce ticket.");
    }

    if (
      existing.uploadedById !== actor.id &&
      !canEditWorkspaceContent(actor.role)
    ) {
      throw new Error(
        "Seul l'auteur de l'image, un Éditeur ou un Administrateur peut retirer cette image."
      );
    }

    issue.attachments = (issue.attachments ?? []).filter(
      (a) => a.id !== attachmentId
    );
    issue.updatedAt = new Date().toISOString();

    return structuredClone(issue);
  }

  async createSprint(rawInput: CreateSprintInput): Promise<Sprint> {
    const input = CreateSprintInputSchema.parse(rawInput);
    const newSprint: Sprint = {
      id: `sp-${Date.now()}`,
      projectId: input.projectId,
      name: input.name,
      goal: input.goal,
      startDate: input.startDate,
      endDate: input.endDate,
      status: "FUTURE",
      committedPoints: 0,
      completedPoints: 0,
    };
    this.sprints.push(newSprint);
    return structuredClone(newSprint);
  }

  async updateSprint(
    sprintId: string,
    patch: Partial<Pick<Sprint, "name" | "goal" | "startDate" | "endDate">>
  ): Promise<Sprint> {
    const sprint = this.sprints.find((s) => s.id === sprintId);
    if (!sprint) {
      throw new Error("Sprint introuvable.");
    }
    if (patch.name !== undefined && patch.name.trim().length >= 2) {
      sprint.name = patch.name.trim();
    }
    if (patch.goal !== undefined) {
      sprint.goal = patch.goal.trim();
    }
    if (patch.startDate !== undefined) {
      sprint.startDate = patch.startDate;
    }
    if (patch.endDate !== undefined) {
      sprint.endDate = patch.endDate;
    }
    return structuredClone(sprint);
  }

  async startSprint(sprintId: string): Promise<Sprint> {
    const sprint = this.sprints.find((s) => s.id === sprintId);
    if (!sprint) {
      throw new Error("Sprint introuvable.");
    }
    const sprintIssues = this.issues.filter((i) => i.sprintId === sprint.id);
    sprint.committedPoints = sprintIssues.reduce(
      (acc, i) => acc + i.storyPoints,
      0
    );
    sprint.status = "ACTIVE";
    return structuredClone(sprint);
  }

  async completeSprint(
    sprintId: string,
    moveUnfinishedToSprintId: string | null
  ): Promise<Sprint> {
    const sprint = this.sprints.find((s) => s.id === sprintId);
    if (!sprint) {
      throw new Error("Sprint introuvable.");
    }

    const sprintIssues = this.issues.filter((i) => i.sprintId === sprint.id);
    const donePoints = sprintIssues
      .filter((i) => i.status === "DONE")
      .reduce((acc, i) => acc + i.storyPoints, 0);

    sprint.completedPoints = donePoints;
    sprint.status = "CLOSED";

    for (const issue of sprintIssues) {
      if (issue.status !== "DONE") {
        issue.sprintId = moveUnfinishedToSprintId;
      }
    }

    return structuredClone(sprint);
  }

  async updateProjectWipLimits(
    projectId: string,
    wipLimits: Record<StatusCategory, number>
  ): Promise<Project> {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) {
      throw new Error("Projet introuvable.");
    }
    project.wipLimits = { ...wipLimits };
    return structuredClone(project);
  }

  async renameProjectColumn(
    projectId: string,
    columnId: StatusCategory,
    newLabel: string
  ): Promise<Project> {
    const trimmed = newLabel.trim();
    if (trimmed.length < 1 || trimmed.length > 40) {
      throw new Error(
        "Le nom de la catégorie doit contenir entre 1 et 40 caractères."
      );
    }
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) {
      throw new Error("Projet introuvable.");
    }
    if (!project.columns || project.columns.length === 0) {
      project.columns = structuredClone(DEFAULT_COLUMNS);
    }
    const col = project.columns.find((c) => c.id === columnId);
    if (!col) {
      throw new Error("Catégorie introuvable dans ce projet.");
    }
    col.label = trimmed;
    return structuredClone(project);
  }

  async addProjectColumn(
    projectId: string,
    label: string,
    colorVariant:
      | "neutral"
      | "info"
      | "warning"
      | "success"
      | "secondary"
      | "primary"
      | "accent" = "secondary",
    wipLimit = 6
  ): Promise<Project> {
    const trimmed = label.trim();
    if (trimmed.length < 1 || trimmed.length > 40) {
      throw new Error(
        "Le nom de la catégorie doit contenir entre 1 et 40 caractères."
      );
    }
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) {
      throw new Error("Projet introuvable.");
    }
    if (!project.columns || project.columns.length === 0) {
      project.columns = structuredClone(DEFAULT_COLUMNS);
    }
    if (
      project.columns.some(
        (c) => c.label.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      throw new Error("Une catégorie portant ce nom existe déjà.");
    }

    const slug = trimmed
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_|_$/g, "")
      .toUpperCase()
      .slice(0, 18);
    const id = `COL_${slug || "CUSTOM"}_${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    const style =
      COLOR_VARIANT_CLASSES[colorVariant] || COLOR_VARIANT_CLASSES.secondary;

    const newCol: BoardColumn = {
      id,
      label: trimmed,
      badgeClass: style.badgeClass,
      dotClass: style.dotClass,
    };

    // Insérer juste avant la colonne finale "DONE" si présente, sinon à la fin
    const doneIdx = project.columns.findIndex((c) => c.id === "DONE");
    if (doneIdx >= 0) {
      project.columns.splice(doneIdx, 0, newCol);
    } else {
      project.columns.push(newCol);
    }
    project.wipLimits[id] = Math.max(1, wipLimit);

    return structuredClone(project);
  }

  async deleteProjectColumn(
    projectId: string,
    columnId: StatusCategory
  ): Promise<Project> {
    const project = this.projects.find((p) => p.id === projectId);
    if (!project) {
      throw new Error("Projet introuvable.");
    }
    if (!project.columns || project.columns.length <= 1) {
      throw new Error("Le tableau doit conserver au moins une catégorie.");
    }
    const remaining = project.columns.filter((c) => c.id !== columnId);
    if (remaining.length === project.columns.length) {
      throw new Error("Catégorie introuvable.");
    }
    project.columns = remaining;
    delete project.wipLimits[columnId];

    const fallbackStatus = remaining[0].id;
    for (const issue of this.issues) {
      if (issue.projectId === projectId && issue.status === columnId) {
        issue.status = fallbackStatus;
      }
    }
    return structuredClone(project);
  }

  async createGanttItem(
    rawInput: CreateGanttItemInput
  ): Promise<{ ganttItem: GanttItem; createdEpic: Issue | null }> {
    const input = CreateGanttItemInputSchema.parse(rawInput);
    const project = this.projects.find((p) => p.id === input.projectId);
    if (!project) {
      throw new Error("Projet introuvable.");
    }

    let createdEpic: Issue | null = null;
    if (input.type === "EPIC" && input.autoCreateEpicIssue !== false) {
      createdEpic = await this.createIssue({
        projectId: project.id,
        title: input.title,
        description: `Epic planifié depuis le diagramme de Gantt (${input.startDate} → ${input.endDate}).`,
        type: "EPIC",
        status: input.progress >= 100 ? "DONE" : input.progress > 0 ? "IN_PROGRESS" : "TODO",
        priority: input.isCritical ? "HIGHEST" : "HIGH",
        storyPoints: 13,
        assigneeId: input.ownerId || project.leadId,
        reporterId: input.ownerId || project.leadId,
        sprintId: null,
        epicId: null,
        parentId: null,
        labels: ["gantt", "roadmap"],
        timeEstimatedHours: 24,
      });
    }

    const newItem: GanttItem = {
      id: `gantt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId: project.id,
      wbsCode: input.wbsCode.trim(),
      title:
        createdEpic && !input.title.includes(createdEpic.key)
          ? `Epic [${createdEpic.key}] : ${input.title}`
          : input.title,
      type: input.type,
      externalCategory:
        input.type === "EXTERNAL_DEPENDENCY"
          ? input.externalCategory || "MARKETING"
          : null,
      externalProvider: input.externalProvider || "",
      startDate: input.startDate,
      endDate:
        input.type === "MILESTONE"
          ? input.startDate
          : input.endDate >= input.startDate
            ? input.endDate
            : input.startDate,
      progress: input.type === "MILESTONE" ? 0 : input.progress ?? 0,
      ownerId: input.ownerId || project.leadId,
      linkedIssueId: createdEpic ? createdEpic.id : null,
      dependencies: input.predecessorId
        ? [
            {
              predecessorId: input.predecessorId,
              type: input.dependencyType || "FS",
            },
          ]
        : [],
      isCritical: Boolean(input.isCritical),
    };

    this.ganttItems.push(newItem);
    return {
      ganttItem: structuredClone(newItem),
      createdEpic: createdEpic ? structuredClone(createdEpic) : null,
    };
  }

  async updateGanttItem(
    ganttId: string,
    patch: Partial<
      Pick<
        GanttItem,
        | "title"
        | "wbsCode"
        | "startDate"
        | "endDate"
        | "progress"
        | "isCritical"
        | "externalProvider"
      >
    >
  ): Promise<GanttItem> {
    const item = this.ganttItems.find((g) => g.id === ganttId);
    if (!item) {
      throw new Error("Élément Gantt introuvable.");
    }
    if (patch.title !== undefined) item.title = patch.title.trim();
    if (patch.wbsCode !== undefined) item.wbsCode = patch.wbsCode.trim();
    if (patch.startDate !== undefined) {
      item.startDate = patch.startDate;
      if (item.type === "MILESTONE") {
        item.endDate = patch.startDate;
      }
    }
    if (patch.endDate !== undefined && item.type !== "MILESTONE") {
      item.endDate =
        patch.endDate >= item.startDate ? patch.endDate : item.startDate;
    }
    if (patch.progress !== undefined && item.type !== "MILESTONE") {
      item.progress = Math.max(0, Math.min(100, patch.progress));
    }
    if (patch.isCritical !== undefined) item.isCritical = patch.isCritical;
    if (patch.externalProvider !== undefined)
      item.externalProvider = patch.externalProvider;

    return structuredClone(item);
  }

  async deleteGanttItem(ganttId: string): Promise<void> {
    this.ganttItems = this.ganttItems.filter((g) => g.id !== ganttId);
    for (const item of this.ganttItems) {
      item.dependencies = item.dependencies.filter(
        (d) => d.predecessorId !== ganttId
      );
    }
  }

  async updateUserTheme(userId: string, theme: ThemeName): Promise<User> {
    const user = this.users.find((u) => u.id === userId) || this.users[0];
    user.themePreference = theme;
    return structuredClone(user);
  }
}

const REPO_SCHEMA_VERSION = 7;

const globalForRepo = globalThis as unknown as {
  jiraRepository?: IJiraRepository;
  jiraRepositoryVersion?: number;
};

export function getJiraRepository(): IJiraRepository {
  if (
    !globalForRepo.jiraRepository ||
    globalForRepo.jiraRepositoryVersion !== REPO_SCHEMA_VERSION ||
    typeof globalForRepo.jiraRepository.registerUser !== "function" ||
    typeof globalForRepo.jiraRepository.renameProjectColumn !== "function" ||
    typeof globalForRepo.jiraRepository.createGanttItem !== "function" ||
    typeof globalForRepo.jiraRepository.inviteUser !== "function" ||
    typeof globalForRepo.jiraRepository.updateUserRole !== "function" ||
    typeof globalForRepo.jiraRepository.addIssueAttachment !== "function"
  ) {
    globalForRepo.jiraRepository = new InMemoryJiraRepository();
    globalForRepo.jiraRepositoryVersion = REPO_SCHEMA_VERSION;
  }
  return globalForRepo.jiraRepository;
}

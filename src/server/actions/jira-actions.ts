"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getJiraRepository } from "@/repositories/jira-repository";
import type {
  AttachIssueImageInput,
  CreateGanttItemInput,
  CreateIssueInput,
  CreateProjectInput,
  CreateSprintInput,
  InviteUserInput,
  LoginInput,
  RegisterInput,
  RelationType,
  StatusCategory,
  ThemeName,
  UserRole,
} from "@/lib/validations/jira-schema";
import type { GanttItem, Issue, Sprint, User } from "@/domain/entities";
import {
  canAttachImageToIssue,
  canEditWorkspaceContent,
  isAdminRole,
} from "@/domain/services/rbac";
import {
  sendBrevoInvitationEmail,
  type BrevoInvitationResult,
} from "@/lib/email/brevo-mailer";

const SESSION_COOKIE_NAME = "bisa-session-user";

async function resolveActor(explicitActorId?: string): Promise<User | null> {
  const repo = getJiraRepository();
  if (explicitActorId) {
    return repo.getUserById(explicitActorId);
  }
  try {
    const cookieStore = await cookies();
    const cookieUserId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (cookieUserId) {
      return repo.getUserById(cookieUserId);
    }
  } catch {
    // Hors contexte requête HTTP (ex: test unitaire direct)
  }
  return null;
}

async function assertCanEdit(explicitActorId?: string): Promise<void> {
  const actor = await resolveActor(explicitActorId);
  if (actor && !canEditWorkspaceContent(actor.role)) {
    throw new Error(
      "Mode Visiteur : vous disposez d'un accès en lecture seule et ne pouvez pas effectuer de modifications."
    );
  }
}

async function assertIsAdmin(explicitActorId?: string): Promise<User> {
  const actor = await resolveActor(explicitActorId);
  if (!actor || !isAdminRole(actor.role)) {
    throw new Error(
      "Accès réservé aux administrateurs : vous n'avez pas les permissions requises pour cette action."
    );
  }
  return actor;
}

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function loginUserAction(
  input: LoginInput
): Promise<ActionResult<User>> {
  try {
    const repo = getJiraRepository();
    const user = await repo.authenticateUser(input);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, user.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
    revalidatePath("/");
    return { ok: true, data: user };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de se connecter à votre espace.",
    };
  }
}

export async function registerUserAction(
  input: RegisterInput
): Promise<ActionResult<User>> {
  try {
    const repo = getJiraRepository();
    const user = await repo.registerUser(input);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, user.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
    revalidatePath("/");
    return { ok: true, data: user };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de créer votre compte.",
    };
  }
}

export async function logoutUserAction(): Promise<ActionResult<boolean>> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    revalidatePath("/");
    return { ok: true, data: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de fermer la session.",
    };
  }
}

export async function switchSessionUserAction(
  userId: string
): Promise<ActionResult<User>> {
  try {
    const repo = getJiraRepository();
    const user = await repo.getUserById(userId);
    if (!user) {
      return { ok: false, error: "Utilisateur introuvable." };
    }
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, user.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
    revalidatePath("/");
    return { ok: true, data: user };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de changer de session.",
    };
  }
}

export async function inviteUserAction(
  actorId: string,
  input: InviteUserInput
): Promise<
  ActionResult<{
    user: User;
    emailDelivery: BrevoInvitationResult;
  }>
> {
  try {
    const admin = await assertIsAdmin(actorId);
    const repo = getJiraRepository();
    const snapshot = await repo.getSnapshot();
    const invited = await repo.inviteUser(actorId, input);
    const emailDelivery = await sendBrevoInvitationEmail({
      recipientName: invited.name,
      recipientEmail: invited.email,
      department: invited.department,
      role: input.role,
      inviterName: admin.name,
      workspaceName: snapshot.workspace.name,
    });
    revalidatePath("/");
    return {
      ok: true,
      data: {
        user: invited,
        emailDelivery,
      },
    };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible d'inviter cet utilisateur.",
    };
  }
}

export async function updateUserRoleAction(
  actorId: string,
  targetUserId: string,
  newRole: UserRole
): Promise<ActionResult<User>> {
  try {
    await assertIsAdmin(actorId);
    const repo = getJiraRepository();
    const updated = await repo.updateUserRole(actorId, targetUserId, newRole);
    revalidatePath("/");
    return { ok: true, data: updated };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de modifier le rôle de cet utilisateur.",
    };
  }
}

export async function fetchWorkspaceSnapshotAction() {
  const repo = getJiraRepository();
  return repo.getSnapshot();
}

export async function createProjectAction(
  input: CreateProjectInput,
  actorId?: string
): Promise<ActionResult<Awaited<ReturnType<ReturnType<typeof getJiraRepository>["createProject"]>>>> {
  try {
    const admin = await assertIsAdmin(actorId);
    const repo = getJiraRepository();
    const project = await repo.createProject(input, admin.id);
    revalidatePath("/");
    return { ok: true, data: project };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Impossible de créer le projet.",
    };
  }
}

export async function deleteProjectAction(
  projectId: string,
  actorId?: string
): Promise<ActionResult<boolean>> {
  try {
    const admin = await assertIsAdmin(actorId);
    const repo = getJiraRepository();
    await repo.deleteProject(projectId, admin.id);
    revalidatePath("/");
    return { ok: true, data: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error ? err.message : "Impossible de supprimer le projet.",
    };
  }
}

export async function createIssueAction(
  input: CreateIssueInput
): Promise<ActionResult<Issue>> {
  try {
    await assertCanEdit(input.reporterId);
    const repo = getJiraRepository();
    const issue = await repo.createIssue(input);
    revalidatePath("/");
    return { ok: true, data: issue };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Impossible de créer le ticket.",
    };
  }
}

export async function updateIssueStatusAction(
  issueId: string,
  newStatus: StatusCategory,
  actorId: string,
  newRank?: string
): Promise<ActionResult<Issue>> {
  try {
    await assertCanEdit(actorId);
    const repo = getJiraRepository();
    const updated = await repo.updateIssueStatus(
      issueId,
      newStatus,
      actorId,
      newRank
    );
    revalidatePath("/");
    return { ok: true, data: updated };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de mettre à jour le statut du ticket.",
    };
  }
}

export async function updateIssueDetailsAction(
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
): Promise<ActionResult<Issue>> {
  try {
    await assertCanEdit(actorId);
    const repo = getJiraRepository();
    const updated = await repo.updateIssueDetails(issueId, patch, actorId);
    revalidatePath("/");
    return { ok: true, data: updated };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de modifier le ticket.",
    };
  }
}

export async function deleteIssueAction(
  issueId: string,
  actorId?: string
): Promise<ActionResult<boolean>> {
  try {
    await assertCanEdit(actorId);
    const repo = getJiraRepository();
    await repo.deleteIssue(issueId);
    revalidatePath("/");
    return { ok: true, data: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de supprimer le ticket.",
    };
  }
}

export async function addCommentAction(
  issueId: string,
  authorId: string,
  body: string
): Promise<ActionResult<Issue>> {
  try {
    const repo = getJiraRepository();
    const updated = await repo.addComment(issueId, authorId, body);
    revalidatePath("/");
    return { ok: true, data: updated };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible d'ajouter le commentaire.",
    };
  }
}

export async function addSubtaskAction(
  issueId: string,
  title: string
): Promise<ActionResult<Issue>> {
  try {
    const repo = getJiraRepository();
    const updated = await repo.addSubtask(issueId, title);
    revalidatePath("/");
    return { ok: true, data: updated };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible d'ajouter la sous-tâche.",
    };
  }
}

export async function toggleSubtaskAction(
  issueId: string,
  subtaskId: string
): Promise<ActionResult<Issue>> {
  try {
    const repo = getJiraRepository();
    const updated = await repo.toggleSubtask(issueId, subtaskId);
    revalidatePath("/");
    return { ok: true, data: updated };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de modifier la sous-tâche.",
    };
  }
}

export async function addRelationAction(
  sourceIssueId: string,
  targetIssueId: string,
  type: RelationType
): Promise<ActionResult<Issue>> {
  try {
    const repo = getJiraRepository();
    const updated = await repo.addRelation(sourceIssueId, targetIssueId, type);
    revalidatePath("/");
    return { ok: true, data: updated };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de lier ces deux tickets.",
    };
  }
}

export async function addIssueAttachmentAction(
  issueId: string,
  actorId: string,
  input: AttachIssueImageInput
): Promise<ActionResult<Issue>> {
  try {
    const actor = await resolveActor(actorId);
    if (!actor || !canAttachImageToIssue(actor.role)) {
      throw new Error(
        "Vous devez être authentifié (Visiteur, Éditeur ou Administrateur) pour ajouter une image sur ce ticket."
      );
    }
    const repo = getJiraRepository();
    const updated = await repo.addIssueAttachment(issueId, actor.id, input);
    revalidatePath("/");
    return { ok: true, data: updated };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible d'ajouter l'image WebP au ticket.",
    };
  }
}

export async function removeIssueAttachmentAction(
  issueId: string,
  attachmentId: string,
  actorId: string
): Promise<ActionResult<Issue>> {
  try {
    const repo = getJiraRepository();
    const updated = await repo.removeIssueAttachment(
      issueId,
      attachmentId,
      actorId
    );
    revalidatePath("/");
    return { ok: true, data: updated };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de retirer cette image.",
    };
  }
}

export async function createSprintAction(
  input: CreateSprintInput,
  actorId?: string
): Promise<ActionResult<Awaited<ReturnType<ReturnType<typeof getJiraRepository>["createSprint"]>>>> {
  try {
    await assertCanEdit(actorId);
    const repo = getJiraRepository();
    const sprint = await repo.createSprint(input);
    revalidatePath("/");
    return { ok: true, data: sprint };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error ? err.message : "Impossible de créer le sprint.",
    };
  }
}

export async function updateSprintAction(
  sprintId: string,
  patch: Partial<Pick<Sprint, "name" | "goal" | "startDate" | "endDate">>,
  actorId?: string
): Promise<ActionResult<Sprint>> {
  try {
    await assertCanEdit(actorId);
    const repo = getJiraRepository();
    const sprint = await repo.updateSprint(sprintId, patch);
    revalidatePath("/");
    return { ok: true, data: sprint };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de modifier le sprint.",
    };
  }
}

export async function startSprintAction(
  sprintId: string,
  actorId?: string
): Promise<ActionResult<Awaited<ReturnType<ReturnType<typeof getJiraRepository>["startSprint"]>>>> {
  try {
    await assertCanEdit(actorId);
    const repo = getJiraRepository();
    const sprint = await repo.startSprint(sprintId);
    revalidatePath("/");
    return { ok: true, data: sprint };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de démarrer le sprint.",
    };
  }
}

export async function completeSprintAction(
  sprintId: string,
  moveUnfinishedToSprintId: string | null,
  actorId?: string
): Promise<ActionResult<Awaited<ReturnType<ReturnType<typeof getJiraRepository>["completeSprint"]>>>> {
  try {
    await assertCanEdit(actorId);
    const repo = getJiraRepository();
    const sprint = await repo.completeSprint(
      sprintId,
      moveUnfinishedToSprintId
    );
    revalidatePath("/");
    return { ok: true, data: sprint };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de clôturer le sprint.",
    };
  }
}

export async function updateProjectWipLimitsAction(
  projectId: string,
  wipLimits: Record<StatusCategory, number>,
  actorId?: string
) {
  try {
    await assertCanEdit(actorId);
    const repo = getJiraRepository();
    const project = await repo.updateProjectWipLimits(projectId, wipLimits);
    revalidatePath("/");
    return { ok: true as const, data: project };
  } catch (err) {
    return {
      ok: false as const,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de mettre à jour les limites WIP.",
    };
  }
}

export async function renameProjectColumnAction(
  projectId: string,
  columnId: StatusCategory,
  newLabel: string,
  actorId?: string
) {
  try {
    await assertCanEdit(actorId);
    const repo = getJiraRepository();
    const project = await repo.renameProjectColumn(
      projectId,
      columnId,
      newLabel
    );
    revalidatePath("/");
    return { ok: true as const, data: project };
  } catch (err) {
    return {
      ok: false as const,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de renommer la catégorie.",
    };
  }
}

export async function addProjectColumnAction(
  projectId: string,
  label: string,
  colorVariant?:
    | "neutral"
    | "info"
    | "warning"
    | "success"
    | "secondary"
    | "primary"
    | "accent",
  wipLimit?: number,
  actorId?: string
) {
  try {
    await assertCanEdit(actorId);
    const repo = getJiraRepository();
    const project = await repo.addProjectColumn(
      projectId,
      label,
      colorVariant,
      wipLimit
    );
    revalidatePath("/");
    return { ok: true as const, data: project };
  } catch (err) {
    return {
      ok: false as const,
      error:
        err instanceof Error
          ? err.message
          : "Impossible d'ajouter la catégorie.",
    };
  }
}

export async function deleteProjectColumnAction(
  projectId: string,
  columnId: StatusCategory,
  actorId?: string
) {
  try {
    await assertCanEdit(actorId);
    const repo = getJiraRepository();
    const project = await repo.deleteProjectColumn(projectId, columnId);
    revalidatePath("/");
    return { ok: true as const, data: project };
  } catch (err) {
    return {
      ok: false as const,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de supprimer la catégorie.",
    };
  }
}

export async function createGanttItemAction(
  input: CreateGanttItemInput,
  actorId?: string
) {
  try {
    await assertCanEdit(actorId);
    const repo = getJiraRepository();
    const res = await repo.createGanttItem(input);
    revalidatePath("/");
    return { ok: true as const, data: res };
  } catch (err) {
    return {
      ok: false as const,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de créer l'étape du diagramme de Gantt.",
    };
  }
}

export async function updateGanttItemAction(
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
  >,
  actorId?: string
) {
  try {
    await assertCanEdit(actorId);
    const repo = getJiraRepository();
    const updated = await repo.updateGanttItem(ganttId, patch);
    revalidatePath("/");
    return { ok: true as const, data: updated };
  } catch (err) {
    return {
      ok: false as const,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de mettre à jour l'étape Gantt.",
    };
  }
}

export async function deleteGanttItemAction(
  ganttId: string,
  actorId?: string
) {
  try {
    await assertCanEdit(actorId);
    const repo = getJiraRepository();
    await repo.deleteGanttItem(ganttId);
    revalidatePath("/");
    return { ok: true as const, data: true };
  } catch (err) {
    return {
      ok: false as const,
      error:
        err instanceof Error
          ? err.message
          : "Impossible de supprimer l'étape Gantt.",
    };
  }
}

export async function updateUserThemeAction(
  userId: string,
  theme: ThemeName
) {
  try {
    const repo = getJiraRepository();
    const user = await repo.updateUserTheme(userId, theme);
    revalidatePath("/");
    return { ok: true as const, data: user };
  } catch (err) {
    return {
      ok: false as const,
      error:
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer le thème.",
    };
  }
}

import { z } from "zod";

export const SUPPORTED_THEMES = [
  "light",
  "dark",
  "corporate",
  "business",
  "nord",
  "dim",
  "emerald",
  "synthwave",
] as const;

export const ThemeSchema = z.enum(SUPPORTED_THEMES);
export type ThemeName = z.infer<typeof ThemeSchema>;

export const ISSUE_TYPES = ["EPIC", "STORY", "TASK", "BUG", "SUBTASK"] as const;
export const IssueTypeSchema = z.enum(ISSUE_TYPES);
export type IssueType = z.infer<typeof IssueTypeSchema>;

export const ISSUE_PRIORITIES = [
  "LOWEST",
  "LOW",
  "MEDIUM",
  "HIGH",
  "HIGHEST",
  "BLOCKER",
] as const;
export const IssuePrioritySchema = z.enum(ISSUE_PRIORITIES);
export type IssuePriority = z.infer<typeof IssuePrioritySchema>;

export const STATUS_CATEGORIES = [
  "TODO",
  "IN_PROGRESS",
  "IN_REVIEW",
  "DONE",
] as const;
export const StatusCategorySchema = z
  .string()
  .min(1, "La catégorie est requise")
  .max(40, "Identifiant de catégorie trop long");
export type StatusCategory = z.infer<typeof StatusCategorySchema>;

export const SPRINT_STATUSES = ["FUTURE", "ACTIVE", "CLOSED"] as const;
export const SprintStatusSchema = z.enum(SPRINT_STATUSES);
export type SprintStatus = z.infer<typeof SprintStatusSchema>;

export const RELATION_TYPES = [
  "BLOCKS",
  "IS_BLOCKED_BY",
  "RELATES_TO",
  "DUPLICATES",
] as const;
export const RelationTypeSchema = z.enum(RELATION_TYPES);
export type RelationType = z.infer<typeof RelationTypeSchema>;

export const USER_ROLES = ["ADMIN", "EDITOR", "VIEWER"] as const;
export const UserRoleSchema = z.enum(USER_ROLES);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const INVITABLE_USER_ROLES = ["EDITOR", "VIEWER"] as const;
export const InvitableUserRoleSchema = z.enum(INVITABLE_USER_ROLES);
export type InvitableUserRole = z.infer<typeof InvitableUserRoleSchema>;

export const InviteUserInputSchema = z.object({
  name: z
    .string()
    .min(2, "Veuillez saisir le nom complet (min. 2 caractères)")
    .max(60, "Le nom ne peut pas dépasser 60 caractères"),
  email: z
    .string()
    .email("Veuillez saisir une adresse e-mail valide")
    .transform((v) => v.trim().toLowerCase()),
  department: z
    .string()
    .min(2, "Veuillez indiquer l'équipe ou le département")
    .max(60)
    .default("Ingénierie & Produit"),
  role: InvitableUserRoleSchema.default("EDITOR"),
});

export type InviteUserInput = z.infer<typeof InviteUserInputSchema>;

export const LoginInputSchema = z.object({
  email: z
    .string()
    .email("Veuillez saisir une adresse e-mail valide")
    .transform((v) => v.trim().toLowerCase()),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

export const RegisterInputSchema = z.object({
  name: z
    .string()
    .min(2, "Veuillez saisir votre nom complet (min. 2 caractères)")
    .max(60, "Le nom ne peut pas dépasser 60 caractères"),
  email: z
    .string()
    .email("Veuillez saisir une adresse e-mail valide")
    .transform((v) => v.trim().toLowerCase()),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  department: z
    .string()
    .min(2, "Veuillez indiquer votre équipe ou département")
    .max(60)
    .default("Ingénierie Produit"),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const CreateProjectInputSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom du projet doit comporter au moins 2 caractères")
    .max(60, "Le nom du projet ne peut pas dépasser 60 caractères"),
  key: z
    .string()
    .min(2, "La clé doit comporter entre 2 et 8 lettres majuscules")
    .max(8, "La clé ne peut pas dépasser 8 caractères")
    .regex(/^[A-Z][A-Z0-9]+$/, "La clé doit être en majuscules (ex: PAY, APP)"),
  description: z.string().max(400).optional().default(""),
  leadId: z.string().min(1, "Veuillez sélectionner un responsable de projet"),
});

export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;

export const CreateIssueInputSchema = z.object({
  projectId: z.string().min(1, "Le projet est requis"),
  title: z
    .string()
    .min(3, "Le titre du ticket doit contenir au moins 3 caractères")
    .max(160, "Le titre ne peut pas dépasser 160 caractères"),
  description: z.string().optional().default(""),
  type: IssueTypeSchema,
  status: StatusCategorySchema.default("TODO"),
  priority: IssuePrioritySchema.default("MEDIUM"),
  storyPoints: z.number().min(0).max(100).optional().default(3),
  assigneeId: z.string().optional().nullable(),
  reporterId: z.string().min(1),
  sprintId: z.string().optional().nullable(),
  epicId: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
  labels: z.array(z.string()).optional().default([]),
  timeEstimatedHours: z.number().min(0).optional().default(4),
});

export type CreateIssueInput = z.infer<typeof CreateIssueInputSchema>;

export const CreateSprintInputSchema = z.object({
  projectId: z.string().min(1, "Le projet est requis"),
  name: z.string().min(3, "Le nom du sprint est requis").max(80),
  goal: z.string().min(3, "L'objectif du sprint est requis").max(300),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
});

export type CreateSprintInput = z.infer<typeof CreateSprintInputSchema>;

export const GANTT_ITEM_TYPES = [
  "EPIC",
  "MILESTONE",
  "EXTERNAL_DEPENDENCY",
  "TASK",
] as const;
export const GanttItemTypeSchema = z.enum(GANTT_ITEM_TYPES);
export type GanttItemType = z.infer<typeof GanttItemTypeSchema>;

export const GANTT_DEPENDENCY_TYPES = ["FS", "SS", "FF", "SF"] as const;
export const GanttDependencyTypeSchema = z.enum(GANTT_DEPENDENCY_TYPES);
export type GanttDependencyType = z.infer<typeof GanttDependencyTypeSchema>;

export const EXTERNAL_DEPENDENCY_CATEGORIES = [
  "MARKETING",
  "MATERIEL",
  "JURIDIQUE",
  "FOURNISSEUR",
  "INFRASTRUCTURE",
] as const;
export const ExternalDependencyCategorySchema = z.enum(
  EXTERNAL_DEPENDENCY_CATEGORIES
);
export type ExternalDependencyCategory = z.infer<
  typeof ExternalDependencyCategorySchema
>;

export const CreateGanttItemInputSchema = z.object({
  projectId: z.string().min(1, "Le projet est requis"),
  wbsCode: z.string().min(1, "Le code WBS est requis").max(16),
  title: z
    .string()
    .min(3, "L'intitulé de l'étape Gantt doit contenir au moins 3 caractères")
    .max(140),
  type: GanttItemTypeSchema,
  externalCategory: ExternalDependencyCategorySchema.optional().nullable(),
  externalProvider: z.string().max(80).optional().default(""),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
  progress: z.number().min(0).max(100).optional().default(0),
  ownerId: z.string().optional().nullable(),
  predecessorId: z.string().optional().nullable(),
  dependencyType: GanttDependencyTypeSchema.optional().default("FS"),
  isCritical: z.boolean().optional().default(false),
  autoCreateEpicIssue: z.boolean().optional().default(true),
});

export type CreateGanttItemInput = z.infer<typeof CreateGanttItemInputSchema>;

export const AttachIssueImageInputSchema = z.object({
  name: z
    .string()
    .min(1, "Le nom du fichier est requis")
    .max(140)
    .refine((val) => val.toLowerCase().endsWith(".webp"), {
      message: "Le fichier image doit être converti avec l'extension .webp",
    }),
  originalFormat: z.enum(["JPG", "PNG", "WEBP"]),
  mimeType: z.literal("image/webp"),
  dataUrl: z
    .string()
    .min(20, "Les données de l'image sont invalides")
    .refine((val) => val.startsWith("data:image/webp;base64,"), {
      message:
        "L'image doit être convertie au format WebP (data:image/webp;base64,...)",
    }),
  width: z.number().int().min(1).max(8000),
  height: z.number().int().min(1).max(8000),
  originalSizeBytes: z.number().int().min(1),
  webpSizeBytes: z.number().int().min(1),
});

export type AttachIssueImageInput = z.infer<typeof AttachIssueImageInputSchema>;

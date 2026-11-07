import type {
  ExternalDependencyCategory,
  GanttDependencyType,
  GanttItemType,
  IssuePriority,
  IssueType,
  RelationType,
  SprintStatus,
  StatusCategory,
  ThemeName,
  UserRole,
} from "@/lib/validations/jira-schema";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  department: string;
  themePreference: ThemeName;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface BoardColumn {
  id: StatusCategory;
  label: string;
  badgeClass: string;
  dotClass: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  key: string;
  name: string;
  description: string;
  leadId: string;
  issueCounter: number;
  wipLimits: Record<StatusCategory, number>;
  columns?: BoardColumn[];
  createdAt: string;
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
  status: SprintStatus;
  committedPoints: number;
  completedPoints: number;
}

export interface SubtaskItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface IssueComment {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface IssueActivity {
  id: string;
  actorId: string;
  action: string;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

export interface IssueRelation {
  id: string;
  targetIssueId: string;
  targetIssueKey: string;
  type: RelationType;
}

export interface IssueImageAttachment {
  id: string;
  name: string;
  originalFormat: "JPG" | "PNG" | "WEBP";
  mimeType: "image/webp";
  dataUrl: string;
  width: number;
  height: number;
  originalSizeBytes: number;
  webpSizeBytes: number;
  uploadedById: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  projectId: string;
  key: string;
  title: string;
  description: string;
  type: IssueType;
  status: StatusCategory;
  priority: IssuePriority;
  storyPoints: number;
  assigneeId: string | null;
  reporterId: string;
  sprintId: string | null;
  epicId: string | null;
  parentId: string | null;
  labels: string[];
  subtasks: SubtaskItem[];
  comments: IssueComment[];
  activities: IssueActivity[];
  relations: IssueRelation[];
  attachments?: IssueImageAttachment[];
  timeEstimatedHours: number;
  timeLoggedHours: number;
  rank: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GraphNode {
  id: string;
  key: string;
  label: string;
  type: "PROJECT" | IssueType;
  statusCategory: StatusCategory;
  priority: IssuePriority | "NONE";
  projectId: string;
  storyPoints: number;
  degree: number;
  radius: number;
  colorToken: "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error";
}

export interface GraphLink {
  id: string;
  source: string;
  target: string;
  type: "BELONGS_TO_PROJECT" | "BELONGS_TO_EPIC" | "PARENT_OF" | RelationType;
  colorToken: "base-300" | "primary" | "secondary" | "error" | "warning";
  dashed: boolean;
}

export interface GraphPayload {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface GanttDependencyLink {
  predecessorId: string;
  type: GanttDependencyType; // FS (Fin-Début), SS (Début-Début), FF (Fin-Fin), SF (Début-Fin)
}

export interface GanttItem {
  id: string;
  projectId: string;
  wbsCode: string;
  title: string;
  type: GanttItemType; // EPIC | MILESTONE | EXTERNAL_DEPENDENCY | TASK
  externalCategory?: ExternalDependencyCategory | null;
  externalProvider?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  progress: number; // 0..100
  ownerId: string | null;
  linkedIssueId: string | null; // Synchronisé avec l'Epic / Ticket correspondant
  dependencies: GanttDependencyLink[];
  isCritical: boolean;
}

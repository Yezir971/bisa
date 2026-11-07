import {
  pgTable,
  text,
  integer,
  timestamp,
  jsonb,
  real,
} from "drizzle-orm/pg-core";

export const workspacesTable = pgTable("workspaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(),
  avatarInitials: text("avatar_initials").notNull(),
  department: text("department").notNull(),
  themePreference: text("theme_preference").default("light").notNull(),
});

export const projectsTable = pgTable("projects", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspacesTable.id, { onDelete: "cascade" }),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  leadId: text("lead_id").notNull(),
  issueCounter: integer("issue_counter").default(0).notNull(),
  wipLimits: jsonb("wip_limits").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sprintsTable = pgTable("sprints", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  goal: text("goal").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: text("status").notNull(),
  committedPoints: real("committed_points").default(0).notNull(),
  completedPoints: real("completed_points").default(0).notNull(),
});

export const issuesTable = pgTable("issues", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projectsTable.id, { onDelete: "cascade" }),
  key: text("key").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  storyPoints: real("story_points").default(0).notNull(),
  assigneeId: text("assignee_id"),
  reporterId: text("reporter_id").notNull(),
  sprintId: text("sprint_id"),
  epicId: text("epic_id"),
  parentId: text("parent_id"),
  labels: jsonb("labels").default([]).notNull(),
  subtasks: jsonb("subtasks").default([]).notNull(),
  comments: jsonb("comments").default([]).notNull(),
  activities: jsonb("activities").default([]).notNull(),
  relations: jsonb("relations").default([]).notNull(),
  timeEstimatedHours: real("time_estimated_hours").default(0).notNull(),
  timeLoggedHours: real("time_logged_hours").default(0).notNull(),
  rank: text("rank").notNull(),
  dueDate: text("due_date"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

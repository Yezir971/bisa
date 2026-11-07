import { describe, it, expect } from "vitest";
import { computeDashboardAnalytics } from "./analytics-engine";
import type { Issue, Sprint, User } from "@/domain/entities";

const mockUsers: User[] = [
  {
    id: "usr-1",
    name: "Camille Laurent",
    email: "camille@bisa.io",
    role: "ADMIN",
    avatarInitials: "CL",
    department: "Architecture",
    themePreference: "light",
  },
];

const mockSprints: Sprint[] = [
  {
    id: "sp-1",
    projectId: "proj-1",
    name: "Sprint 10 - Core Engine",
    goal: "Stabiliser le socle",
    startDate: "2026-10-01",
    endDate: "2026-10-14",
    status: "CLOSED",
    committedPoints: 34,
    completedPoints: 32,
  },
  {
    id: "sp-2",
    projectId: "proj-1",
    name: "Sprint 11 - Graph 3D",
    goal: "Livrer le globe Obsidian",
    startDate: "2026-10-15",
    endDate: "2026-10-28",
    status: "ACTIVE",
    committedPoints: 40,
    completedPoints: 24,
  },
];

const mockIssues: Issue[] = [
  {
    id: "iss-1",
    projectId: "proj-1",
    key: "CORE-1",
    title: "Tâche terminée",
    description: "",
    type: "STORY",
    status: "DONE",
    priority: "HIGH",
    storyPoints: 8,
    assigneeId: "usr-1",
    reporterId: "usr-1",
    sprintId: "sp-2",
    epicId: null,
    parentId: null,
    labels: [],
    subtasks: [],
    comments: [],
    activities: [],
    relations: [],
    timeEstimatedHours: 10,
    timeLoggedHours: 10,
    rank: "001",
    dueDate: null,
    createdAt: "2026-10-15",
    updatedAt: "2026-10-20",
  },
  {
    id: "iss-2",
    projectId: "proj-1",
    key: "CORE-2",
    title: "Bug en cours",
    description: "",
    type: "BUG",
    status: "IN_PROGRESS",
    priority: "BLOCKER",
    storyPoints: 5,
    assigneeId: "usr-1",
    reporterId: "usr-1",
    sprintId: "sp-2",
    epicId: null,
    parentId: null,
    labels: [],
    subtasks: [],
    comments: [],
    activities: [],
    relations: [],
    timeEstimatedHours: 6,
    timeLoggedHours: 3,
    rank: "002",
    dueDate: null,
    createdAt: "2026-10-16",
    updatedAt: "2026-10-21",
  },
];

describe("AnalyticsEngine Service (daisyui-charts Data Generator - TDD)", () => {
  it("calcule les KPI, le Burndown, la Vélocité et la Répartition par statut", () => {
    const analytics = computeDashboardAnalytics(
      mockIssues,
      mockSprints,
      mockUsers
    );

    expect(analytics.kpis.totalIssues).toBe(2);
    expect(analytics.kpis.totalPoints).toBe(13);
    expect(analytics.kpis.completedPoints).toBe(8);
    expect(analytics.kpis.completionRate).toBe(62);

    expect(analytics.burndown.labels.length).toBe(10);
    expect(analytics.burndown.ideal[0]).toBeGreaterThan(0);
    expect(
      analytics.burndown.ideal[analytics.burndown.ideal.length - 1]
    ).toBe(0);

    expect(analytics.velocity.labels).toHaveLength(2);
    expect(analytics.statusDistribution.DONE).toBe(1);
    expect(analytics.statusDistribution.IN_PROGRESS).toBe(1);
    expect(analytics.teamWorkload[0].assignedPoints).toBe(13);
  });
});

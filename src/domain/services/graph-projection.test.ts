import { describe, it, expect } from "vitest";
import { projectKnowledgeGraph } from "./graph-projection";
import type { Issue, Project } from "@/domain/entities";

const mockProjects: Project[] = [
  {
    id: "proj-1",
    workspaceId: "ws-1",
    key: "CORE",
    name: "Core Platform",
    description: "Socle cloud",
    leadId: "usr-1",
    issueCounter: 3,
    wipLimits: { TODO: 10, IN_PROGRESS: 4, IN_REVIEW: 3, DONE: 50 },
    createdAt: "2026-10-01T10:00:00Z",
  },
];

const mockIssues: Issue[] = [
  {
    id: "iss-1",
    projectId: "proj-1",
    key: "CORE-1",
    title: "Architecture Graph 3D",
    description: "Epic global",
    type: "EPIC",
    status: "IN_PROGRESS",
    priority: "HIGH",
    storyPoints: 13,
    assigneeId: "usr-1",
    reporterId: "usr-1",
    sprintId: "sp-1",
    epicId: null,
    parentId: null,
    labels: ["architecture"],
    subtasks: [],
    comments: [],
    activities: [],
    relations: [],
    timeEstimatedHours: 20,
    timeLoggedHours: 8,
    rank: "000000101000",
    dueDate: null,
    createdAt: "2026-10-02T10:00:00Z",
    updatedAt: "2026-10-02T10:00:00Z",
  },
  {
    id: "iss-2",
    projectId: "proj-1",
    key: "CORE-2",
    title: "Corriger fuite WebGL",
    description: "Bug critique",
    type: "BUG",
    status: "TODO",
    priority: "BLOCKER",
    storyPoints: 5,
    assigneeId: "usr-1",
    reporterId: "usr-1",
    sprintId: "sp-1",
    epicId: "iss-1",
    parentId: null,
    labels: ["webgl"],
    subtasks: [],
    comments: [],
    activities: [],
    relations: [
      {
        id: "rel-1",
        targetIssueId: "iss-1",
        targetIssueKey: "CORE-1",
        type: "BLOCKS",
      },
    ],
    timeEstimatedHours: 6,
    timeLoggedHours: 2,
    rank: "000000102000",
    dueDate: null,
    createdAt: "2026-10-03T10:00:00Z",
    updatedAt: "2026-10-03T10:00:00Z",
  },
];

describe("GraphProjectionService (Obsidian Graph & 3D Globe - TDD)", () => {
  it("projette les projets, epics, bugs et leurs liens hiérarchiques et bloquants", () => {
    const graph = projectKnowledgeGraph(mockProjects, mockIssues);

    expect(graph.nodes).toHaveLength(3);

    const projNode = graph.nodes.find((n) => n.id === "proj-1");
    const epicNode = graph.nodes.find((n) => n.id === "iss-1");
    const bugNode = graph.nodes.find((n) => n.id === "iss-2");

    expect(projNode?.colorToken).toBe("primary");
    expect(epicNode?.colorToken).toBe("secondary");
    expect(bugNode?.colorToken).toBe("error");

    const blockingLink = graph.links.find((l) => l.type === "BLOCKS");
    expect(blockingLink).toBeDefined();
    expect(blockingLink?.dashed).toBe(true);
    expect(blockingLink?.colorToken).toBe("error");
  });

  it("filtre correctement les tickets terminés lorsque hideCompleted est actif", () => {
    const issuesWithDone: Issue[] = [
      ...mockIssues,
      {
        ...mockIssues[1],
        id: "iss-3",
        key: "CORE-3",
        status: "DONE",
        relations: [],
      },
    ];

    const filtered = projectKnowledgeGraph(mockProjects, issuesWithDone, {
      hideCompleted: true,
    });

    expect(filtered.nodes.find((n) => n.id === "iss-3")).toBeUndefined();
    expect(filtered.nodes).toHaveLength(3);
  });
});

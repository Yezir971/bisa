import type {
  GraphLink,
  GraphNode,
  GraphPayload,
  Issue,
  Project,
} from "@/domain/entities";

export interface GraphProjectionOptions {
  projectIdFilter?: string | "ALL";
  hideCompleted?: boolean;
  onlyBlockingLinks?: boolean;
  searchQuery?: string;
}

function resolveNodeColorToken(
  issue: Issue
): GraphNode["colorToken"] {
  if (issue.status === "DONE") return "success";
  switch (issue.type) {
    case "EPIC":
      return "secondary";
    case "BUG":
      return "error";
    case "STORY":
      return "info";
    case "TASK":
      return "accent";
    case "SUBTASK":
      return "warning";
    default:
      return "info";
  }
}

function resolveBaseRadius(type: GraphNode["type"], storyPoints: number): number {
  const pointsBonus = Math.min(8, Math.sqrt(Math.max(1, storyPoints)) * 1.8);
  switch (type) {
    case "PROJECT":
      return 24;
    case "EPIC":
      return 16 + pointsBonus * 0.5;
    case "BUG":
      return 11 + pointsBonus * 0.5;
    case "STORY":
    case "TASK":
      return 10 + pointsBonus * 0.5;
    case "SUBTASK":
      return 8;
  }
}

export function projectKnowledgeGraph(
  projects: Project[],
  issues: Issue[],
  options: GraphProjectionOptions = {}
): GraphPayload {
  const {
    projectIdFilter = "ALL",
    hideCompleted = false,
    onlyBlockingLinks = false,
    searchQuery = "",
  } = options;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const activeProjects =
    projectIdFilter === "ALL"
      ? projects
      : projects.filter((p) => p.id === projectIdFilter);

  const activeProjectIds = new Set(activeProjects.map((p) => p.id));

  const filteredIssues = issues.filter((issue) => {
    if (!activeProjectIds.has(issue.projectId)) return false;
    if (hideCompleted && issue.status === "DONE") return false;
    if (normalizedQuery) {
      const matchKey = issue.key.toLowerCase().includes(normalizedQuery);
      const matchTitle = issue.title.toLowerCase().includes(normalizedQuery);
      const matchLabel = issue.labels.some((l) =>
        l.toLowerCase().includes(normalizedQuery)
      );
      if (!matchKey && !matchTitle && !matchLabel) return false;
    }
    return true;
  });

  const nodesMap = new Map<string, GraphNode>();

  for (const proj of activeProjects) {
    nodesMap.set(proj.id, {
      id: proj.id,
      key: proj.key,
      label: proj.name,
      type: "PROJECT",
      statusCategory: "IN_PROGRESS",
      priority: "NONE",
      projectId: proj.id,
      storyPoints: 0,
      degree: 0,
      radius: resolveBaseRadius("PROJECT", 0),
      colorToken: "primary",
    });
  }

  for (const issue of filteredIssues) {
    nodesMap.set(issue.id, {
      id: issue.id,
      key: issue.key,
      label: issue.title,
      type: issue.type,
      statusCategory: issue.status,
      priority: issue.priority,
      projectId: issue.projectId,
      storyPoints: issue.storyPoints,
      degree: 0,
      radius: resolveBaseRadius(issue.type, issue.storyPoints),
      colorToken: resolveNodeColorToken(issue),
    });
  }

  const links: GraphLink[] = [];

  for (const issue of filteredIssues) {
    if (!onlyBlockingLinks) {
      if (
        issue.parentId &&
        nodesMap.has(issue.parentId)
      ) {
        links.push({
          id: `link-parent-${issue.parentId}-${issue.id}`,
          source: issue.parentId,
          target: issue.id,
          type: "PARENT_OF",
          colorToken: "base-300",
          dashed: false,
        });
      } else if (
        issue.epicId &&
        nodesMap.has(issue.epicId) &&
        issue.epicId !== issue.id
      ) {
        links.push({
          id: `link-epic-${issue.epicId}-${issue.id}`,
          source: issue.epicId,
          target: issue.id,
          type: "BELONGS_TO_EPIC",
          colorToken: "secondary",
          dashed: false,
        });
      } else if (nodesMap.has(issue.projectId)) {
        links.push({
          id: `link-proj-${issue.projectId}-${issue.id}`,
          source: issue.projectId,
          target: issue.id,
          type: "BELONGS_TO_PROJECT",
          colorToken: "primary",
          dashed: false,
        });
      }
    }

    for (const rel of issue.relations) {
      if (!nodesMap.has(rel.targetIssueId)) continue;
      if (onlyBlockingLinks && rel.type !== "BLOCKS" && rel.type !== "IS_BLOCKED_BY") {
        continue;
      }
      const isBlocking = rel.type === "BLOCKS" || rel.type === "IS_BLOCKED_BY";
      links.push({
        id: `link-rel-${issue.id}-${rel.targetIssueId}-${rel.type}`,
        source: issue.id,
        target: rel.targetIssueId,
        type: rel.type,
        colorToken: isBlocking ? "error" : "warning",
        dashed: true,
      });
    }
  }

  for (const link of links) {
    const srcNode = nodesMap.get(link.source);
    const tgtNode = nodesMap.get(link.target);
    if (srcNode) srcNode.degree += 1;
    if (tgtNode) tgtNode.degree += 1;
  }

  return {
    nodes: Array.from(nodesMap.values()),
    links,
  };
}

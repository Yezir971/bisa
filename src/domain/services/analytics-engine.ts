import type { Issue, Sprint, User } from "@/domain/entities";
import type { IssueType, StatusCategory } from "@/lib/validations/jira-schema";

export interface DashboardAnalytics {
  kpis: {
    totalIssues: number;
    completedIssues: number;
    inProgressIssues: number;
    blockerBugs: number;
    totalPoints: number;
    completedPoints: number;
    completionRate: number;
    averageVelocity: number;
  };
  burndown: {
    sprintName: string;
    labels: string[];
    ideal: number[];
    actual: number[];
  };
  velocity: {
    labels: string[];
    committed: number[];
    completed: number[];
  };
  cumulativeFlow: {
    labels: string[];
    done: number[];
    inReview: number[];
    inProgress: number[];
    todo: number[];
  };
  statusDistribution: Record<StatusCategory, number>;
  typeDistribution: Record<IssueType, number>;
  teamWorkload: Array<{
    userId: string;
    userName: string;
    assignedIssues: number;
    assignedPoints: number;
    completedPoints: number;
  }>;
}

export function computeDashboardAnalytics(
  issues: Issue[],
  sprints: Sprint[],
  users: User[]
): DashboardAnalytics {
  const totalIssues = issues.length;
  const completedIssues = issues.filter((i) => i.status === "DONE").length;
  const inProgressIssues = issues.filter(
    (i) => i.status === "IN_PROGRESS" || i.status === "IN_REVIEW"
  ).length;
  const blockerBugs = issues.filter(
    (i) =>
      i.type === "BUG" &&
      (i.priority === "BLOCKER" || i.priority === "HIGHEST") &&
      i.status !== "DONE"
  ).length;

  const totalPoints = issues.reduce((acc, i) => acc + i.storyPoints, 0);
  const completedPoints = issues
    .filter((i) => i.status === "DONE")
    .reduce((acc, i) => acc + i.storyPoints, 0);

  const completionRate =
    totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;

  const activeSprint =
    sprints.find((s) => s.status === "ACTIVE") || sprints[sprints.length - 1];

  const sprintIssues = activeSprint
    ? issues.filter((i) => i.sprintId === activeSprint.id)
    : issues;

  const sprintTotalPoints = Math.max(
    20,
    sprintIssues.reduce((acc, i) => acc + i.storyPoints, 0) || totalPoints || 40
  );
  const sprintDonePoints = sprintIssues
    .filter((i) => i.status === "DONE")
    .reduce((acc, i) => acc + i.storyPoints, 0);

  const burndownDays = [
    "J1",
    "J2",
    "J3",
    "J4",
    "J5",
    "J6",
    "J7",
    "J8",
    "J9",
    "J10",
  ];
  const ideal = burndownDays.map((_, idx) =>
    Math.round(
      sprintTotalPoints * (1 - idx / (burndownDays.length - 1)) * 10
    ) / 10
  );

  const currentRemaining = Math.max(0, sprintTotalPoints - sprintDonePoints);
  const actual = burndownDays.map((_, idx) => {
    const progressRatio = idx / (burndownDays.length - 1);
    const burned = Math.round(
      sprintDonePoints * Math.pow(progressRatio, 0.85)
    );
    return Math.max(currentRemaining, sprintTotalPoints - burned);
  });

  const velocityLabels = sprints.map((s) =>
    s.name.replace(/ - .*$/, "")
  );
  const committed = sprints.map((s) => s.committedPoints);
  const completed = sprints.map((s) =>
    s.status === "ACTIVE" ? Math.max(s.completedPoints, sprintDonePoints) : s.completedPoints
  );

  const averageVelocity =
    completed.length > 0
      ? Math.round(
          completed.reduce((a, b) => a + b, 0) / completed.length
        )
      : 0;

  const statusDistribution: Record<StatusCategory, number> = {
    TODO: 0,
    IN_PROGRESS: 0,
    IN_REVIEW: 0,
    DONE: 0,
  };
  const typeDistribution: Record<IssueType, number> = {
    EPIC: 0,
    STORY: 0,
    TASK: 0,
    BUG: 0,
    SUBTASK: 0,
  };

  for (const issue of issues) {
    statusDistribution[issue.status] =
      (statusDistribution[issue.status] || 0) + 1;
    typeDistribution[issue.type] = (typeDistribution[issue.type] || 0) + 1;
  }

  const cfdLabels = ["Sem -5", "Sem -4", "Sem -3", "Sem -2", "Sem -1", "Actuel"];
  const cumulativeFlow = {
    labels: cfdLabels,
    done: [
      Math.max(1, Math.round(statusDistribution.DONE * 0.25)),
      Math.max(2, Math.round(statusDistribution.DONE * 0.4)),
      Math.max(3, Math.round(statusDistribution.DONE * 0.55)),
      Math.max(4, Math.round(statusDistribution.DONE * 0.75)),
      Math.max(5, Math.round(statusDistribution.DONE * 0.9)),
      statusDistribution.DONE,
    ],
    inReview: [1, 2, 2, 3, 2, statusDistribution.IN_REVIEW],
    inProgress: [2, 3, 4, 3, 4, statusDistribution.IN_PROGRESS],
    todo: [
      statusDistribution.TODO + 5,
      statusDistribution.TODO + 4,
      statusDistribution.TODO + 3,
      statusDistribution.TODO + 2,
      statusDistribution.TODO + 1,
      statusDistribution.TODO,
    ],
  };

  const teamWorkload = users.map((user) => {
    const userIssues = issues.filter((i) => i.assigneeId === user.id);
    const assignedPoints = userIssues.reduce((a, i) => a + i.storyPoints, 0);
    const userCompletedPoints = userIssues
      .filter((i) => i.status === "DONE")
      .reduce((a, i) => a + i.storyPoints, 0);

    return {
      userId: user.id,
      userName: user.name,
      assignedIssues: userIssues.length,
      assignedPoints,
      completedPoints: userCompletedPoints,
    };
  });

  return {
    kpis: {
      totalIssues,
      completedIssues,
      inProgressIssues,
      blockerBugs,
      totalPoints,
      completedPoints,
      completionRate,
      averageVelocity,
    },
    burndown: {
      sprintName: activeSprint ? activeSprint.name : "Sprint Actif",
      labels: burndownDays,
      ideal,
      actual,
    },
    velocity: {
      labels: velocityLabels,
      committed,
      completed,
    },
    cumulativeFlow,
    statusDistribution,
    typeDistribution,
    teamWorkload,
  };
}

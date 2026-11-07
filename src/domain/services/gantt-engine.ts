import type { GanttItem, Issue } from "@/domain/entities";

export interface PositionedGanttItem extends GanttItem {
  durationDays: number;
  leftPercent: number;
  widthPercent: number;
  effectiveProgress: number;
}

export interface GanttWeekBucket {
  label: string;
  startDate: string;
  leftPercent: number;
  widthPercent: number;
}

export interface GanttTimelineProjection {
  minDate: string;
  maxDate: string;
  totalDays: number;
  todayPercent: number;
  weeks: GanttWeekBucket[];
  items: PositionedGanttItem[];
  summary: {
    epicsCount: number;
    milestonesCount: number;
    externalDepsCount: number;
    criticalCount: number;
    overallProgress: number;
  };
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function parseDateUTC(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return Date.UTC(2026, 10, 1);
  return Date.UTC(y, m - 1, d);
}

function formatDateUTC(ms: number): string {
  const d = new Date(ms);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function computeGanttTimeline(
  rawItems: GanttItem[],
  projectIssues: Issue[] = [],
  referenceToday = "2026-11-04"
): GanttTimelineProjection {
  // 1. Fusionner les Epics du projet qui ne seraient pas encore dans rawItems
  const linkedIssueIds = new Set(
    rawItems.map((it) => it.linkedIssueId).filter(Boolean)
  );
  const mergedItems: GanttItem[] = [...rawItems];

  const unlinkedEpics = projectIssues.filter(
    (iss) => iss.type === "EPIC" && !linkedIssueIds.has(iss.id)
  );
  unlinkedEpics.forEach((ep, idx) => {
    const start = ep.createdAt.slice(0, 10) || "2026-10-20";
    const end = ep.dueDate || "2026-11-12";
    mergedItems.push({
      id: `gantt-auto-${ep.id}`,
      projectId: ep.projectId,
      wbsCode: `E${idx + 1}`,
      title: `Epic [${ep.key}] : ${ep.title}`,
      type: "EPIC",
      externalCategory: null,
      externalProvider: "",
      startDate: start,
      endDate: end >= start ? end : start,
      progress: ep.status === "DONE" ? 100 : 50,
      ownerId: ep.assigneeId,
      linkedIssueId: ep.id,
      dependencies: [],
      isCritical: ep.priority === "BLOCKER" || ep.priority === "HIGHEST",
    });
  });

  if (mergedItems.length === 0) {
    return {
      minDate: "2026-10-15",
      maxDate: "2026-11-25",
      totalDays: 42,
      todayPercent: 50,
      weeks: [],
      items: [],
      summary: {
        epicsCount: 0,
        milestonesCount: 0,
        externalDepsCount: 0,
        criticalCount: 0,
        overallProgress: 0,
      },
    };
  }

  // 2. Bornes temporelles avec marge de 3 jours à gauche et 4 jours à droite
  let minMs = Infinity;
  let maxMs = -Infinity;

  for (const item of mergedItems) {
    const s = parseDateUTC(item.startDate);
    const e = parseDateUTC(item.endDate);
    if (s < minMs) minMs = s;
    if (e > maxMs) maxMs = e;
  }

  minMs -= 3 * MS_PER_DAY;
  maxMs += 4 * MS_PER_DAY;
  const totalDays = Math.max(14, Math.round((maxMs - minMs) / MS_PER_DAY));

  // 3. Calculer les semaines pour l'en-tête calendaire
  const weeks: GanttWeekBucket[] = [];
  let cursorMs = minMs;
  while (cursorMs < maxMs) {
    const bucketEndMs = Math.min(maxMs, cursorMs + 7 * MS_PER_DAY);
    const leftPercent = ((cursorMs - minMs) / (maxMs - minMs)) * 100;
    const widthPercent = ((bucketEndMs - cursorMs) / (maxMs - minMs)) * 100;
    const d = new Date(cursorMs);
    const label = d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      timeZone: "UTC",
    });
    weeks.push({
      label: `Sem. ${label}`,
      startDate: formatDateUTC(cursorMs),
      leftPercent,
      widthPercent,
    });
    cursorMs = bucketEndMs;
  }

  // 4. Positionner chaque élément et synchroniser l'avancement des Epics liés
  const positioned: PositionedGanttItem[] = mergedItems.map((item) => {
    const startMs = parseDateUTC(item.startDate);
    const endMs = Math.max(startMs, parseDateUTC(item.endDate));
    const rawDuration = Math.round((endMs - startMs) / MS_PER_DAY);
    const durationDays =
      item.type === "MILESTONE" ? 0 : Math.max(1, rawDuration + 1);

    const leftPercent = Math.max(
      0,
      Math.min(98, ((startMs - minMs) / (maxMs - minMs)) * 100)
    );
    const widthPercent =
      item.type === "MILESTONE"
        ? 0
        : Math.max(
            2.5,
            Math.min(
              100 - leftPercent,
              ((endMs - startMs + MS_PER_DAY) / (maxMs - minMs)) * 100
            )
          );

    // Si lié à un Epic qui possède des tickets enfants, synchroniser le % réel
    let effectiveProgress = item.progress;
    if (item.linkedIssueId && projectIssues.length > 0) {
      const childIssues = projectIssues.filter(
        (i) => i.epicId === item.linkedIssueId
      );
      if (childIssues.length > 0) {
        const totalPts = childIssues.reduce((a, i) => a + i.storyPoints, 0);
        const donePts = childIssues
          .filter((i) => i.status === "DONE")
          .reduce((a, i) => a + i.storyPoints, 0);
        if (totalPts > 0) {
          effectiveProgress = Math.round((donePts / totalPts) * 100);
        }
      }
    }

    return {
      ...item,
      durationDays,
      leftPercent,
      widthPercent,
      effectiveProgress,
    };
  });

  const todayMs = parseDateUTC(referenceToday);
  const todayPercent = Math.max(
    0,
    Math.min(100, ((todayMs - minMs) / (maxMs - minMs)) * 100)
  );

  const nonMilestones = positioned.filter((i) => i.type !== "MILESTONE");
  const overallProgress =
    nonMilestones.length > 0
      ? Math.round(
          nonMilestones.reduce((a, i) => a + i.effectiveProgress, 0) /
            nonMilestones.length
        )
      : 0;

  return {
    minDate: formatDateUTC(minMs),
    maxDate: formatDateUTC(maxMs),
    totalDays,
    todayPercent,
    weeks,
    items: positioned,
    summary: {
      epicsCount: positioned.filter((i) => i.type === "EPIC").length,
      milestonesCount: positioned.filter((i) => i.type === "MILESTONE").length,
      externalDepsCount: positioned.filter(
        (i) => i.type === "EXTERNAL_DEPENDENCY"
      ).length,
      criticalCount: positioned.filter((i) => i.isCritical).length,
      overallProgress,
    },
  };
}

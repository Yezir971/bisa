import { describe, it, expect } from "vitest";
import { computeGanttTimeline } from "./gantt-engine";
import { INITIAL_GANTT_ITEMS, INITIAL_ISSUES } from "@/repositories/seed-data";

describe("Gantt Engine Service (Normes WBS, Jalons, Dépendances & Chemin Critique - TDD)", () => {
  it("calcule les coordonnées temporelles des Epics, Jalons (durée 0) et Dépendances externes", () => {
    const coreGantt = INITIAL_GANTT_ITEMS.filter(
      (g) => g.projectId === "proj-core"
    );
    const coreIssues = INITIAL_ISSUES.filter(
      (i) => i.projectId === "proj-core"
    );

    const projection = computeGanttTimeline(coreGantt, coreIssues);

    expect(projection.items.length).toBeGreaterThanOrEqual(8);
    expect(projection.summary.epicsCount).toBeGreaterThanOrEqual(2);
    expect(projection.summary.milestonesCount).toBeGreaterThanOrEqual(2);
    expect(projection.summary.externalDepsCount).toBeGreaterThanOrEqual(3);
    expect(projection.summary.criticalCount).toBeGreaterThan(0);

    const milestone = projection.items.find((i) => i.type === "MILESTONE");
    expect(milestone).toBeDefined();
    expect(milestone?.durationDays).toBe(0);
    expect(milestone?.widthPercent).toBe(0);
  });
});

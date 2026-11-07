import { describe, expect, it } from "vitest";
import {
  buildPdfFromJpegBytes,
  computeGanttArrowGeometry,
  generateGanttSvgDocument,
} from "./gantt-exporter";
import { computeGanttTimeline } from "@/domain/services/gantt-engine";
import {
  INITIAL_GANTT_ITEMS,
  INITIAL_ISSUES,
  INITIAL_PROJECTS,
  INITIAL_USERS,
} from "@/repositories/seed-data";

describe("Gantt Exporter (SVG, WEBP, JPG, PDF)", () => {
  it("génère un document vectoriel SVG au style daisyUI avec la colonne gauche épurée et les flèches de dépendance vectorielles", () => {
    const project = INITIAL_PROJECTS[0]!;
    const ganttItems = INITIAL_GANTT_ITEMS.filter(
      (g) => g.projectId === project.id
    );
    const issues = INITIAL_ISSUES.filter((i) => i.projectId === project.id);
    const projection = computeGanttTimeline(ganttItems, issues);

    const { svgString, width, height } = generateGanttSvgDocument({
      project,
      projection,
      items: projection.items,
      users: INITIAL_USERS,
      showDependencyArrows: true,
      exportedAt: "2026-11-07",
    });

    expect(width).toBe(1440);
    expect(height).toBeGreaterThan(300);
    expect(svgString).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(svgString).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svgString).toContain("Plateforme Paiement &amp; API");
    expect(svgString).toContain("Diagramme de Gantt");
    expect(svgString).toContain("◆ Jalon");
    expect(svgString).toContain("Epic");
    expect(svgString).toContain("<polygon points=");
  });

  it("calcule une géométrie de flèche en S alignée verticalement avec l'offset Y de la grille (gridTop)", () => {
    const project = INITIAL_PROJECTS[0]!;
    const ganttItems = INITIAL_GANTT_ITEMS.filter(
      (g) => g.projectId === project.id
    );
    const issues = INITIAL_ISSUES.filter((i) => i.projectId === project.id);
    const projection = computeGanttTimeline(ganttItems, issues);

    const pred = projection.items[0]!;
    const succ = projection.items[1]!;
    const gridTop = 124;
    const rowHeight = 46;
    const geom = computeGanttArrowGeometry(
      pred,
      0,
      succ,
      1,
      "FS",
      1020,
      rowHeight,
      400,
      gridTop
    );
    // Row 0 center Y = 124 + 23 = 147; Row 1 center Y = 124 + 46 + 23 = 193
    expect(geom.startY).toBe(147);
    expect(geom.endY).toBe(193);
    expect(geom.pathD).toContain(`M ${geom.startX} 147`);
    expect(geom.arrowPolygonPoints).toContain(`${geom.endX},193`);
  });

  it("contourne les barres intermédiaires et passe par les couloirs inter-lignes lors d'un saut multi-lignes", () => {
    const project = INITIAL_PROJECTS[0]!;
    const ganttItems = INITIAL_GANTT_ITEMS.filter(
      (g) => g.projectId === project.id
    );
    const issues = INITIAL_ISSUES.filter((i) => i.projectId === project.id);
    const projection = computeGanttTimeline(ganttItems, issues);

    // Saut de la ligne 0 (gantt-core-1) vers la ligne 2 (gantt-core-3) au-dessus de la ligne 1 (gantt-core-2)
    const pred = projection.items[0]!;
    const succ = projection.items[2]!;
    const geom = computeGanttArrowGeometry(
      pred,
      0,
      succ,
      2,
      "FS",
      1020,
      46,
      400,
      124,
      projection.items
    );

    // Les couloirs horizontaux sont situés sur les frontières de lignes (124 + 46 = 170 et 124 + 92 = 216), jamais au centre de la ligne 1 (193)
    expect(geom.pathD).toContain(" 170 ");
    expect(geom.pathD).toContain(" 216 ");
    expect(geom.pathD).not.toContain(" 193 ");
  });

  it("construit un fichier binaire PDF 1.4 valide (orientation Paysage) encapsulant le flux JPEG /DCTDecode", () => {
    const dummyJpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0xff, 0xd9]);
    const pdfBytes = buildPdfFromJpegBytes(
      dummyJpeg,
      3000,
      1200,
      "Diagramme de Gantt - Architecture"
    );

    const decoder = new TextDecoder("latin1");
    const pdfText = decoder.decode(pdfBytes);

    expect(pdfText.startsWith("%PDF-1.4")).toBe(true);
    expect(pdfText).toContain("/Subtype /Image");
    expect(pdfText).toContain("/Filter /DCTDecode");
    expect(pdfText).toContain("/MediaBox [0 0 1190 ");
    expect(pdfText).toContain("xref");
    expect(pdfText.trim().endsWith("%%EOF")).toBe(true);
  });
});

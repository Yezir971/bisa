import type { Project, User } from "@/domain/entities";
import type {
  GanttTimelineProjection,
  GanttWeekBucket,
  PositionedGanttItem,
} from "@/domain/services/gantt-engine";
import type { GanttDependencyType } from "@/lib/validations/jira-schema";

export type GanttExportFormat = "PDF" | "WEBP" | "JPG" | "SVG";

export interface DaisyUiResolvedPalette {
  base100: string;
  base200: string;
  base300: string;
  baseContent: string;
  baseContentMuted: string;
  primary: string;
  secondary: string;
  warning: string;
  error: string;
  info: string;
  success: string;
}

export const DEFAULT_DAISY_LIGHT_PALETTE: DaisyUiResolvedPalette = {
  base100: "#ffffff",
  base200: "#f8fafc",
  base300: "#e2e8f0",
  baseContent: "#1e293b",
  baseContentMuted: "#64748b",
  primary: "#4f46e5",
  secondary: "#7c3aed",
  warning: "#d97706",
  error: "#ef4444",
  info: "#0284c7",
  success: "#16a34a",
};

export interface GanttExportPayload {
  project: Project;
  projection: GanttTimelineProjection;
  items: PositionedGanttItem[];
  users: User[];
  showDependencyArrows?: boolean;
  exportedAt?: string;
  palette?: DaisyUiResolvedPalette;
}

export interface GanttArrowGeometry {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  pathD: string;
  arrowPolygonPoints: string;
  isCritical: boolean;
}

/**
 * Calcule le tracé orthogonal normatif d'une flèche de dépendance Gantt (FS, SS, FF, SF)
 * en passant systématiquement par les couloirs inter-lignes (gutters) et en contournant
 * les barres intermédiaires afin de ne jamais masquer le nom des tâches ni les barres du Gantt.
 */
export function computeGanttArrowGeometry(
  pred: PositionedGanttItem,
  predRowIndex: number,
  succ: PositionedGanttItem,
  succRowIndex: number,
  depType: GanttDependencyType,
  timelineWidthPx: number,
  rowHeightPx: number,
  timelineOffsetX = 0,
  timelineOffsetY = 0,
  allItems: PositionedGanttItem[] = []
): GanttArrowGeometry {
  const getItemSpanPx = (it: PositionedGanttItem) => {
    const cPx = timelineOffsetX + (it.leftPercent / 100) * timelineWidthPx;
    if (it.type === "MILESTONE") {
      return {
        anchorStart: cPx - 8,
        anchorEnd: cPx + 8,
        centerX: cPx,
        // Inclut le badge texte à droite du losange pour éviter de le traverser
        obstacleLeft: cPx - 12,
        obstacleRight: cPx + 98,
      };
    }
    const wPx = Math.max(20, (it.widthPercent / 100) * timelineWidthPx);
    return {
      anchorStart: cPx,
      anchorEnd: cPx + wPx,
      centerX: cPx + wPx / 2,
      obstacleLeft: cPx - 10,
      obstacleRight: cPx + wPx + 10,
    };
  };

  const predSpan = getItemSpanPx(pred);
  const succSpan = getItemSpanPx(succ);

  const goingDown = succRowIndex >= predRowIndex;
  const predCenterY =
    timelineOffsetY + predRowIndex * rowHeightPx + rowHeightPx / 2;
  const succCenterY =
    timelineOffsetY + succRowIndex * rowHeightPx + rowHeightPx / 2;

  const exitingFromLeft = depType === "SS" || depType === "SF";
  const enteringFromRight = depType === "FF" || depType === "SF";

  // Si le prédécesseur est un Jalon (◆), on sort par sa pointe basse/haute pour ne pas traverser son étiquette à droite
  const startFromMilestoneVertex =
    pred.type === "MILESTONE" && !exitingFromLeft;

  const startX = Math.round(
    startFromMilestoneVertex
      ? predSpan.centerX
      : exitingFromLeft
        ? predSpan.anchorStart
        : predSpan.anchorEnd
  );
  const startY = Math.round(
    startFromMilestoneVertex
      ? predCenterY + (goingDown ? 8 : -8)
      : predCenterY
  );

  const endX = Math.round(
    enteringFromRight ? succSpan.anchorEnd : succSpan.anchorStart
  );
  const endY = Math.round(succCenterY);

  const arrowLen = 7;
  const arrowHalfWidth = 4;

  const tipX = endX;
  const baseTipX = enteringFromRight ? tipX + arrowLen : tipX - arrowLen;
  const arrowPolygonPoints = `${tipX},${endY} ${baseTipX},${endY - arrowHalfWidth} ${baseTipX},${endY + arrowHalfWidth}`;

  // Point de sortie horizontal hors de la barre prédécesseur
  const outX = Math.round(
    startFromMilestoneVertex
      ? startX
      : exitingFromLeft
        ? Math.max(timelineOffsetX + 6, startX - 10)
        : Math.min(timelineOffsetX + timelineWidthPx - 6, startX + 10)
  );

  // Point d'approche horizontal avant d'entrer dans le successeur
  const inX = Math.round(
    enteringFromRight
      ? Math.min(timelineOffsetX + timelineWidthPx - 6, baseTipX + 10)
      : Math.max(timelineOffsetX + 6, baseTipX - 10)
  );

  // Couloirs horizontaux situés exactement sur les lignes de séparation entre les rangées (hors des barres)
  const gutter1Y = Math.round(
    timelineOffsetY + (goingDown ? predRowIndex + 1 : predRowIndex) * rowHeightPx
  );
  const gutter2Y = Math.round(
    timelineOffsetY + (goingDown ? succRowIndex : succRowIndex + 1) * rowHeightPx
  );

  // Cas 1 : Les deux étapes sont sur deux lignes adjacentes (aucune ligne intermédiaire)
  if (Math.abs(succRowIndex - predRowIndex) <= 1) {
    // Si la sortie est directement alignée et proche de l'entrée sans retour arrière
    if (!enteringFromRight && !exitingFromLeft && inX >= outX && inX - outX <= 28) {
      const midX = Math.round((outX + inX) / 2);
      const pathD = startFromMilestoneVertex
        ? `M ${startX} ${startY} L ${startX} ${gutter1Y} L ${inX} ${gutter1Y} L ${inX} ${endY} L ${baseTipX} ${endY}`
        : `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${baseTipX} ${endY}`;
      return {
        startX,
        startY,
        endX,
        endY,
        pathD,
        arrowPolygonPoints,
        isCritical: Boolean(pred.isCritical && succ.isCritical),
      };
    }

    // Sinon on emprunte le couloir inter-lignes (gutter1Y) qui ne touche aucune barre
    const pathD = startFromMilestoneVertex
      ? `M ${startX} ${startY} L ${startX} ${gutter1Y} L ${inX} ${gutter1Y} L ${inX} ${endY} L ${baseTipX} ${endY}`
      : `M ${startX} ${startY} L ${outX} ${startY} L ${outX} ${gutter1Y} L ${inX} ${gutter1Y} L ${inX} ${endY} L ${baseTipX} ${endY}`;

    return {
      startX,
      startY,
      endX,
      endY,
      pathD,
      arrowPolygonPoints,
      isCritical: Boolean(pred.isCritical && succ.isCritical),
    };
  }

  // Cas 2 : Saut au-dessus d'une ou plusieurs lignes intermédiaires -> détection et contournement des barres intermédiaires
  const minRow = Math.min(predRowIndex, succRowIndex);
  const maxRow = Math.max(predRowIndex, succRowIndex);
  const intermediateObstacles: Array<{ left: number; right: number }> = [];

  for (let r = minRow + 1; r < maxRow; r += 1) {
    const midItem = allItems[r];
    if (midItem) {
      const span = getItemSpanPx(midItem);
      intermediateObstacles.push({
        left: span.obstacleLeft,
        right: span.obstacleRight,
      });
    }
  }

  const isXClearOfObstacles = (x: number) =>
    intermediateObstacles.every((obs) => x < obs.left || x > obs.right);

  let channelX = inX;
  if (isXClearOfObstacles(inX)) {
    channelX = inX;
  } else if (isXClearOfObstacles(outX)) {
    channelX = outX;
  } else {
    // Calculer les couloirs de contournement à gauche et à droite des barres intermédiaires qui gênent
    const minObsLeft = Math.min(...intermediateObstacles.map((o) => o.left));
    const maxObsRight = Math.max(...intermediateObstacles.map((o) => o.right));
    const leftBypass = Math.max(timelineOffsetX + 8, Math.round(minObsLeft - 8));
    const rightBypass = Math.min(
      timelineOffsetX + timelineWidthPx - 8,
      Math.round(maxObsRight + 8)
    );
    const targetMid = (outX + inX) / 2;
    channelX =
      Math.abs(leftBypass - targetMid) <= Math.abs(rightBypass - targetMid)
        ? leftBypass
        : rightBypass;
  }

  const startSegment = startFromMilestoneVertex
    ? `M ${startX} ${startY} L ${startX} ${gutter1Y}`
    : `M ${startX} ${startY} L ${outX} ${startY} L ${outX} ${gutter1Y}`;

  const pathD = `${startSegment} L ${channelX} ${gutter1Y} L ${channelX} ${gutter2Y} L ${inX} ${gutter2Y} L ${inX} ${endY} L ${baseTipX} ${endY}`;

  return {
    startX,
    startY,
    endX,
    endY,
    pathD,
    arrowPolygonPoints,
    isCritical: Boolean(pred.isCritical && succ.isCritical),
  };
}

function escapeXml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars - 1)}…`;
}

function hexWithAlpha(hex: string, alphaHex: string): string {
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    return `${hex}${alphaHex}`;
  }
  return hex;
}

/**
 * Extrait les couleurs sémantiques actives de daisyUI 5 depuis le DOM (convertit oklch() en #rrggbb)
 * afin que l'export respecte fidèlement le thème daisyUI choisi par l'utilisateur.
 */
export function resolveActiveDaisyUiPalette(): DaisyUiResolvedPalette {
  if (typeof document === "undefined") {
    return DEFAULT_DAISY_LIGHT_PALETTE;
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return DEFAULT_DAISY_LIGHT_PALETTE;

    const sampleClassColor = (
      className: string,
      prop: "backgroundColor" | "color",
      fallback: string
    ): string => {
      const probe = document.createElement("div");
      probe.className = className;
      probe.style.position = "fixed";
      probe.style.left = "-9999px";
      probe.style.width = "1px";
      probe.style.height = "1px";
      document.body.appendChild(probe);
      const rawColor = window.getComputedStyle(probe)[prop];
      document.body.removeChild(probe);

      if (!rawColor) return fallback;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = fallback;
      ctx.fillStyle = rawColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      if (a === 0) return fallback;
      return `#${[r, g, b]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("")}`;
    };

    return {
      base100: sampleClassColor("bg-base-100", "backgroundColor", "#ffffff"),
      base200: sampleClassColor("bg-base-200", "backgroundColor", "#f8fafc"),
      base300: sampleClassColor("bg-base-300", "backgroundColor", "#e2e8f0"),
      baseContent: sampleClassColor(
        "text-base-content",
        "color",
        "#1e293b"
      ),
      baseContentMuted: sampleClassColor(
        "text-base-content/60",
        "color",
        "#64748b"
      ),
      primary: sampleClassColor("bg-primary", "backgroundColor", "#4f46e5"),
      secondary: sampleClassColor("bg-secondary", "backgroundColor", "#7c3aed"),
      warning: sampleClassColor("bg-warning", "backgroundColor", "#d97706"),
      error: sampleClassColor("bg-error", "backgroundColor", "#ef4444"),
      info: sampleClassColor("bg-info", "backgroundColor", "#0284c7"),
      success: sampleClassColor("bg-success", "backgroundColor", "#16a34a"),
    };
  } catch {
    return DEFAULT_DAISY_LIGHT_PALETTE;
  }
}

/**
 * Génère un document SVG épuré et fidèle aux composants daisyUI 5
 * (Colonne gauche simplifiée : Étape + Avancement, Frise chronologique et Flèches de dépendance au premier plan).
 */
export function generateGanttSvgDocument({
  project,
  projection,
  items,
  showDependencyArrows = true,
  exportedAt,
  palette = DEFAULT_DAISY_LIGHT_PALETTE,
}: GanttExportPayload): { svgString: string; width: number; height: number } {
  const exportDateStr =
    exportedAt ?? new Date().toISOString().slice(0, 10);

  const OUTER_PAD = 20;
  const HEADER_HEIGHT = 64;
  const TABLE_HEADER_HEIGHT = 40;
  const ROW_HEIGHT = 46;
  const FOOTER_HEIGHT = 44;

  // Partie gauche épurée (380px) + Frise chronologique large (1020px)
  const WBS_WIDTH = 380;
  const TIMELINE_WIDTH = 1020;
  const CARD_WIDTH = WBS_WIDTH + TIMELINE_WIDTH;
  const TOTAL_WIDTH = CARD_WIDTH + OUTER_PAD * 2;

  const rowsCount = Math.max(items.length, 1);
  const BODY_HEIGHT = rowsCount * ROW_HEIGHT;
  const CARD_HEIGHT =
    HEADER_HEIGHT + TABLE_HEADER_HEIGHT + BODY_HEIGHT + FOOTER_HEIGHT;
  const TOTAL_HEIGHT = CARD_HEIGHT + OUTER_PAD * 2;

  const cardLeft = OUTER_PAD;
  const cardTop = OUTER_PAD;
  const tableHeaderTop = cardTop + HEADER_HEIGHT;
  const gridTop = tableHeaderTop + TABLE_HEADER_HEIGHT;
  const timelineLeft = cardLeft + WBS_WIDTH;
  const footerTop = gridTop + BODY_HEIGHT;

  const itemIndexMap = new Map<
    string,
    { index: number; item: PositionedGanttItem }
  >();
  items.forEach((it, idx) => {
    itemIndexMap.set(it.id, { index: idx, item: it });
  });

  // 1. Fond des lignes et colonne gauche épurée (Type + Titre + Avancement)
  const rowBackgroundsAndLeftPane: string[] = [];
  // 2. Barres et jalons sur la frise
  const barElements: string[] = [];

  items.forEach((item, rowIndex) => {
    const rowY = gridTop + rowIndex * ROW_HEIGHT;
    const centerY = rowY + ROW_HEIGHT / 2;

    const isEpic = item.type === "EPIC";
    const isMilestone = item.type === "MILESTONE";
    const isExternal = item.type === "EXTERNAL_DEPENDENCY";

    const badgeColor = isEpic
      ? palette.primary
      : isMilestone
        ? palette.secondary
        : isExternal
          ? palette.warning
          : palette.info;

    const badgeLabel = isEpic
      ? "Epic"
      : isMilestone
        ? "◆ Jalon"
        : isExternal
          ? "Externe"
          : "Tâche";

    const rowBgFill = isEpic
      ? hexWithAlpha(palette.primary, "0d")
      : rowIndex % 2 === 1
        ? hexWithAlpha(palette.base200, "80")
        : palette.base100;

    rowBackgroundsAndLeftPane.push(`
      <g>
        <rect x="${cardLeft}" y="${rowY}" width="${CARD_WIDTH}" height="${ROW_HEIGHT}" fill="${rowBgFill}" />
        <line x1="${cardLeft}" y1="${rowY + ROW_HEIGHT}" x2="${cardLeft + CARD_WIDTH}" y2="${rowY + ROW_HEIGHT}" stroke="${palette.base300}" stroke-width="1" />

        <!-- Badge daisyUI compact (badge-soft) -->
        <rect x="${cardLeft + 14}" y="${centerY - 10}" width="58" height="20" rx="6" fill="${hexWithAlpha(badgeColor, "1f")}" stroke="${hexWithAlpha(badgeColor, "4d")}" stroke-width="1" />
        <text x="${cardLeft + 43}" y="${centerY + 3.5}" text-anchor="middle" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="10" font-weight="600" fill="${badgeColor}">
          ${escapeXml(badgeLabel)}
        </text>

        <!-- Intitulé épuré de l'étape -->
        <text x="${cardLeft + 82}" y="${centerY + 4}" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="12" font-weight="${isEpic ? "700" : "500"}" fill="${palette.baseContent}">
          ${escapeXml(truncateText(item.title, 33))}
        </text>

        <!-- Avancement à droite de la colonne gauche -->
        <text x="${timelineLeft - 14}" y="${centerY + 4}" text-anchor="end" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="11.5" font-weight="600" fill="${isMilestone ? palette.secondary : palette.baseContentMuted}">
          ${isMilestone ? "◆" : `${item.effectiveProgress}%`}
        </text>
      </g>
    `);

    // Coordonnées de la barre sur la frise
    const barX =
      timelineLeft + (item.leftPercent / 100) * TIMELINE_WIDTH;
    const barW = Math.max(
      (item.widthPercent / 100) * TIMELINE_WIDTH,
      isMilestone ? 0 : 20
    );

    if (isMilestone) {
      const dColor = item.isCritical ? palette.error : palette.secondary;
      const r = 8;
      barElements.push(`
        <g>
          <polygon
            points="${barX},${centerY - r} ${barX + r},${centerY} ${barX},${centerY + r} ${barX - r},${centerY}"
            fill="${dColor}"
            stroke="${palette.base100}"
            stroke-width="2"
          />
          <rect x="${barX + 12}" y="${centerY - 10}" width="76" height="20" rx="5" fill="${palette.base100}" stroke="${palette.base300}" stroke-width="1" />
          <text x="${barX + 50}" y="${centerY + 3.5}" text-anchor="middle" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="10" font-weight="600" fill="${palette.baseContent}">
            ◆ ${escapeXml(item.startDate.slice(5))}
          </text>
        </g>
      `);
    } else {
      const mainColor = isEpic
        ? palette.primary
        : isExternal
          ? palette.warning
          : palette.info;
      const borderColor = item.isCritical ? palette.error : mainColor;
      const progW = Math.round((barW * item.effectiveProgress) / 100);
      const barH = 24;
      const barTop = centerY - barH / 2;
      const dashAttr = isExternal ? 'stroke-dasharray="5,3"' : "";

      barElements.push(`
        <g>
          <!-- Socle opaque base-100 pour masquer toute ligne passant derrière la barre -->
          <rect
            x="${barX}"
            y="${barTop}"
            width="${barW}"
            height="${barH}"
            rx="6"
            fill="${palette.base100}"
          />
          <rect
            x="${barX}"
            y="${barTop}"
            width="${barW}"
            height="${barH}"
            rx="6"
            fill="${hexWithAlpha(mainColor, "22")}"
            stroke="${borderColor}"
            stroke-width="${item.isCritical || isEpic ? "1.75" : "1.25"}"
            ${dashAttr}
          />
          ${
            progW > 0
              ? `<rect x="${barX}" y="${barTop}" width="${progW}" height="${barH}" rx="6" fill="${hexWithAlpha(mainColor, "55")}" />`
              : ""
          }
          <text
            x="${barX + 8}"
            y="${centerY + 4}"
            font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif"
            font-size="10.5"
            font-weight="600"
            fill="${palette.baseContent}"
          >
            ${escapeXml(truncateText(item.title, Math.max(8, Math.floor(barW / 6.8))))}
          </text>
        </g>
      `);
    }
  });

  // 3. Grille verticale des semaines
  const weekGridElements: string[] = [];
  projection.weeks.forEach((wk: GanttWeekBucket) => {
    const wkX = timelineLeft + (wk.leftPercent / 100) * TIMELINE_WIDTH;
    weekGridElements.push(`
      <g>
        <line x1="${wkX}" y1="${tableHeaderTop}" x2="${wkX}" y2="${footerTop}" stroke="${palette.base300}" stroke-width="1" stroke-dasharray="3,3" />
        <text x="${wkX + 8}" y="${tableHeaderTop + 17}" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="10.5" font-weight="700" fill="${palette.baseContent}">
          ${escapeXml(wk.label)}
        </text>
        <text x="${wkX + 8}" y="${tableHeaderTop + 31}" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="9.5" fill="${palette.baseContentMuted}">
          ${escapeXml(wk.startDate)}
        </text>
      </g>
    `);
  });

  // 4. Calque AU PREMIER PLAN : Flèches de dépendances avec point d'ancrage (<circle>) et pointe (<polygon>) explicites
  const dependencyArrows: string[] = [];
  if (showDependencyArrows) {
    items.forEach((succ, succIdx) => {
      for (const dep of succ.dependencies) {
        const predEntry = itemIndexMap.get(dep.predecessorId);
        if (!predEntry) continue;

        const geom = computeGanttArrowGeometry(
          predEntry.item,
          predEntry.index,
          succ,
          succIdx,
          dep.type,
          TIMELINE_WIDTH,
          ROW_HEIGHT,
          timelineLeft,
          gridTop,
          items
        );

        const strokeColor = geom.isCritical
          ? palette.error
          : palette.primary;

        dependencyArrows.push(`
          <g>
            <!-- Halo de lisibilité sous le tracé pour détacher la flèche des barres -->
            <path
              d="${geom.pathD}"
              fill="none"
              stroke="${palette.base100}"
              stroke-width="4.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <!-- Tracé principal de la liaison -->
            <path
              d="${geom.pathD}"
              fill="none"
              stroke="${strokeColor}"
              stroke-width="2.25"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <!-- Point d'ancrage sur le prédécesseur -->
            <circle
              cx="${geom.startX}"
              cy="${geom.startY}"
              r="3.5"
              fill="${strokeColor}"
              stroke="${palette.base100}"
              stroke-width="1.25"
            />
            <!-- Pointe de flèche géométrique explicite sur le successeur -->
            <polygon
              points="${geom.arrowPolygonPoints}"
              fill="${strokeColor}"
            />
          </g>
        `);
      }
    });
  }

  const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}" width="${TOTAL_WIDTH}" height="${TOTAL_HEIGHT}">
  <!-- Fond de page daisyUI base-200 -->
  <rect x="0" y="0" width="${TOTAL_WIDTH}" height="${TOTAL_HEIGHT}" fill="${palette.base200}" />

  <!-- Conteneur daisyUI card (bg-base-100 border-base-300 rounded-box) -->
  <rect x="${cardLeft}" y="${cardTop}" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" rx="12" fill="${palette.base100}" stroke="${palette.base300}" stroke-width="1.5" />

  <!-- En-tête de la card daisyUI -->
  <rect x="${cardLeft + 16}" y="${cardTop + 18}" width="54" height="24" rx="6" fill="${palette.base200}" stroke="${palette.base300}" stroke-width="1" />
  <text x="${cardLeft + 43}" y="${cardTop + 34}" text-anchor="middle" font-family="JetBrains Mono, Consolas, monospace" font-size="11" font-weight="700" fill="${palette.primary}">
    ${escapeXml(project.key)}
  </text>

  <text x="${cardLeft + 82}" y="${cardTop + 31}" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="15" font-weight="700" fill="${palette.baseContent}">
    ${escapeXml(project.name)} — Diagramme de Gantt
  </text>
  <text x="${cardLeft + 82}" y="${cardTop + 48}" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" fill="${palette.baseContentMuted}">
    Période : ${escapeXml(projection.minDate)} → ${escapeXml(projection.maxDate)} · Exporté le ${escapeXml(exportDateStr)}
  </text>

  <!-- Badges daisyUI à droite de l'en-tête -->
  <rect x="${cardLeft + CARD_WIDTH - 340}" y="${cardTop + 18}" width="96" height="26" rx="6" fill="${hexWithAlpha(palette.primary, "1a")}" />
  <text x="${cardLeft + CARD_WIDTH - 292}" y="${cardTop + 35}" text-anchor="middle" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" font-weight="600" fill="${palette.primary}">
    ${projection.summary.epicsCount} Epics
  </text>

  <rect x="${cardLeft + CARD_WIDTH - 236}" y="${cardTop + 18}" width="96" height="26" rx="6" fill="${hexWithAlpha(palette.secondary, "1a")}" />
  <text x="${cardLeft + CARD_WIDTH - 188}" y="${cardTop + 35}" text-anchor="middle" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" font-weight="600" fill="${palette.secondary}">
    ${projection.summary.milestonesCount} Jalons ◆
  </text>

  <rect x="${cardLeft + CARD_WIDTH - 132}" y="${cardTop + 18}" width="116" height="26" rx="6" fill="${palette.base200}" stroke="${palette.base300}" stroke-width="1" />
  <text x="${cardLeft + CARD_WIDTH - 74}" y="${cardTop + 35}" text-anchor="middle" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" font-weight="700" fill="${palette.baseContent}">
    Avancement ${projection.summary.overallProgress}%
  </text>

  <!-- En-tête de table daisyUI (bg-base-200) -->
  <rect x="${cardLeft}" y="${tableHeaderTop}" width="${CARD_WIDTH}" height="${TABLE_HEADER_HEIGHT}" fill="${palette.base200}" />
  <line x1="${cardLeft}" y1="${tableHeaderTop}" x2="${cardLeft + CARD_WIDTH}" y2="${tableHeaderTop}" stroke="${palette.base300}" stroke-width="1" />
  <line x1="${cardLeft}" y1="${gridTop}" x2="${cardLeft + CARD_WIDTH}" y2="${gridTop}" stroke="${palette.base300}" stroke-width="1" />

  <text x="${cardLeft + 14}" y="${tableHeaderTop + 24}" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" font-weight="700" fill="${palette.baseContent}">
    Étape
  </text>
  <text x="${timelineLeft - 14}" y="${tableHeaderTop + 24}" text-anchor="end" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" font-weight="700" fill="${palette.baseContent}">
    Avancement
  </text>

  <!-- Lignes de fond + Colonne gauche -->
  ${rowBackgroundsAndLeftPane.join("\n")}

  <!-- Grille des semaines -->
  ${weekGridElements.join("\n")}

  <!-- Séparateur vertical gauche / droite -->
  <line x1="${timelineLeft}" y1="${tableHeaderTop}" x2="${timelineLeft}" y2="${footerTop}" stroke="${palette.base300}" stroke-width="1" />

  <!-- Flèches de dépendance dessinées DERRIÈRE les barres et jalons -->
  ${dependencyArrows.join("\n")}

  <!-- Barres et Jalons dessinés AU PREMIER PLAN (devant les lignes) -->
  ${barElements.join("\n")}

  <!-- Pied de card daisyUI discret -->
  <line x1="${cardLeft}" y1="${footerTop}" x2="${cardLeft + CARD_WIDTH}" y2="${footerTop}" stroke="${palette.base300}" stroke-width="1" />
  <rect x="${cardLeft + 16}" y="${footerTop + 15}" width="14" height="10" rx="3" fill="${hexWithAlpha(palette.primary, "40")}" stroke="${palette.primary}" stroke-width="1.5" />
  <text x="${cardLeft + 36}" y="${footerTop + 24}" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" fill="${palette.baseContentMuted}">Epic</text>

  <polygon points="${cardLeft + 88},${footerTop + 14} ${cardLeft + 94},${footerTop + 20} ${cardLeft + 88},${footerTop + 26} ${cardLeft + 82},${footerTop + 20}" fill="${palette.secondary}" />
  <text x="${cardLeft + 100}" y="${footerTop + 24}" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" fill="${palette.baseContentMuted}">Jalon ◆</text>

  <rect x="${cardLeft + 166}" y="${footerTop + 15}" width="14" height="10" rx="3" fill="${hexWithAlpha(palette.warning, "30")}" stroke="${palette.warning}" stroke-width="1.5" stroke-dasharray="3,2" />
  <text x="${cardLeft + 186}" y="${footerTop + 24}" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" fill="${palette.baseContentMuted}">Dépendance externe</text>

  <line x1="${cardLeft + 320}" y1="${footerTop + 20}" x2="${cardLeft + 342}" y2="${footerTop + 20}" stroke="${palette.error}" stroke-width="2.25" />
  <polygon points="${cardLeft + 346},${footerTop + 20} ${cardLeft + 339},${footerTop + 16} ${cardLeft + 339},${footerTop + 24}" fill="${palette.error}" />
  <text x="${cardLeft + 354}" y="${footerTop + 24}" font-family="Inter, system-ui, -apple-system, Segoe UI, sans-serif" font-size="11" fill="${palette.baseContentMuted}">Chemin critique &amp; liaisons</text>
</svg>`;

  return {
    svgString,
    width: TOTAL_WIDTH,
    height: TOTAL_HEIGHT,
  };
}

/**
 * Construit un fichier binaire PDF 1.4 autonome (orientation Paysage) encapsulant
 * l'image haute définition JPEG du Diagramme de Gantt via le filtre natif /DCTDecode.
 */
export function buildPdfFromJpegBytes(
  jpegBytes: Uint8Array,
  imageWidthPx: number,
  imageHeightPx: number,
  documentTitle: string
): Uint8Array {
  const encoder = new TextEncoder();

  // Dimensions en points PDF (72 pt = 1 inch) avec largeur paysage A3 (1190 pt)
  const pageWidthPt = 1190;
  const marginPt = 24;
  const drawableWidthPt = pageWidthPt - marginPt * 2;
  const aspect = imageHeightPx / Math.max(imageWidthPx, 1);
  const drawableHeightPt = Math.round(drawableWidthPt * aspect);
  const pageHeightPt = drawableHeightPt + marginPt * 2;

  const safeTitle = documentTitle.replace(/[()\\]/g, " ");

  const contentStreamStr = `q\n${drawableWidthPt} 0 0 ${drawableHeightPt} ${marginPt} ${marginPt} cm\n/Im1 Do\nQ\n`;
  const contentStreamBytes = encoder.encode(contentStreamStr);

  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0];
  let currentOffset = 0;

  const pushText = (str: string) => {
    const bytes = encoder.encode(str);
    chunks.push(bytes);
    currentOffset += bytes.byteLength;
  };

  const pushBytes = (bytes: Uint8Array) => {
    chunks.push(bytes);
    currentOffset += bytes.byteLength;
  };

  pushText("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");

  offsets.push(currentOffset);
  pushText("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  offsets.push(currentOffset);
  pushText("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");

  offsets.push(currentOffset);
  pushText(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidthPt} ${pageHeightPt}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`
  );

  offsets.push(currentOffset);
  pushText(
    `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${imageWidthPx} /Height ${imageHeightPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.byteLength} >>\nstream\n`
  );
  pushBytes(jpegBytes);
  pushText("\nendstream\nendobj\n");

  offsets.push(currentOffset);
  pushText(
    `5 0 obj\n<< /Length ${contentStreamBytes.byteLength} >>\nstream\n`
  );
  pushBytes(contentStreamBytes);
  pushText("endstream\nendobj\n");

  offsets.push(currentOffset);
  pushText(
    `6 0 obj\n<< /Title (${safeTitle}) /Producer (Bisa Workspace) >>\nendobj\n`
  );

  const xrefOffset = currentOffset;
  const totalObjects = offsets.length;
  let xrefStr = `xref\n0 ${totalObjects}\n0000000000 65535 f \n`;
  for (let i = 1; i < totalObjects; i++) {
    const padded = String(offsets[i]).padStart(10, "0");
    xrefStr += `${padded} 00000 n \n`;
  }
  pushText(xrefStr);

  pushText(
    `trailer\n<< /Size ${totalObjects} /Root 1 0 R /Info 6 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
  );

  const result = new Uint8Array(currentOffset);
  let pos = 0;
  for (const chunk of chunks) {
    result.set(chunk, pos);
    pos += chunk.byteLength;
  }
  return result;
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function renderSvgToCanvas(
  svgString: string,
  width: number,
  height: number,
  bgColor: string,
  scale = 2
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Contexte graphique 2D indisponible"));
          return;
        }
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Échec du rendu vectoriel SVG vers Canvas"));
    };

    img.src = url;
  });
}

export async function exportGanttChart(
  format: GanttExportFormat,
  payload: GanttExportPayload
): Promise<string> {
  const palette = payload.palette ?? resolveActiveDaisyUiPalette();
  const { svgString, width, height } = generateGanttSvgDocument({
    ...payload,
    palette,
  });
  const slug = payload.project.key.toLowerCase();
  const dateStamp = new Date().toISOString().slice(0, 10);
  const baseFilename = `diagramme-gantt-${slug}-${dateStamp}`;

  if (format === "SVG") {
    const blob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const filename = `${baseFilename}.svg`;
    triggerBlobDownload(blob, filename);
    return filename;
  }

  const canvas = await renderSvgToCanvas(
    svgString,
    width,
    height,
    palette.base200,
    2
  );

  if (format === "WEBP") {
    const dataUrl = canvas.toDataURL("image/webp", 0.95);
    const bytes = dataUrlToUint8Array(dataUrl);
    const blob = new Blob([bytes.buffer as ArrayBuffer], {
      type: "image/webp",
    });
    const filename = `${baseFilename}.webp`;
    triggerBlobDownload(blob, filename);
    return filename;
  }

  if (format === "JPG") {
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const bytes = dataUrlToUint8Array(dataUrl);
    const blob = new Blob([bytes.buffer as ArrayBuffer], {
      type: "image/jpeg",
    });
    const filename = `${baseFilename}.jpg`;
    triggerBlobDownload(blob, filename);
    return filename;
  }

  const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
  const jpegBytes = dataUrlToUint8Array(jpegDataUrl);
  const pdfBytes = buildPdfFromJpegBytes(
    jpegBytes,
    canvas.width,
    canvas.height,
    `Diagramme de Gantt - ${payload.project.name}`
  );
  const pdfBlob = new Blob([pdfBytes.buffer as ArrayBuffer], {
    type: "application/pdf",
  });
  const filename = `${baseFilename}.pdf`;
  triggerBlobDownload(pdfBlob, filename);
  return filename;
}

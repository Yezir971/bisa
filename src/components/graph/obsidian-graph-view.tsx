"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type {
  GraphLink,
  GraphNode,
  Issue,
  Project,
} from "@/domain/entities";
import { projectKnowledgeGraph } from "@/domain/services/graph-projection";
import { dcColor, type DaisyColorToken } from "@/lib/daisy-chart-helper";
import {
  Compass,
  Eye,
  Filter,
  Globe,
  Maximize2,
  Network,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";
import {
  IssuePriorityBadge,
  IssueStatusBadge,
  IssueTypeBadge,
} from "@/components/ui/issue-badges";

interface ObsidianGraphViewProps {
  projects: Project[];
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onSelectProject?: (projectId: string) => void;
}

interface SimNode extends GraphNode {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  theta: number;
  phi: number;
}

export function ObsidianGraphView({
  projects,
  issues,
  onSelectIssue,
  onSelectProject,
}: ObsidianGraphViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<"GLOBE_3D" | "FORCE_2D">("GLOBE_3D");
  const [projectFilter, setProjectFilter] = useState<string>("ALL");
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);
  const [onlyBlockingLinks, setOnlyBlockingLinks] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [repulsionStrength, setRepulsionStrength] = useState<number>(65);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [themeTick, setThemeTick] = useState<number>(0);

  const rotationRef = useRef<{ rotX: number; rotY: number }>({
    rotX: 0.25,
    rotY: 0.4,
  });
  const panZoomRef = useRef<{ panX: number; panY: number; zoom: number }>({
    panX: 0,
    panY: 0,
    zoom: 1,
  });
  const dragStateRef = useRef<{
    isDragging: boolean;
    draggedNodeId: string | null;
    startX: number;
    startY: number;
    moved: boolean;
  }>({
    isDragging: false,
    draggedNodeId: null,
    startX: 0,
    startY: 0,
    moved: false,
  });

  const graphPayload = useMemo(
    () =>
      projectKnowledgeGraph(projects, issues, {
        projectIdFilter: projectFilter,
        hideCompleted,
        onlyBlockingLinks,
        searchQuery,
      }),
    [projects, issues, projectFilter, hideCompleted, onlyBlockingLinks, searchQuery]
  );

  const simNodesRef = useRef<SimNode[]>([]);
  const projectedCoordsRef = useRef<
    Map<string, { sx: number; sy: number; scale: number; zDepth: number }>
  >(new Map());

  // Observe theme changes on <html data-theme="...">
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new MutationObserver(() => {
      setThemeTick((t) => t + 1);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // Initialize simulation coordinates (Fibonacci sphere for 3D + radial rings for 2D)
  useEffect(() => {
    const count = Math.max(1, graphPayload.nodes.length);
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    simNodesRef.current = graphPayload.nodes.map((node, index) => {
      // Fibonacci sphere coordinates for 3D Globe
      const yNorm = 1 - (index / Math.max(1, count - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - yNorm * yNorm));
      const theta = goldenAngle * index;
      const phi = Math.acos(Math.max(-1, Math.min(1, yNorm)));

      // 2D initial positions
      const angle2D = (index / count) * Math.PI * 2;
      const dist2D =
        node.type === "PROJECT"
          ? 60
          : node.type === "EPIC"
            ? 145
            : 215 + (index % 3) * 28;

      return {
        ...node,
        x: Math.cos(angle2D) * dist2D,
        y: Math.sin(angle2D) * dist2D,
        z: radiusAtY * Math.sin(theta) * 220,
        vx: 0,
        vy: 0,
        theta,
        phi,
      };
    });
  }, [graphPayload]);

  const connectedNeighbors = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const link of graphPayload.links) {
      if (!map.has(link.source)) map.set(link.source, new Set());
      if (!map.has(link.target)) map.set(link.target, new Set());
      map.get(link.source)!.add(link.target);
      map.get(link.target)!.add(link.source);
    }
    return map;
  }, [graphPayload.links]);

  const hoveredNode = useMemo(
    () => graphPayload.nodes.find((n) => n.id === hoveredNodeId) || null,
    [graphPayload.nodes, hoveredNodeId]
  );

  const resetCamera = useCallback(() => {
    rotationRef.current = { rotX: 0.25, rotY: 0.4 };
    panZoomRef.current = { panX: 0, panY: 0, zoom: 1 };
  }, []);

  // Main 60 FPS Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const renderFrame = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (
        canvas.width !== Math.floor(rect.width * dpr) ||
        canvas.height !== Math.floor(rect.height * dpr)
      ) {
        canvas.width = Math.floor(rect.width * dpr);
        canvas.height = Math.floor(rect.height * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2 + panZoomRef.current.panX;
      const centerY = height / 2 + panZoomRef.current.panY;
      const zoom = panZoomRef.current.zoom;

      ctx.clearRect(0, 0, width, height);

      const colorBaseContent = dcColor("base-content", "#334155");
      const colorBase300 = dcColor("base-300", "#cbd5e1");
      const colorBase100 = dcColor("base-100", "#ffffff");
      const colorPrimary = dcColor("primary", "#6366f1");

      const nodes = simNodesRef.current;
      const links = graphPayload.links;
      const nodeById = new Map<string, SimNode>();
      for (const n of nodes) nodeById.set(n.id, n);

      if (viewMode === "GLOBE_3D") {
        if (autoRotate && !dragStateRef.current.isDragging) {
          rotationRef.current.rotY += 0.0035;
        }

        const globeRadius = Math.min(width, height) * 0.34 * zoom * (repulsionStrength / 65);
        const cosY = Math.cos(rotationRef.current.rotY);
        const sinY = Math.sin(rotationRef.current.rotY);
        const cosX = Math.cos(rotationRef.current.rotX);
        const sinX = Math.sin(rotationRef.current.rotX);

        // Draw subtle latitude/longitude wireframe rings for the 3D Globe
        ctx.save();
        ctx.strokeStyle = colorBase300;
        ctx.globalAlpha = 0.28;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, globeRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(
          centerX,
          centerY,
          globeRadius,
          Math.abs(globeRadius * Math.sin(rotationRef.current.rotX + 0.35)),
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();

        projectedCoordsRef.current.clear();

        for (const node of nodes) {
          const rMultiplier =
            node.type === "PROJECT" ? 0.55 : node.type === "EPIC" ? 0.85 : 1.0;
          const r = globeRadius * rMultiplier;

          const rawX = r * Math.sin(node.phi) * Math.cos(node.theta);
          const rawY = r * Math.cos(node.phi);
          const rawZ = r * Math.sin(node.phi) * Math.sin(node.theta);

          // Rotate around Y then X
          const x1 = rawX * cosY - rawZ * sinY;
          const z1 = rawZ * cosY + rawX * sinY;
          const y2 = rawY * cosX - z1 * sinX;
          const z2 = z1 * cosX + rawY * sinX;

          const perspective = 620 / (620 - z2);
          const sx = centerX + x1 * perspective;
          const sy = centerY + y2 * perspective;

          projectedCoordsRef.current.set(node.id, {
            sx,
            sy,
            scale: Math.max(0.45, perspective),
            zDepth: z2,
          });
        }
      } else {
        // 2D Force-Directed Physics Step
        const repulse = (repulsionStrength / 50) * 1400;

        for (let i = 0; i < nodes.length; i++) {
          const nA = nodes[i];
          // Center gravity
          nA.vx += -nA.x * 0.008;
          nA.vy += -nA.y * 0.008;

          for (let j = i + 1; j < nodes.length; j++) {
            const nB = nodes[j];
            const dx = nB.x - nA.x;
            const dy = nB.y - nA.y;
            const distSq = dx * dx + dy * dy + 80;
            const dist = Math.sqrt(distSq);
            const force = repulse / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            nA.vx -= fx;
            nA.vy -= fy;
            nB.vx += fx;
            nB.vy += fy;
          }
        }

        for (const link of links) {
          const src = nodeById.get(link.source);
          const tgt = nodeById.get(link.target);
          if (!src || !tgt) continue;
          const dx = tgt.x - src.x;
          const dy = tgt.y - src.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist =
            link.type === "BELONGS_TO_PROJECT"
              ? 110
              : link.type === "BELONGS_TO_EPIC"
                ? 85
                : 75;
          const spring = (dist - targetDist) * 0.025;
          const fx = (dx / dist) * spring;
          const fy = (dy / dist) * spring;
          src.vx += fx;
          src.vy += fy;
          tgt.vx -= fx;
          tgt.vy -= fy;
        }

        projectedCoordsRef.current.clear();
        for (const node of nodes) {
          if (dragStateRef.current.draggedNodeId !== node.id) {
            node.vx *= 0.82;
            node.vy *= 0.82;
            node.x += node.vx;
            node.y += node.vy;
          }
          projectedCoordsRef.current.set(node.id, {
            sx: centerX + node.x * zoom,
            sy: centerY + node.y * zoom,
            scale: zoom,
            zDepth: 0,
          });
        }
      }

      // Draw Links
      for (const link of links) {
        const pSrc = projectedCoordsRef.current.get(link.source);
        const pTgt = projectedCoordsRef.current.get(link.target);
        if (!pSrc || !pTgt) continue;

        const isHighlighted =
          hoveredNodeId === link.source || hoveredNodeId === link.target;
        const isDimmed = hoveredNodeId !== null && !isHighlighted;

        ctx.save();
        ctx.beginPath();
        if (link.dashed) {
          ctx.setLineDash([5, 4]);
        }
        ctx.strokeStyle = dcColor(link.colorToken as DaisyColorToken, colorBase300);
        ctx.lineWidth = isHighlighted ? 2.4 : link.type === "BLOCKS" ? 1.8 : 1.1;
        ctx.globalAlpha = isDimmed
          ? 0.1
          : isHighlighted
            ? 0.95
            : viewMode === "GLOBE_3D" && pSrc.zDepth < -40 && pTgt.zDepth < -40
              ? 0.22
              : 0.52;

        ctx.moveTo(pSrc.sx, pSrc.sy);
        ctx.lineTo(pTgt.sx, pTgt.sy);
        ctx.stroke();
        ctx.restore();
      }

      // Sort nodes by zDepth so front nodes render on top in 3D Globe mode
      const sortedNodes = [...nodes].sort((a, b) => {
        const pA = projectedCoordsRef.current.get(a.id);
        const pB = projectedCoordsRef.current.get(b.id);
        return (pA?.zDepth || 0) - (pB?.zDepth || 0);
      });

      // Draw Nodes
      for (const node of sortedNodes) {
        const proj = projectedCoordsRef.current.get(node.id);
        if (!proj) continue;

        const isHovered = hoveredNodeId === node.id;
        const isNeighbor =
          hoveredNodeId !== null &&
          connectedNeighbors.get(hoveredNodeId)?.has(node.id);
        const isDimmed =
          hoveredNodeId !== null && !isHovered && !isNeighbor;

        const nodeColor = dcColor(node.colorToken as DaisyColorToken, colorPrimary);
        const r =
          node.radius *
          proj.scale *
          (isHovered ? 1.28 : isNeighbor ? 1.12 : 1.0);

        ctx.save();
        const depthAlpha =
          viewMode === "GLOBE_3D" && proj.zDepth < -60 ? 0.45 : 0.95;
        ctx.globalAlpha = isDimmed ? 0.16 : isHovered ? 1 : depthAlpha;

        // Halo for hovered node or PROJECT anchor nodes
        if (isHovered || node.type === "PROJECT") {
          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, r + (isHovered ? 7 : 4), 0, Math.PI * 2);
          ctx.fillStyle = nodeColor;
          ctx.globalAlpha = isHovered ? 0.28 : 0.14;
          ctx.fill();
        }

        ctx.globalAlpha = isDimmed ? 0.18 : isHovered ? 1 : depthAlpha;
        ctx.beginPath();
        ctx.arc(proj.sx, proj.sy, r, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        ctx.strokeStyle = colorBase100;
        ctx.stroke();

        // Key label
        if (proj.scale > 0.62 || isHovered || node.type === "PROJECT") {
          ctx.font = `${isHovered || node.type === "PROJECT" ? "600" : "500"} ${Math.round(
            11 * Math.min(1.15, Math.max(0.85, proj.scale))
          )}px sans-serif`;
          ctx.fillStyle = colorBaseContent;
          ctx.textAlign = "center";
          ctx.fillText(node.key, proj.sx, proj.sy + r + 13);
        }

        ctx.restore();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    animationFrameId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    graphPayload,
    viewMode,
    repulsionStrength,
    autoRotate,
    hoveredNodeId,
    connectedNeighbors,
    themeTick,
  ]);

  // Pointer handlers for rotation, pan, hover, and click
  const findNodeAtPointer = (clientX: number, clientY: number): SimNode | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;

    const nodes = [...simNodesRef.current].reverse();
    for (const node of nodes) {
      const proj = projectedCoordsRef.current.get(node.id);
      if (!proj) continue;
      const r = node.radius * proj.scale + 6;
      const dx = px - proj.sx;
      const dy = py - proj.sy;
      if (dx * dx + dy * dy <= r * r) {
        return node;
      }
    }
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const hit = findNodeAtPointer(e.clientX, e.clientY);
    dragStateRef.current = {
      isDragging: true,
      draggedNodeId: hit && viewMode === "FORCE_2D" ? hit.id : null,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const hit = findNodeAtPointer(e.clientX, e.clientY);
    setHoveredNodeId(hit ? hit.id : null);

    if (!dragStateRef.current.isDragging) return;

    const dx = e.clientX - dragStateRef.current.startX;
    const dy = e.clientY - dragStateRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragStateRef.current.moved = true;
    }

    if (viewMode === "GLOBE_3D") {
      rotationRef.current.rotY += dx * 0.007;
      rotationRef.current.rotX = Math.max(
        -1.3,
        Math.min(1.3, rotationRef.current.rotX + dy * 0.007)
      );
    } else if (dragStateRef.current.draggedNodeId) {
      const node = simNodesRef.current.find(
        (n) => n.id === dragStateRef.current.draggedNodeId
      );
      if (node) {
        node.x += dx / panZoomRef.current.zoom;
        node.y += dy / panZoomRef.current.zoom;
        node.vx = 0;
        node.vy = 0;
      }
    } else {
      panZoomRef.current.panX += dx;
      panZoomRef.current.panY += dy;
    }

    dragStateRef.current.startX = e.clientX;
    dragStateRef.current.startY = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const wasClick = !dragStateRef.current.moved;
    dragStateRef.current.isDragging = false;
    dragStateRef.current.draggedNodeId = null;

    if (wasClick) {
      const hit = findNodeAtPointer(e.clientX, e.clientY);
      if (!hit) return;
      if (hit.type === "PROJECT") {
        onSelectProject?.(hit.id);
      } else {
        const foundIssue = issues.find((i) => i.id === hit.id);
        if (foundIssue) {
          onSelectIssue(foundIssue);
        }
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    panZoomRef.current.zoom = Math.max(
      0.55,
      Math.min(2.2, panZoomRef.current.zoom * factor)
    );
  };

  return (
    <section
      className="card bg-base-100 border border-base-300 shadow-xs"
      aria-labelledby="obsidian-graph-title"
    >
      <div className="card-body p-4 gap-4">
        {/* Top Header & Controls Bar */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" aria-hidden="true" />
              <h2 id="obsidian-graph-title" className="card-title text-base">
                Cartographie Globale & Globe des Tâches
              </h2>
              <span className="badge badge-primary badge-soft badge-sm">
                {graphPayload.nodes.length} nœuds · {graphPayload.links.length} liens
              </span>
            </div>
            <p className="text-xs text-base-content/70 mt-0.5">
              Faites pivoter le globe 3D ou survolez un nœud pour illuminer ses dépendances. Cliquez sur un ticket pour l&apos;inspecter.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 3D Globe vs 2D Force Graph Switcher */}
            <div className="join" role="group" aria-label="Mode de visualisation">
              <button
                type="button"
                onClick={() => setViewMode("GLOBE_3D")}
                className={`btn btn-xs join-item gap-1.5 ${
                  viewMode === "GLOBE_3D" ? "btn-primary" : "btn-ghost bg-base-200"
                }`}
              >
                <Globe className="size-3.5" aria-hidden="true" />
                Globe 3D
              </button>
              <button
                type="button"
                onClick={() => setViewMode("FORCE_2D")}
                className={`btn btn-xs join-item gap-1.5 ${
                  viewMode === "FORCE_2D" ? "btn-primary" : "btn-ghost bg-base-200"
                }`}
              >
                <Network className="size-3.5" aria-hidden="true" />
                Graphe 2D
              </button>
            </div>

            {/* Project Filter */}
            <select
              className="select select-xs bg-base-100"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              aria-label="Filtrer le graphe par projet"
            >
              <option value="ALL">Tous les projets ({projects.length})</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.key}] {p.name}
                </option>
              ))}
            </select>

            {/* Search node */}
            <label className="input input-xs flex items-center gap-1.5 w-44">
              <Search className="size-3.5 text-base-content/60" aria-hidden="true" />
              <input
                type="search"
                placeholder="Filtrer nœud (ex: CORE-4)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Rechercher un nœud dans le graphe"
              />
            </label>

            <button
              type="button"
              onClick={resetCamera}
              className="btn btn-ghost btn-xs gap-1"
              aria-label="Réinitialiser la caméra du graphe"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Recadrer
            </button>
          </div>
        </header>

        {/* Secondary Physics & Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-base-200/70 px-3 py-2 rounded-box text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <label className="label cursor-pointer gap-2 p-0">
              <input
                type="checkbox"
                className="checkbox checkbox-xs checkbox-primary"
                checked={hideCompleted}
                onChange={(e) => setHideCompleted(e.target.checked)}
              />
              <span>Masquer les tickets terminés</span>
            </label>

            <label className="label cursor-pointer gap-2 p-0">
              <input
                type="checkbox"
                className="checkbox checkbox-xs checkbox-error"
                checked={onlyBlockingLinks}
                onChange={(e) => setOnlyBlockingLinks(e.target.checked)}
              />
              <span>Liens bloquants uniquement</span>
            </label>

            {viewMode === "GLOBE_3D" && (
              <label className="label cursor-pointer gap-2 p-0">
                <input
                  type="checkbox"
                  className="toggle toggle-xs toggle-primary"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                />
                <span>Rotation orbitale auto</span>
              </label>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="size-3.5 text-base-content/60" aria-hidden="true" />
            <span>Expansion / Répulsion :</span>
            <input
              type="range"
              min={35}
              max={110}
              value={repulsionStrength}
              onChange={(e) => setRepulsionStrength(Number(e.target.value))}
              className="range range-primary range-xs w-28"
              aria-label="Force de répulsion du graphe"
            />
          </div>
        </div>

        {/* Interactive Canvas Container */}
        <div className="relative h-[520px] w-full rounded-box bg-base-200/50 border border-base-300 overflow-hidden">
          {graphPayload.nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center p-6">
              <Compass className="size-8 text-base-content/40" aria-hidden="true" />
              <p className="font-medium text-sm">
                Aucun nœud ne correspond aux filtres sélectionnés
              </p>
              <p className="text-xs text-base-content/60">
                Réinitialisez la recherche ou affichez les tickets terminés.
              </p>
              <button
                type="button"
                onClick={() => {
                  setProjectFilter("ALL");
                  setHideCompleted(false);
                  setOnlyBlockingLinks(false);
                  setSearchQuery("");
                }}
                className="btn btn-primary btn-xs mt-1"
              >
                Réinitialiser les filtres du graphe
              </button>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
              role="img"
              aria-label={`Graphe relationnel interactif contenant ${graphPayload.nodes.length} nœuds et ${graphPayload.links.length} connexions`}
              className="w-full h-full cursor-grab active:cursor-grabbing block"
            />
          )}

          {/* Hovered Node Floating Inspector Card */}
          {hoveredNode && (
            <div className="absolute top-3 right-3 card bg-base-100/95 backdrop-blur-xs border border-base-300 shadow-md p-3 max-w-xs pointer-events-none">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-primary">
                  {hoveredNode.key}
                </span>
                {hoveredNode.type !== "PROJECT" ? (
                  <IssueTypeBadge type={hoveredNode.type} />
                ) : (
                  <span className="badge badge-primary badge-xs">Projet</span>
                )}
              </div>
              <p className="text-xs font-semibold text-base-content line-clamp-2">
                {hoveredNode.label}
              </p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-base-300">
                <IssueStatusBadge status={hoveredNode.statusCategory} />
                {hoveredNode.priority !== "NONE" && (
                  <IssuePriorityBadge priority={hoveredNode.priority} />
                )}
                {hoveredNode.storyPoints > 0 && (
                  <span className="badge badge-neutral badge-xs tabular-nums">
                    {hoveredNode.storyPoints} SP
                  </span>
                )}
              </div>
              <p className="text-[11px] text-base-content/60 mt-1.5 flex items-center gap-1">
                <Eye className="size-3" aria-hidden="true" />
                {hoveredNode.degree} connexion(s) · Cliquez pour ouvrir
              </p>
            </div>
          )}

          {/* Bottom Legend Strip */}
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 bg-base-100/90 backdrop-blur-xs border border-base-300 px-3 py-1.5 rounded-box text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="status status-primary"></span>
                <span>Projet</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="status status-secondary"></span>
                <span>Epic</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="status status-info"></span>
                <span>Story / Tâche</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="status status-error"></span>
                <span>Bug / Bloquant</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="status status-success"></span>
                <span>Terminé</span>
              </span>
            </div>
            <span className="text-base-content/60 hidden sm:inline">
              Molette : Zoom · Glisser : Rotation 3D / Pan
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

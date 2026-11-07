"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { GanttItem, Issue, Project, User } from "@/domain/entities";
import type {
  CreateGanttItemInput,
  ExternalDependencyCategory,
  GanttDependencyType,
  GanttItemType,
} from "@/lib/validations/jira-schema";
import {
  computeGanttTimeline,
  type PositionedGanttItem,
} from "@/domain/services/gantt-engine";
import {
  computeGanttArrowGeometry,
  exportGanttChart,
  type GanttExportFormat,
} from "@/lib/export/gantt-exporter";
import { useToast } from "@/components/providers/toast-provider";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
  AlertTriangle,
  ArrowRight,
  CalendarRange,
  CheckCircle2,
  Cpu,
  Diamond,
  Download,
  ExternalLink,
  FileCode2,
  FileImage,
  FileText,
  Flag,
  Flame,
  FolderKanban,
  GitCommitHorizontal,
  Layers,
  Megaphone,
  Pencil,
  Plus,
  Scale,
  Server,
  Trash2,
  Truck,
  X,
} from "lucide-react";

interface GanttViewProps {
  project: Project;
  ganttItems: GanttItem[];
  issues: Issue[];
  users: User[];
  currentUserId: string;
  onCreateGanttItem: (input: CreateGanttItemInput) => Promise<boolean>;
  onUpdateGanttItem: (
    ganttId: string,
    patch: Partial<
      Pick<
        GanttItem,
        | "title"
        | "wbsCode"
        | "startDate"
        | "endDate"
        | "progress"
        | "isCritical"
        | "externalProvider"
      >
    >
  ) => Promise<void>;
  onDeleteGanttItem: (ganttId: string) => Promise<void>;
  onSelectIssue: (issue: Issue) => void;
  onNavigateToBoard: () => void;
  canEdit?: boolean;
}

const EXTERNAL_CATEGORY_META: Record<
  ExternalDependencyCategory,
  { label: string; badgeClass: string }
> = {
  MARKETING: {
    label: "Marketing & Comm.",
    badgeClass: "badge-secondary badge-soft",
  },
  MATERIEL: {
    label: "Matériel & Équipement",
    badgeClass: "badge-warning badge-soft",
  },
  JURIDIQUE: {
    label: "Juridique & Homologation",
    badgeClass: "badge-error badge-soft",
  },
  FOURNISSEUR: {
    label: "Fournisseur Tiers",
    badgeClass: "badge-accent badge-soft",
  },
  INFRASTRUCTURE: {
    label: "Infra & Cloud",
    badgeClass: "badge-info badge-soft",
  },
};

function ExternalCategoryIcon({
  category,
}: {
  category?: ExternalDependencyCategory | null;
}) {
  switch (category) {
    case "MARKETING":
      return <Megaphone className="size-3" aria-hidden="true" />;
    case "MATERIEL":
      return <Cpu className="size-3" aria-hidden="true" />;
    case "JURIDIQUE":
      return <Scale className="size-3" aria-hidden="true" />;
    case "INFRASTRUCTURE":
      return <Server className="size-3" aria-hidden="true" />;
    default:
      return <Truck className="size-3" aria-hidden="true" />;
  }
}

export function GanttView({
  project,
  ganttItems,
  issues,
  users,
  currentUserId,
  onCreateGanttItem,
  onUpdateGanttItem,
  onDeleteGanttItem,
  onSelectIssue,
  onNavigateToBoard,
  canEdit = true,
}: GanttViewProps) {
  const { notifySuccess, notifyError } = useToast();
  const [typeFilter, setTypeFilter] = useState<GanttItemType | "ALL">("ALL");
  const [onlyCriticalPath, setOnlyCriticalPath] = useState<boolean>(false);
  const [showDependencyArrows, setShowDependencyArrows] =
    useState<boolean>(true);
  const [zoomMode, setZoomMode] = useState<"STANDARD" | "WIDE">("STANDARD");
  const [exportingFormat, setExportingFormat] =
    useState<GanttExportFormat | null>(null);

  // Modal de création d'une étape Gantt
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [newType, setNewType] = useState<GanttItemType>("EPIC");
  const [newWbsCode, setNewWbsCode] = useState<string>("3.0");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newExtCategory, setNewExtCategory] =
    useState<ExternalDependencyCategory>("MARKETING");
  const [newExtProvider, setNewExtProvider] = useState<string>("");
  const [newStartDate, setNewStartDate] = useState<string>("2026-11-05");
  const [newEndDate, setNewEndDate] = useState<string>("2026-11-18");
  const [newProgress, setNewProgress] = useState<number>(0);
  const [newOwnerId, setNewOwnerId] = useState<string>(currentUserId);
  const [newPredecessorId, setNewPredecessorId] = useState<string>("");
  const [newDepType, setNewDepType] = useState<GanttDependencyType>("FS");
  const [newIsCritical, setNewIsCritical] = useState<boolean>(true);
  const [autoCreateEpic, setAutoCreateEpic] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Édition rapide d'une ligne Gantt sélectionnée
  const [editingItem, setEditingItem] = useState<PositionedGanttItem | null>(
    null
  );
  const [itemToDelete, setItemToDelete] = useState<PositionedGanttItem | null>(
    null
  );

  const projection = useMemo(
    () => computeGanttTimeline(ganttItems, issues),
    [ganttItems, issues]
  );

  const filteredItems = useMemo(() => {
    return projection.items.filter((item) => {
      if (typeFilter !== "ALL" && item.type !== typeFilter) return false;
      if (onlyCriticalPath && !item.isCritical) return false;
      return true;
    });
  }, [projection.items, typeFilter, onlyCriticalPath]);

  const itemIndexMap = useMemo(() => {
    const map = new Map<string, { index: number; item: PositionedGanttItem }>();
    filteredItems.forEach((it, idx) => {
      map.set(it.id, { index: idx, item: it });
    });
    return map;
  }, [filteredItems]);

  const timelineContainerRef = useRef<HTMLDivElement | null>(null);
  const [timelineWidth, setTimelineWidth] = useState<number>(880);

  useEffect(() => {
    const el = timelineContainerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 100) setTimelineWidth(Math.round(w));
    };
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => measure());
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [zoomMode, filteredItems.length]);

  const handleOpenPresetCreate = (presetType: GanttItemType) => {
    setNewType(presetType);
    if (presetType === "EPIC") {
      setNewWbsCode(`${projection.summary.epicsCount + 1}.0`);
      setNewStartDate("2026-11-05");
      setNewEndDate("2026-11-19");
    } else if (presetType === "MILESTONE") {
      setNewWbsCode(`M${projection.summary.milestonesCount + 1}`);
      setNewStartDate("2026-11-20");
      setNewEndDate("2026-11-20");
    } else if (presetType === "EXTERNAL_DEPENDENCY") {
      setNewWbsCode(`EXT-${projection.summary.externalDepsCount + 1}`);
      setNewStartDate("2026-11-06");
      setNewEndDate("2026-11-16");
    } else {
      setNewWbsCode(`1.${projection.items.length + 1}`);
      setNewStartDate("2026-11-06");
      setNewEndDate("2026-11-14");
    }
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const ok = await onCreateGanttItem({
        projectId: project.id,
        wbsCode: newWbsCode,
        title: newTitle,
        type: newType,
        externalCategory:
          newType === "EXTERNAL_DEPENDENCY" ? newExtCategory : null,
        externalProvider:
          newType === "EXTERNAL_DEPENDENCY" ? newExtProvider : "",
        startDate: newStartDate,
        endDate: newType === "MILESTONE" ? newStartDate : newEndDate,
        progress: newType === "MILESTONE" ? 0 : newProgress,
        ownerId: newOwnerId || null,
        predecessorId: newPredecessorId || null,
        dependencyType: newDepType,
        isCritical: newIsCritical,
        autoCreateEpicIssue: newType === "EPIC" ? autoCreateEpic : false,
      });
      if (ok) {
        setNewTitle("");
        setNewExtProvider("");
        setNewPredecessorId("");
        setIsCreateOpen(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      await onUpdateGanttItem(editingItem.id, {
        title: editingItem.title,
        wbsCode: editingItem.wbsCode,
        startDate: editingItem.startDate,
        endDate:
          editingItem.type === "MILESTONE"
            ? editingItem.startDate
            : editingItem.endDate,
        progress: editingItem.progress,
        isCritical: editingItem.isCritical,
        externalProvider: editingItem.externalProvider,
      });
      setEditingItem(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async (format: GanttExportFormat) => {
    if (exportingFormat) return;
    setExportingFormat(format);
    try {
      const filename = await exportGanttChart(format, {
        project,
        projection,
        items: filteredItems,
        users,
        showDependencyArrows,
      });
      notifySuccess(
        `Export ${format} terminé`,
        `Le fichier ${filename} a été téléchargé.`
      );
    } catch (err) {
      notifyError(
        `Échec de l'export ${format}`,
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setExportingFormat(null);
    }
  };

  const ROW_HEIGHT = 52;

  return (
    <div className="space-y-5">
      {/* Bandeau méthodologique : Étape 1 du cycle de vie projet */}
      <section
        className="card bg-base-100 border border-base-300 shadow-xs"
        aria-label="Synthèse de planification Gantt"
      >
        <div className="card-body p-4 gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="badge badge-primary badge-sm font-bold">
                  Étape 1 · Planification Macro
                </span>
                <h2 className="text-base font-bold text-base-content flex items-center gap-2">
                  <CalendarRange
                    className="size-5 text-primary"
                    aria-hidden="true"
                  />
                  Diagramme de Gantt & Feuille de Route Directrice —{" "}
                  {project.name}
                </h2>
              </div>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Structurez d&apos;abord votre projet selon les normes WBS : planifiez vos{" "}
                <strong>Epics (grandes fonctionnalités)</strong>, positionnez vos{" "}
                <strong>Jalons majeurs (livraisons ◆)</strong> et intégrez vos{" "}
                <strong>Dépendances externes (Marketing, Matériel, Juridique, Fournisseurs)</strong>.
                Chaque Epic créé ici est automatiquement synchronisé avec votre Backlog Scrum et votre Tableau Kanban.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {canEdit && (
                <button
                  type="button"
                  onClick={() => handleOpenPresetCreate("EPIC")}
                  className="btn btn-primary btn-sm gap-1.5"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Ajouter au Gantt
                </button>
              )}

              {/* Barre d'exportation directe PDF, WEBP, JPG, SVG */}
              <div
                className="join border border-base-300 rounded-field"
                role="group"
                aria-label="Exporter le diagramme de Gantt"
              >
                <span className="join-item bg-base-200/80 px-2.5 flex items-center gap-1.5 text-xs font-semibold text-base-content/80">
                  <Download className="size-3.5 text-primary" aria-hidden="true" />
                  Exporter :
                </span>
                <button
                  type="button"
                  disabled={exportingFormat !== null}
                  onClick={() => void handleExport("PDF")}
                  className="btn btn-ghost btn-sm join-item gap-1 text-xs font-bold"
                  title="Exporter le diagramme de Gantt en PDF Paysage haute résolution"
                >
                  <FileText className="size-3.5 text-error" aria-hidden="true" />
                  {exportingFormat === "PDF" ? "PDF…" : "PDF"}
                </button>
                <button
                  type="button"
                  disabled={exportingFormat !== null}
                  onClick={() => void handleExport("WEBP")}
                  className="btn btn-ghost btn-sm join-item gap-1 text-xs font-bold"
                  title="Exporter le diagramme de Gantt en image WEBP haute définition"
                >
                  <FileImage className="size-3.5 text-secondary" aria-hidden="true" />
                  {exportingFormat === "WEBP" ? "WEBP…" : "WEBP"}
                </button>
                <button
                  type="button"
                  disabled={exportingFormat !== null}
                  onClick={() => void handleExport("JPG")}
                  className="btn btn-ghost btn-sm join-item gap-1 text-xs font-bold"
                  title="Exporter le diagramme de Gantt en image JPG haute définition"
                >
                  <FileImage className="size-3.5 text-info" aria-hidden="true" />
                  {exportingFormat === "JPG" ? "JPG…" : "JPG"}
                </button>
                <button
                  type="button"
                  disabled={exportingFormat !== null}
                  onClick={() => void handleExport("SVG")}
                  className="btn btn-ghost btn-sm join-item gap-1 text-xs font-bold"
                  title="Exporter le diagramme de Gantt en fichier vectoriel SVG"
                >
                  <FileCode2 className="size-3.5 text-success" aria-hidden="true" />
                  {exportingFormat === "SVG" ? "SVG…" : "SVG"}
                </button>
              </div>

              <button
                type="button"
                onClick={onNavigateToBoard}
                className="btn btn-ghost btn-sm border border-base-300 gap-1.5"
              >
                <FolderKanban className="size-4 text-primary" aria-hidden="true" />
                Passer au Tableau Kanban
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* KPIs du Diagramme de Gantt */}
          <div className="stats stats-vertical sm:stats-horizontal bg-base-200/60 border border-base-300 w-full">
            <div className="stat py-2.5 px-4">
              <div className="stat-figure text-primary">
                <Layers className="size-5" aria-hidden="true" />
              </div>
              <div className="stat-title text-xs">
                Epics (Grandes fonctionnalités)
              </div>
              <div className="stat-value text-lg text-primary tabular-nums">
                {projection.summary.epicsCount} Epics
              </div>
              <div className="stat-desc text-[11px]">
                Synchronisés avec le Backlog & Kanban
              </div>
            </div>

            <div className="stat py-2.5 px-4">
              <div className="stat-figure text-secondary">
                <Diamond className="size-5" aria-hidden="true" />
              </div>
              <div className="stat-title text-xs">
                Jalons Majeurs (Livraisons ◆)
              </div>
              <div className="stat-value text-lg text-secondary tabular-nums">
                {projection.summary.milestonesCount} Jalons
              </div>
              <div className="stat-desc text-[11px]">
                Points de contrôle & mises en production
              </div>
            </div>

            <div className="stat py-2.5 px-4">
              <div className="stat-figure text-warning">
                <Truck className="size-5" aria-hidden="true" />
              </div>
              <div className="stat-title text-xs">
                Dépendances Externes
              </div>
              <div className="stat-value text-lg text-warning tabular-nums">
                {projection.summary.externalDepsCount} Contraintes
              </div>
              <div className="stat-desc text-[11px]">
                Marketing, Matériel, Juridique & Tiers
              </div>
            </div>

            <div className="stat py-2.5 px-4">
              <div className="stat-figure text-error">
                <Flame className="size-5" aria-hidden="true" />
              </div>
              <div className="stat-title text-xs">
                Chemin Critique (CPM) & Avancement
              </div>
              <div className="stat-value text-lg tabular-nums flex items-center gap-2">
                <span>{projection.summary.overallProgress} %</span>
                <span className="badge badge-error badge-soft badge-xs">
                  {projection.summary.criticalCount} critiques
                </span>
              </div>
              <div className="stat-desc text-[11px]">
                Période : {projection.minDate} → {projection.maxDate}
              </div>
            </div>
          </div>

          {/* Barre de raccourcis de création normée + Filtres */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-base-300">
            {/* Boutons d'ajout rapide par norme Gantt (Éditeur & Admin uniquement) */}
            {canEdit ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-base-content/70 mr-1">
                  Insertion rapide :
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenPresetCreate("EPIC")}
                  className="btn btn-xs btn-soft btn-primary gap-1"
                >
                  <Layers className="size-3" aria-hidden="true" />+ Epic
                  (Fonctionnalité)
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenPresetCreate("MILESTONE")}
                  className="btn btn-xs btn-soft btn-secondary gap-1"
                >
                  <Flag className="size-3" aria-hidden="true" />+ Jalon Majeur
                  (Livraison ◆)
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenPresetCreate("EXTERNAL_DEPENDENCY")}
                  className="btn btn-xs btn-soft btn-warning gap-1"
                >
                  <Megaphone className="size-3" aria-hidden="true" />+ Dépendance
                  Externe (Marketing / Matériel)
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-base-content/70">
                <span className="badge badge-ghost badge-sm font-semibold">
                  Mode Visiteur · Lecture seule
                </span>
                <span>
                  Consultation et exportation du diagramme autorisées sans modification.
                </span>
              </div>
            )}

            {/* Filtres & Options d'affichage */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="join" role="group" aria-label="Filtrer par type d'élément Gantt">
                {(
                  [
                    { id: "ALL", label: "Tout" },
                    { id: "EPIC", label: "Epics" },
                    { id: "MILESTONE", label: "Jalons ◆" },
                    { id: "EXTERNAL_DEPENDENCY", label: "Externe" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTypeFilter(tab.id)}
                    className={`btn btn-xs join-item ${
                      typeFilter === tab.id
                        ? "btn-primary"
                        : "btn-ghost bg-base-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <label className="label cursor-pointer gap-1.5 p-0">
                <input
                  type="checkbox"
                  className="toggle toggle-error toggle-xs"
                  checked={onlyCriticalPath}
                  onChange={(e) => setOnlyCriticalPath(e.target.checked)}
                />
                <span className="font-medium">Chemin critique seul</span>
              </label>

              <label className="label cursor-pointer gap-1.5 p-0">
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-xs"
                  checked={showDependencyArrows}
                  onChange={(e) => setShowDependencyArrows(e.target.checked)}
                />
                <span>Liens FS/SS</span>
              </label>

              <div className="join" role="group" aria-label="Zoom temporel">
                <button
                  type="button"
                  onClick={() => setZoomMode("STANDARD")}
                  className={`btn btn-xs join-item ${
                    zoomMode === "STANDARD"
                      ? "btn-neutral"
                      : "btn-ghost bg-base-200"
                  }`}
                >
                  Vue globale
                </button>
                <button
                  type="button"
                  onClick={() => setZoomMode("WIDE")}
                  className={`btn btn-xs join-item ${
                    zoomMode === "WIDE"
                      ? "btn-neutral"
                      : "btn-ghost bg-base-200"
                  }`}
                >
                  Zoom détaillé
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grille Principale du Diagramme de Gantt (Colonne Gauche Épurée + Frise Chronologique à droite) */}
      <section
        className="card bg-base-100 border border-base-300 shadow-xs overflow-hidden"
        aria-label="Diagramme de Gantt WBS et Frise Chronologique"
      >
        <div className="overflow-x-auto">
          <div
            className={
              zoomMode === "WIDE" ? "min-w-[1280px]" : "min-w-[960px]"
            }
          >
            {/* En-tête du Diagramme : Colonne Gauche Épurée (4/12) + Échelle des Semaines (8/12) */}
            <div className="grid grid-cols-12 bg-base-200/80 border-b border-base-300 text-xs font-bold">
              <div className="col-span-4 flex items-center justify-between px-3.5 py-2.5 border-r border-base-300 gap-2">
                <span>Étape</span>
                <span className="text-right text-base-content/70">
                  Avancement
                </span>
              </div>

              <div className="col-span-8 relative h-10 flex items-center select-none">
                {projection.weeks.map((wk) => (
                  <div
                    key={wk.startDate}
                    style={{
                      left: `${wk.leftPercent}%`,
                      width: `${wk.widthPercent}%`,
                    }}
                    className="absolute top-0 bottom-0 border-r border-base-300/70 px-2 flex flex-col justify-center overflow-hidden"
                  >
                    <span className="text-[11px] font-bold text-base-content truncate">
                      {wk.label}
                    </span>
                    <span className="text-[10px] font-normal text-base-content/50 tabular-nums truncate">
                      {wk.startDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Corps du Diagramme de Gantt */}
            {filteredItems.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <p className="text-sm font-semibold">
                  Aucune étape Gantt ne correspond aux filtres sélectionnés.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setTypeFilter("ALL");
                    setOnlyCriticalPath(false);
                  }}
                  className="btn btn-primary btn-xs"
                >
                  Afficher tout le diagramme
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-12 relative">
                {/* Colonne Gauche Épurée : uniquement le type (badge), l'intitulé et l'avancement */}
                <div className="col-span-4 divide-y divide-base-300/70 border-r border-base-300">
                  {filteredItems.map((item) => {
                    const linkedIssue = item.linkedIssueId
                      ? issues.find((i) => i.id === item.linkedIssueId)
                      : null;

                    return (
                      <div
                        key={item.id}
                        style={{ height: `${ROW_HEIGHT}px` }}
                        className={`group flex items-center justify-between px-3.5 gap-2 text-xs hover:bg-base-200/50 transition-colors ${
                          item.type === "EPIC"
                            ? "bg-primary/5 font-semibold"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {item.isCritical && (
                            <span
                              className="status status-error shrink-0"
                              title="Sur le Chemin Critique (CPM)"
                            />
                          )}

                          {item.type === "EPIC" && (
                            <span className="badge badge-primary badge-soft badge-xs shrink-0">
                              Epic
                            </span>
                          )}
                          {item.type === "MILESTONE" && (
                            <span className="badge badge-secondary badge-soft badge-xs shrink-0">
                              ◆ Jalon
                            </span>
                          )}
                          {item.type === "EXTERNAL_DEPENDENCY" && (
                            <span
                              className={`badge ${
                                EXTERNAL_CATEGORY_META[
                                  item.externalCategory || "MARKETING"
                                ].badgeClass
                              } badge-xs shrink-0 gap-1`}
                            >
                              <ExternalCategoryIcon
                                category={item.externalCategory}
                              />
                              Externe
                            </span>
                          )}
                          {item.type === "TASK" && (
                            <span className="badge badge-info badge-soft badge-xs shrink-0">
                              Livrable
                            </span>
                          )}

                          {canEdit ? (
                            <button
                              type="button"
                              onClick={() => setEditingItem(item)}
                              className="truncate text-left hover:text-primary cursor-pointer font-medium"
                              title={`${item.title} (${item.startDate} → ${item.endDate})`}
                            >
                              {item.title}
                            </button>
                          ) : (
                            <span
                              className="truncate text-left font-medium"
                              title={`${item.title} (${item.startDate} → ${item.endDate})`}
                            >
                              {item.title}
                            </span>
                          )}

                          {linkedIssue && (
                            <button
                              type="button"
                              onClick={() => onSelectIssue(linkedIssue)}
                              className="badge badge-ghost badge-xs font-mono shrink-0 hover:badge-primary cursor-pointer"
                              title={`Ouvrir le ticket ${linkedIssue.key}`}
                            >
                              {linkedIssue.key}
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {item.type !== "MILESTONE" ? (
                            <span className="badge badge-ghost badge-sm font-mono tabular-nums font-semibold">
                              {item.effectiveProgress}%
                            </span>
                          ) : (
                            <span className="badge badge-secondary badge-soft badge-xs font-semibold">
                              ◆ {item.startDate.slice(5)}
                            </span>
                          )}

                          {canEdit && (
                            <div className="flex items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => setEditingItem(item)}
                                className="btn btn-ghost btn-xs btn-square"
                                aria-label={`Modifier ${item.title}`}
                              >
                                <Pencil className="size-3" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setItemToDelete(item)}
                                className="btn btn-ghost btn-xs btn-square text-error/70 hover:text-error"
                                aria-label={`Supprimer ${item.title}`}
                              >
                                <Trash2 className="size-3" aria-hidden="true" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Colonne Droite : Frise Chronologique + Barres + Flèches SVG au premier plan */}
                <div
                  ref={timelineContainerRef}
                  className="col-span-8 relative select-none"
                  style={{
                    height: `${filteredItems.length * ROW_HEIGHT}px`,
                  }}
                >
                  {/* Grille verticale des semaines */}
                  {projection.weeks.map((wk) => (
                    <div
                      key={wk.startDate}
                      style={{
                        left: `${wk.leftPercent}%`,
                        width: `${wk.widthPercent}%`,
                      }}
                      className="absolute top-0 bottom-0 border-r border-base-300/40 pointer-events-none"
                    />
                  ))}

                  {/* Lignes horizontales de séparation */}
                  {filteredItems.map((item, idx) => (
                    <div
                      key={`row-bg-${item.id}`}
                      style={{
                        top: `${idx * ROW_HEIGHT}px`,
                        height: `${ROW_HEIGHT}px`,
                      }}
                      className={`absolute left-0 right-0 border-b border-base-300/60 ${
                        item.type === "EPIC" ? "bg-primary/5" : ""
                      }`}
                    />
                  ))}

                  {/* Marqueur vertical "Aujourd'hui / Date de référence" placé derrière les éléments du Gantt (z-10) */}
                  <div
                    style={{ left: `${projection.todayPercent}%` }}
                    className="absolute top-0 bottom-0 border-l-2 border-dashed border-error/70 z-10 pointer-events-none"
                  >
                    <span className="badge badge-error badge-xs -translate-x-1/2 mt-1 shadow-xs">
                      Réf. Sprint
                    </span>
                  </div>

                  {/* Calque SVG des Flèches de Dépendance en arrière-plan (z-10) derrière les barres et jalons (z-20) */}
                  {showDependencyArrows && (
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                      viewBox={`0 0 ${timelineWidth} ${filteredItems.length * ROW_HEIGHT}`}
                    >
                      {filteredItems.map((succ, succIdx) =>
                        succ.dependencies.map((dep) => {
                          const predEntry = itemIndexMap.get(dep.predecessorId);
                          if (!predEntry) return null;
                          const pred = predEntry.item;
                          const predIdx = predEntry.index;

                          const geom = computeGanttArrowGeometry(
                            pred,
                            predIdx,
                            succ,
                            succIdx,
                            dep.type,
                            timelineWidth,
                            ROW_HEIGHT,
                            0,
                            0,
                            filteredItems
                          );
                          const strokeColor = geom.isCritical
                            ? "var(--color-error)"
                            : "var(--color-primary)";

                          return (
                            <g key={`dep-${pred.id}-${succ.id}`}>
                              <path
                                d={geom.pathD}
                                fill="none"
                                stroke="var(--color-base-100)"
                                strokeWidth="4.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity="0.9"
                              />
                              <circle
                                cx={geom.startX}
                                cy={geom.startY}
                                r="3.2"
                                fill={strokeColor}
                                stroke="var(--color-base-100)"
                                strokeWidth="1.5"
                              />
                              <path
                                d={geom.pathD}
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth={geom.isCritical ? "2.4" : "1.9"}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <polygon
                                points={geom.arrowPolygonPoints}
                                fill={strokeColor}
                                stroke="var(--color-base-100)"
                                strokeWidth="1"
                                strokeLinejoin="round"
                              />
                            </g>
                          );
                        })
                      )}
                    </svg>
                  )}

                  {/* Barres et Jalons Normés au premier plan (z-20) sur fond opaque bg-base-100 pour passer devant toutes les lignes */}
                  {filteredItems.map((item, idx) => {
                    const topPx = idx * ROW_HEIGHT;

                    if (item.type === "MILESTONE") {
                      return (
                        <div
                          key={item.id}
                          style={{
                            top: `${topPx}px`,
                            height: `${ROW_HEIGHT}px`,
                            left: `${item.leftPercent}%`,
                          }}
                          className="absolute flex items-center -translate-x-2 z-20 group"
                        >
                          <button
                            type="button"
                            onClick={() => canEdit && setEditingItem(item)}
                            title={`${item.title} (${item.startDate})`}
                            className={`size-4 rotate-45 border-2 border-base-100 shadow-md cursor-pointer transition-transform group-hover:scale-125 ${
                              item.isCritical ? "bg-error" : "bg-secondary"
                            }`}
                            aria-label={`Jalon ${item.title}`}
                          />
                          <span className="ml-2.5 text-[11px] font-bold whitespace-nowrap bg-base-100 px-2 py-0.5 rounded-field border border-base-300 shadow-2xs">
                            ◆ {item.title}
                          </span>
                        </div>
                      );
                    }

                    const isEpic = item.type === "EPIC";
                    const isExternal = item.type === "EXTERNAL_DEPENDENCY";

                    return (
                      <div
                        key={item.id}
                        style={{
                          top: `${topPx + 11}px`,
                          left: `${item.leftPercent}%`,
                          width: `${item.widthPercent}%`,
                        }}
                        className="absolute z-20 group"
                      >
                        <button
                          type="button"
                          onClick={() => canEdit && setEditingItem(item)}
                          title={`${item.title} (${item.effectiveProgress}%)`}
                          className={`w-full h-7 rounded-field relative overflow-hidden flex items-center px-2.5 text-left transition-all cursor-pointer shadow-xs bg-base-100 ${
                            isEpic
                              ? item.isCritical
                                ? "border-2 border-error ring-1 ring-error/30"
                                : "border-2 border-primary"
                              : isExternal
                                ? "border-2 border-dashed border-warning"
                                : item.isCritical
                                  ? "border-2 border-error"
                                  : "border border-info"
                          }`}
                        >
                          {/* Teinte de fond de la barre sur le socle opaque bg-base-100 */}
                          <div
                            className={`absolute inset-0 ${
                              isEpic
                                ? "bg-primary/20"
                                : isExternal
                                  ? "bg-warning/20"
                                  : "bg-info/20"
                            }`}
                          />

                          {/* Barre de progression interne normée Gantt */}
                          <div
                            style={{ width: `${item.effectiveProgress}%` }}
                            className={`absolute left-0 top-0 bottom-0 transition-all ${
                              isEpic
                                ? "bg-primary/45"
                                : isExternal
                                  ? "bg-warning/45"
                                  : "bg-info/45"
                            }`}
                          />

                          {/* Crochets de récapitulation aux extrémités pour les Epics */}
                          {isEpic && (
                            <>
                              <span className="absolute left-0 bottom-0 w-1.5 h-1.5 bg-primary" />
                              <span className="absolute right-0 bottom-0 w-1.5 h-1.5 bg-primary" />
                            </>
                          )}

                          <span className="relative z-10 text-[11px] font-semibold text-base-content truncate">
                            {item.title}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Légende Normée du Diagramme de Gantt */}
            <footer className="bg-base-200/60 border-t border-base-300 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-bold text-base-content/70 uppercase text-[10px]">
                  Légende Gantt :
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-4 h-2.5 rounded-xs bg-primary/40 border-2 border-primary" />
                  <span>Epic</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-2.5 rotate-45 bg-secondary" />
                  <span>Jalon (◆)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-4 h-2.5 rounded-xs bg-warning/30 border-2 border-dashed border-warning" />
                  <span>Dépendance externe</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-4 h-0.5 bg-error" />
                  <span className="text-error font-semibold">
                    Chemin Critique (CPM)
                  </span>
                </span>
              </div>
              <span className="text-base-content/60">
                Cliquez sur une étape ou une barre pour ajuster ses dates ou son avancement.
              </span>
            </footer>
          </div>
        </div>
      </section>

      {/* Modale de Création d'une Étape Gantt (Epic, Jalon, Dépendance externe, Tâche) */}
      {isCreateOpen && (
        <dialog
          open
          className="modal modal-open modal-bottom sm:modal-middle z-50"
          aria-labelledby="create-gantt-modal-title"
        >
          <div className="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-2xl p-6">
            <header className="flex items-center justify-between border-b border-base-300 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <CalendarRange
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
                <h3
                  id="create-gantt-modal-title"
                  className="text-base font-bold text-base-content"
                >
                  Planifier une étape sur le Diagramme de Gantt
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="btn btn-ghost btn-xs btn-circle"
                aria-label="Fermer"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </header>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Sélecteur de type d'élément Gantt */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <fieldset className="fieldset sm:col-span-2">
                  <legend className="fieldset-legend text-xs">
                    Nature de l&apos;élément Gantt *
                  </legend>
                  <select
                    className="select select-sm w-full"
                    value={newType}
                    onChange={(e) =>
                      setNewType(e.target.value as GanttItemType)
                    }
                  >
                    <option value="EPIC">
                      Epic — Grande fonctionnalité produit
                    </option>
                    <option value="MILESTONE">
                      Jalon Majeur (◆) — Livraison / Point de contrôle (0 jour)
                    </option>
                    <option value="EXTERNAL_DEPENDENCY">
                      Dépendance Externe — Marketing, Matériel, Juridique, Tiers
                    </option>
                    <option value="TASK">
                      Livrable / Phase technique
                    </option>
                  </select>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">
                    Code WBS *
                  </legend>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    placeholder="Ex: 3.0, M3, EXT-4"
                    className="input input-sm w-full font-mono"
                    value={newWbsCode}
                    onChange={(e) => setNewWbsCode(e.target.value)}
                  />
                </fieldset>
              </div>

              <fieldset className="fieldset">
                <legend className="fieldset-legend text-xs">
                  Intitulé de l&apos;étape / du jalon *
                </legend>
                <input
                  type="text"
                  required
                  minLength={3}
                  placeholder={
                    newType === "EPIC"
                      ? "Ex:Portail d'Encaissement International Multi-Devises"
                      : newType === "MILESTONE"
                        ? "Ex: Jalon M3 : Validation finale & Mise en production"
                        : "Ex: Livraison des serveurs matériels ou Lancement Campagne Marketing"
                  }
                  className="input input-sm w-full"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </fieldset>

              {/* Champs spécifiques aux Dépendances Externes */}
              {newType === "EXTERNAL_DEPENDENCY" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-warning/10 border border-warning/30 p-3 rounded-box">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-xs">
                      Catégorie de dépendance externe *
                    </legend>
                    <select
                      className="select select-sm w-full"
                      value={newExtCategory}
                      onChange={(e) =>
                        setNewExtCategory(
                          e.target.value as ExternalDependencyCategory
                        )
                      }
                    >
                      <option value="MARKETING">
                        Marketing, Communication & RP
                      </option>
                      <option value="MATERIEL">
                        Matériel, Équipement & Terminaux
                      </option>
                      <option value="JURIDIQUE">
                        Juridique, Conformité & Homologation
                      </option>
                      <option value="FOURNISSEUR">
                        Fournisseur / Partenaire Externe
                      </option>
                      <option value="INFRASTRUCTURE">
                        Infrastructure & Réseau Cloud
                      </option>
                    </select>
                  </fieldset>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-xs">
                      Entité / Fournisseur externe
                    </legend>
                    <input
                      type="text"
                      placeholder="Ex: Agence Media, Fournisseur Matériel..."
                      className="input input-sm w-full"
                      value={newExtProvider}
                      onChange={(e) => setNewExtProvider(e.target.value)}
                    />
                  </fieldset>
                </div>
              )}

              {/* Dates & Responsable */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">
                    {newType === "MILESTONE"
                      ? "Date du Jalon (Livraison) *"
                      : "Date de début *"}
                  </legend>
                  <input
                    type="date"
                    required
                    className="input input-sm w-full"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                  />
                </fieldset>

                {newType !== "MILESTONE" && (
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-xs">
                      Date de fin prévue *
                    </legend>
                    <input
                      type="date"
                      required
                      min={newStartDate}
                      className="input input-sm w-full"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                    />
                  </fieldset>
                )}

                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">
                    Responsable
                  </legend>
                  <select
                    className="select select-sm w-full"
                    value={newOwnerId}
                    onChange={(e) => setNewOwnerId(e.target.value)}
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.department})
                      </option>
                    ))}
                  </select>
                </fieldset>
              </div>

              {/* Prédécesseur & Type de lien normé (FS, SS, FF, SF) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">
                    Étape prédécesseur (Dépendance)
                  </legend>
                  <select
                    className="select select-sm w-full"
                    value={newPredecessorId}
                    onChange={(e) => setNewPredecessorId(e.target.value)}
                  >
                    <option value="">Aucun prédécesseur (Début libre)</option>
                    {projection.items.map((it) => (
                      <option key={it.id} value={it.id}>
                        [{it.wbsCode}] {it.title}
                      </option>
                    ))}
                  </select>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">
                    Type de lien normé Gantt
                  </legend>
                  <select
                    className="select select-sm w-full"
                    value={newDepType}
                    onChange={(e) =>
                      setNewDepType(e.target.value as GanttDependencyType)
                    }
                    disabled={!newPredecessorId}
                  >
                    <option value="FS">
                      FS (Fin-à-Début) — Commence après la fin du prédécesseur
                    </option>
                    <option value="SS">
                      SS (Début-à-Début) — Démarre simultanément
                    </option>
                    <option value="FF">
                      FF (Fin-à-Fin) — Se termine simultanément
                    </option>
                    <option value="SF">
                      SF (Début-à-Fin)
                    </option>
                  </select>
                </fieldset>
              </div>

              {/* Options Chemin Critique & Synchronisation Epic */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-base-200/60 p-3 rounded-box text-xs">
                <label className="label cursor-pointer gap-2 p-0">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs checkbox-error"
                    checked={newIsCritical}
                    onChange={(e) => setNewIsCritical(e.target.checked)}
                  />
                  <span className="font-medium">
                    Inscrire sur le <strong>Chemin Critique (CPM)</strong>
                  </span>
                </label>

                {newType === "EPIC" && (
                  <label className="label cursor-pointer gap-2 p-0">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      checked={autoCreateEpic}
                      onChange={(e) => setAutoCreateEpic(e.target.checked)}
                    />
                    <span className="font-medium">
                      Créer automatiquement l&apos;Epic dans le Backlog & Kanban
                    </span>
                  </label>
                )}
              </div>

              <div className="modal-action flex justify-end gap-2 pt-2 border-t border-base-300">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="btn btn-ghost btn-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  className="btn btn-primary btn-sm"
                >
                  {isSubmitting && (
                    <span className="loading loading-spinner loading-xs" />
                  )}
                  Ajouter au Diagramme de Gantt
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop bg-neutral/40 backdrop-blur-xs"
            onClick={() => setIsCreateOpen(false)}
          />
        </dialog>
      )}

      {/* Modale d'édition rapide d'une étape Gantt */}
      {editingItem && (
        <dialog
          open
          className="modal modal-open modal-bottom sm:modal-middle z-50"
          aria-labelledby="edit-gantt-modal-title"
        >
          <div className="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-lg p-6">
            <header className="flex items-center justify-between border-b border-base-300 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <GitCommitHorizontal
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
                <h3
                  id="edit-gantt-modal-title"
                  className="text-base font-bold"
                >
                  Modifier l&apos;étape [{editingItem.wbsCode}]
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="btn btn-ghost btn-xs btn-circle"
                aria-label="Fermer"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </header>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">Code WBS</legend>
                  <input
                    type="text"
                    required
                    className="input input-sm w-full font-mono"
                    value={editingItem.wbsCode}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        wbsCode: e.target.value,
                      })
                    }
                  />
                </fieldset>
                <fieldset className="fieldset col-span-3">
                  <legend className="fieldset-legend text-xs">Intitulé</legend>
                  <input
                    type="text"
                    required
                    className="input input-sm w-full"
                    value={editingItem.title}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        title: e.target.value,
                      })
                    }
                  />
                </fieldset>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-xs">
                    {editingItem.type === "MILESTONE"
                      ? "Date du jalon"
                      : "Date de début"}
                  </legend>
                  <input
                    type="date"
                    required
                    className="input input-sm w-full"
                    value={editingItem.startDate}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        startDate: e.target.value,
                      })
                    }
                  />
                </fieldset>

                {editingItem.type !== "MILESTONE" && (
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend text-xs">
                      Date de fin
                    </legend>
                    <input
                      type="date"
                      required
                      min={editingItem.startDate}
                      className="input input-sm w-full"
                      value={editingItem.endDate}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </fieldset>
                )}
              </div>

              {editingItem.type !== "MILESTONE" && (
                <fieldset className="fieldset">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <legend className="fieldset-legend p-0">
                      Progression de l&apos;étape
                    </legend>
                    <span className="font-mono font-bold text-primary">
                      {editingItem.progress} %
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={editingItem.progress}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        progress: Number(e.target.value),
                      })
                    }
                    className="range range-primary range-xs w-full"
                  />
                </fieldset>
              )}

              <label className="label cursor-pointer justify-start gap-2 text-xs">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs checkbox-error"
                  checked={editingItem.isCritical}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      isCritical: e.target.checked,
                    })
                  }
                />
                <span>Étape située sur le Chemin Critique (CPM)</span>
              </label>

              <div className="modal-action flex justify-end gap-2 pt-2 border-t border-base-300">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="btn btn-ghost btn-sm"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-sm"
                >
                  {isSubmitting && (
                    <span className="loading loading-spinner loading-xs" />
                  )}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop bg-neutral/40 backdrop-blur-xs"
            onClick={() => setEditingItem(null)}
          />
        </dialog>
      )}

      {/* Confirmation de suppression */}
      <ConfirmModal
        isOpen={Boolean(itemToDelete)}
        title={`Supprimer l'étape Gantt [${itemToDelete?.wbsCode || ""}] ?`}
        description={`L'étape "${itemToDelete?.title || ""}" et ses liens de dépendance sur le diagramme de Gantt seront retirés.`}
        confirmLabel="Supprimer du Gantt"
        variant="error"
        onConfirm={async () => {
          if (itemToDelete) {
            await onDeleteGanttItem(itemToDelete.id);
            setItemToDelete(null);
          }
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}

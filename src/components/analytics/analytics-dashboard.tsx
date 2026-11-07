"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Chart from "chart.js/auto";
import type { Issue, Sprint, User } from "@/domain/entities";
import { computeDashboardAnalytics } from "@/domain/services/analytics-engine";
import {
  applyDaisyChartDefaults,
  dcAlpha,
  dcColor,
} from "@/lib/daisy-chart-helper";
import { AnalyticsDashboardSkeleton } from "@/components/ui/daisy-skeletons";
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Flame,
  Inbox,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

interface AnalyticsDashboardProps {
  issues: Issue[];
  sprints: Sprint[];
  users: User[];
  onOpenCreateIssue: () => void;
}

type SimulatedState = "LOADED" | "LOADING" | "EMPTY" | "ERROR";

export function AnalyticsDashboard({
  issues,
  sprints,
  users,
  onOpenCreateIssue,
}: AnalyticsDashboardProps) {
  const [simulatedState, setSimulatedState] =
    useState<SimulatedState>("LOADED");
  const [themeVersion, setThemeVersion] = useState<number>(0);

  const burndownCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const velocityCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cfdCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const donutCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const workloadCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const analytics = useMemo(
    () => computeDashboardAnalytics(issues, sprints, users),
    [issues, sprints, users]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new MutationObserver(() => {
      setThemeVersion((v) => v + 1);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (simulatedState !== "LOADED" || issues.length === 0) return;

    applyDaisyChartDefaults();
    const instances: Chart[] = [];

    const cPrimary = dcColor("primary");
    const cSecondary = dcColor("secondary");
    const cInfo = dcColor("info");
    const cSuccess = dcColor("success");
    const cWarning = dcColor("warning");
    const cBase300 = dcColor("base-300");
    const cBaseContent = dcColor("base-content");

    // 1. Burndown Chart (line-chart-4)
    if (burndownCanvasRef.current) {
      instances.push(
        new Chart(burndownCanvasRef.current, {
          type: "line",
          data: {
            labels: analytics.burndown.labels,
            datasets: [
              {
                label: "Story Points restants (Réel)",
                data: analytics.burndown.actual,
                borderColor: cPrimary,
                backgroundColor: dcAlpha("primary", 18),
                borderWidth: 2.5,
                tension: 0.3,
                fill: true,
                pointRadius: 3.5,
              },
              {
                label: "Trajectoire idéale",
                data: analytics.burndown.ideal,
                borderColor: cBaseContent,
                borderDash: [6, 4],
                borderWidth: 1.5,
                pointRadius: 0,
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { usePointStyle: true, boxWidth: 8 },
              },
            },
            scales: {
              x: { grid: { display: false } },
              y: {
                beginAtZero: true,
                grid: { color: cBase300 },
                title: { display: true, text: "Story Points (SP)" },
              },
            },
          },
        })
      );
    }

    // 2. Velocity Chart (column-chart-3)
    if (velocityCanvasRef.current) {
      instances.push(
        new Chart(velocityCanvasRef.current, {
          type: "bar",
          data: {
            labels: analytics.velocity.labels,
            datasets: [
              {
                label: "Engagés (SP)",
                data: analytics.velocity.committed,
                backgroundColor: cInfo,
                borderRadius: 6,
              },
              {
                label: "Livrés (SP)",
                data: analytics.velocity.completed,
                backgroundColor: cSuccess,
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { usePointStyle: true, boxWidth: 8 },
              },
            },
            scales: {
              x: { grid: { display: false } },
              y: {
                beginAtZero: true,
                grid: { color: cBase300 },
                title: { display: true, text: "Story Points (SP)" },
              },
            },
          },
        })
      );
    }

    // 3. Cumulative Flow Diagram (area-chart-4)
    if (cfdCanvasRef.current) {
      instances.push(
        new Chart(cfdCanvasRef.current, {
          type: "line",
          data: {
            labels: analytics.cumulativeFlow.labels,
            datasets: [
              {
                label: "Terminé",
                data: analytics.cumulativeFlow.done,
                borderColor: cSuccess,
                backgroundColor: dcAlpha("success", 30),
                fill: true,
                tension: 0.35,
              },
              {
                label: "En revue",
                data: analytics.cumulativeFlow.inReview,
                borderColor: cWarning,
                backgroundColor: dcAlpha("warning", 30),
                fill: true,
                tension: 0.35,
              },
              {
                label: "En cours",
                data: analytics.cumulativeFlow.inProgress,
                borderColor: cInfo,
                backgroundColor: dcAlpha("info", 30),
                fill: true,
                tension: 0.35,
              },
              {
                label: "À faire",
                data: analytics.cumulativeFlow.todo,
                borderColor: cSecondary,
                backgroundColor: dcAlpha("secondary", 22),
                fill: true,
                tension: 0.35,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { usePointStyle: true, boxWidth: 8 },
              },
            },
            scales: {
              x: { grid: { display: false } },
              y: {
                stacked: true,
                beginAtZero: true,
                grid: { color: cBase300 },
                title: { display: true, text: "Tickets cumulés" },
              },
            },
          },
        })
      );
    }

    // 4. Status Distribution Doughnut (pie-chart-2)
    if (donutCanvasRef.current) {
      instances.push(
        new Chart(donutCanvasRef.current, {
          type: "doughnut",
          data: {
            labels: ["À faire", "En cours", "En revue", "Terminé"],
            datasets: [
              {
                data: [
                  analytics.statusDistribution.TODO,
                  analytics.statusDistribution.IN_PROGRESS,
                  analytics.statusDistribution.IN_REVIEW,
                  analytics.statusDistribution.DONE,
                ],
                backgroundColor: [cSecondary, cInfo, cWarning, cSuccess],
                borderWidth: 2,
                borderColor: dcColor("base-100"),
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "66%",
            plugins: {
              legend: {
                position: "bottom",
                labels: { usePointStyle: true, boxWidth: 8 },
              },
            },
          },
        })
      );
    }

    // 5. Team Workload Horizontal Bar (bar-chart-2)
    if (workloadCanvasRef.current) {
      instances.push(
        new Chart(workloadCanvasRef.current, {
          type: "bar",
          data: {
            labels: analytics.teamWorkload.map((w) => w.userName),
            datasets: [
              {
                label: "Points assignés (SP)",
                data: analytics.teamWorkload.map((w) => w.assignedPoints),
                backgroundColor: cPrimary,
                borderRadius: 6,
              },
              {
                label: "Points terminés (SP)",
                data: analytics.teamWorkload.map((w) => w.completedPoints),
                backgroundColor: cSuccess,
                borderRadius: 6,
              },
            ],
          },
          options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { usePointStyle: true, boxWidth: 8 },
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                grid: { color: cBase300 },
              },
              y: { grid: { display: false } },
            },
          },
        })
      );
    }

    return () => {
      for (const chart of instances) {
        chart.destroy();
      }
    };
  }, [analytics, simulatedState, themeVersion, issues.length]);

  return (
    <div className="space-y-6">
      {/* Header & 4-State Simulator Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-base-100 border border-base-300 p-4 rounded-box">
        <div>
          <h2 className="text-base font-bold text-base-content flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" aria-hidden="true" />
            Tableaux de Bord & Métriques Agiles
          </h2>
          <p className="text-xs text-base-content/70">
            Indicateurs de performance, vélocité et suivi de flux synchronisés en temps réel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-base-content/60">
            Tester les 4 états :
          </span>
          <div className="join" role="group" aria-label="Simulateur des 4 états UI">
            <button
              type="button"
              onClick={() => setSimulatedState("LOADED")}
              className={`btn btn-xs join-item ${
                simulatedState === "LOADED" ? "btn-primary" : "btn-ghost bg-base-200"
              }`}
            >
              Chargé
            </button>
            <button
              type="button"
              onClick={() => setSimulatedState("LOADING")}
              className={`btn btn-xs join-item ${
                simulatedState === "LOADING" ? "btn-primary" : "btn-ghost bg-base-200"
              }`}
            >
              Skeleton
            </button>
            <button
              type="button"
              onClick={() => setSimulatedState("EMPTY")}
              className={`btn btn-xs join-item ${
                simulatedState === "EMPTY" ? "btn-primary" : "btn-ghost bg-base-200"
              }`}
            >
              Vide
            </button>
            <button
              type="button"
              onClick={() => setSimulatedState("ERROR")}
              className={`btn btn-xs join-item ${
                simulatedState === "ERROR" ? "btn-primary" : "btn-ghost bg-base-200"
              }`}
            >
              Erreur
            </button>
          </div>
        </div>
      </div>

      {/* State 1: Loading Skeleton */}
      {simulatedState === "LOADING" && <AnalyticsDashboardSkeleton />}

      {/* State 2: Error Alert */}
      {simulatedState === "ERROR" && (
        <div
          role="alert"
          className="alert alert-error alert-soft border border-base-300 shadow-xs"
        >
          <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
          <div>
            <h3 className="font-bold text-sm">
              Impossible de charger les séries analytiques du sprint
            </h3>
            <p className="text-xs opacity-80">
              La synchronisation des indicateurs a expiré. Vérifiez votre connexion et réessayez.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSimulatedState("LOADED")}
            className="btn btn-outline btn-sm gap-1.5"
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Réessayer
          </button>
        </div>
      )}

      {/* State 3: Empty State */}
      {(simulatedState === "EMPTY" ||
        (simulatedState === "LOADED" && issues.length === 0)) && (
        <div className="card bg-base-100 border border-base-300 p-10 text-center items-center gap-3">
          <Inbox className="size-10 text-base-content/40" aria-hidden="true" />
          <h3 className="font-bold text-base">
            Aucune donnée analytique disponible sur cette période
          </h3>
          <p className="text-sm text-base-content/60 max-w-md">
            Créez votre premier ticket ou démarrez un sprint pour générer automatiquement les courbes de Burndown et de Vélocité.
          </p>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onOpenCreateIssue}
              className="btn btn-primary btn-sm"
            >
              Créer un premier ticket
            </button>
            {simulatedState === "EMPTY" && (
              <button
                type="button"
                onClick={() => setSimulatedState("LOADED")}
                className="btn btn-ghost btn-sm"
              >
                Restaurer les données
              </button>
            )}
          </div>
        </div>
      )}

      {/* State 4: Loaded Data */}
      {simulatedState === "LOADED" && issues.length > 0 && (
        <>
          {/* KPI Row (daisyUI stats) */}
          <section
            aria-label="Indicateurs clés de performance"
            className="stats stats-vertical sm:stats-horizontal bg-base-100 border border-base-300 w-full shadow-xs"
          >
            <div className="stat">
              <div className="stat-figure text-primary">
                <CheckCircle2 className="size-6" aria-hidden="true" />
              </div>
              <div className="stat-title">Accomplissement Story Points</div>
              <div className="stat-value text-primary tabular-nums">
                {analytics.kpis.completedPoints} / {analytics.kpis.totalPoints} SP
              </div>
              <div className="stat-desc flex items-center gap-2 mt-1">
                <progress
                  className="progress progress-primary w-24"
                  value={analytics.kpis.completionRate}
                  max={100}
                  aria-label="Progression des points"
                ></progress>
                <span className="font-medium tabular-nums">
                  {analytics.kpis.completionRate} % livrés
                </span>
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-success">
                <TrendingUp className="size-6" aria-hidden="true" />
              </div>
              <div className="stat-title">Vélocité Moyenne Équipe</div>
              <div className="stat-value text-success tabular-nums">
                {analytics.kpis.averageVelocity} SP
              </div>
              <div className="stat-desc">
                Moyenne calculée sur {sprints.length} sprints
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-info">
                <Activity className="size-6" aria-hidden="true" />
              </div>
              <div className="stat-title">Flux Actif (WIP)</div>
              <div className="stat-value tabular-nums">
                {analytics.kpis.inProgressIssues} tickets
              </div>
              <div className="stat-desc">
                Sur {analytics.kpis.totalIssues} tickets au total
              </div>
            </div>

            <div className="stat">
              <div className="stat-figure text-error">
                <Flame className="size-6" aria-hidden="true" />
              </div>
              <div className="stat-title">Bugs Bloquants / Critiques</div>
              <div
                className={`stat-value tabular-nums ${
                  analytics.kpis.blockerBugs > 0 ? "text-error" : "text-success"
                }`}
              >
                {analytics.kpis.blockerBugs}
              </div>
              <div className="stat-desc">
                {analytics.kpis.blockerBugs > 0
                  ? "Intervention prioritaire requise"
                  : "Aucune anomalie bloquante"}
              </div>
            </div>
          </section>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 1. Sprint Burndown Chart */}
            <section
              className="card bg-base-100 border border-base-300 shadow-xs"
              aria-labelledby="chart-burndown-title"
            >
              <div className="card-body p-4 gap-3">
                <header className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      id="chart-burndown-title"
                      className="card-title text-sm font-bold"
                    >
                      Sprint Burndown Chart (Story Points)
                    </h3>
                    <p className="text-xs text-base-content/60">
                      {analytics.burndown.sprintName} · Trajectoire réelle vs idéale
                    </p>
                  </div>
                  <span className="badge badge-primary badge-soft badge-xs">
                    Avancement
                  </span>
                </header>
                <div className="relative h-64">
                  <canvas
                    ref={burndownCanvasRef}
                    role="img"
                    aria-label={`Graphique Burndown du ${analytics.burndown.sprintName}`}
                  />
                </div>
              </div>
            </section>

            {/* 2. Velocity Chart */}
            <section
              className="card bg-base-100 border border-base-300 shadow-xs"
              aria-labelledby="chart-velocity-title"
            >
              <div className="card-body p-4 gap-3">
                <header className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      id="chart-velocity-title"
                      className="card-title text-sm font-bold"
                    >
                      Vélocité de l&apos;Équipe par Sprint (SP)
                    </h3>
                    <p className="text-xs text-base-content/60">
                      Comparaison des Story Points engagés vs livrés
                    </p>
                  </div>
                  <span className="badge badge-success badge-soft badge-xs">
                    Vélocité
                  </span>
                </header>
                <div className="relative h-64">
                  <canvas
                    ref={velocityCanvasRef}
                    role="img"
                    aria-label="Graphique de vélocité comparant les points engagés et terminés par sprint"
                  />
                </div>
              </div>
            </section>

            {/* 3. Cumulative Flow Diagram (CFD) */}
            <section
              className="card bg-base-100 border border-base-300 shadow-xs"
              aria-labelledby="chart-cfd-title"
            >
              <div className="card-body p-4 gap-3">
                <header className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      id="chart-cfd-title"
                      className="card-title text-sm font-bold"
                    >
                      Diagramme de Flux Cumulé (CFD)
                    </h3>
                    <p className="text-xs text-base-content/60">
                      Évolution de la stabilité du flux et détection des goulets
                    </p>
                  </div>
                  <span className="badge badge-info badge-soft badge-xs">
                    Flux continu
                  </span>
                </header>
                <div className="relative h-64">
                  <canvas
                    ref={cfdCanvasRef}
                    role="img"
                    aria-label="Diagramme de flux cumulé des tickets sur 6 semaines"
                  />
                </div>
              </div>
            </section>

            {/* 4. Status Distribution Doughnut */}
            <section
              className="card bg-base-100 border border-base-300 shadow-xs"
              aria-labelledby="chart-donut-title"
            >
              <div className="card-body p-4 gap-3">
                <header className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      id="chart-donut-title"
                      className="card-title text-sm font-bold"
                    >
                      Répartition des Tickets par Statut
                    </h3>
                    <p className="text-xs text-base-content/60">
                      Part relative de chaque étape du workflow ({issues.length} tickets)
                    </p>
                  </div>
                  <span className="badge badge-secondary badge-soft badge-xs">
                    Répartition
                  </span>
                </header>
                <div className="relative h-64">
                  <canvas
                    ref={donutCanvasRef}
                    role="img"
                    aria-label="Répartition en anneau des tickets par statut"
                  />
                </div>
              </div>
            </section>

            {/* 5. Team Workload Bar Chart */}
            <section
              className="card bg-base-100 border border-base-300 shadow-xs lg:col-span-2"
              aria-labelledby="chart-workload-title"
            >
              <div className="card-body p-4 gap-3">
                <header className="flex items-start justify-between gap-2">
                  <div>
                    <h3
                      id="chart-workload-title"
                      className="card-title text-sm font-bold"
                    >
                      Charge de Travail & Accomplissement par Collaborateur (SP)
                    </h3>
                    <p className="text-xs text-base-content/60">
                      Répartition des Story Points assignés et terminés au sein de l&apos;équipe
                    </p>
                  </div>
                  <span className="badge badge-accent badge-soft badge-xs">
                    Équipe
                  </span>
                </header>
                <div className="relative h-60">
                  <canvas
                    ref={workloadCanvasRef}
                    role="img"
                    aria-label="Barres horizontales de la charge de travail par collaborateur"
                  />
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

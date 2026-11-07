"use client";

import React from "react";

export function KanbanBoardSkeleton() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
      aria-busy="true"
      aria-label="Chargement du tableau Kanban"
    >
      {[1, 2, 3, 4].map((col) => (
        <div
          key={col}
          className="bg-base-200 border border-base-300 rounded-box p-3 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-5 w-8 rounded-selector"></div>
          </div>
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="card bg-base-100 border border-base-300 p-3 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="skeleton h-3 w-16"></div>
                <div className="skeleton h-4 w-14 rounded-selector"></div>
              </div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-3/4"></div>
              <div className="flex items-center justify-between pt-2">
                <div className="skeleton h-5 w-10 rounded-selector"></div>
                <div className="skeleton size-6 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function AnalyticsDashboardSkeleton() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Chargement des indicateurs analytiques"
    >
      <div className="stats stats-vertical sm:stats-horizontal bg-base-100 border border-base-300 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat space-y-2">
            <div className="skeleton h-3 w-24"></div>
            <div className="skeleton h-8 w-20"></div>
            <div className="skeleton h-3 w-32"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((c) => (
          <div
            key={c}
            className="card bg-base-100 border border-base-300 p-4 space-y-3"
          >
            <div className="skeleton h-5 w-44"></div>
            <div className="skeleton h-3 w-28"></div>
            <div className="skeleton h-64 w-full rounded-box"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GraphViewSkeleton() {
  return (
    <div
      className="card bg-base-100 border border-base-300 p-4 space-y-4"
      aria-busy="true"
      aria-label="Chargement du graphe relationnel"
    >
      <div className="flex items-center justify-between">
        <div className="skeleton h-6 w-52"></div>
        <div className="flex gap-2">
          <div className="skeleton h-8 w-24"></div>
          <div className="skeleton h-8 w-24"></div>
        </div>
      </div>
      <div className="skeleton h-[540px] w-full rounded-box"></div>
    </div>
  );
}

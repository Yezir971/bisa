import React from "react";
import { KanbanBoardSkeleton } from "@/components/ui/daisy-skeletons";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-base-200 p-6 space-y-6">
      <div className="navbar bg-base-100 border border-base-300 rounded-box px-4">
        <div className="skeleton h-6 w-64"></div>
      </div>
      <KanbanBoardSkeleton />
    </div>
  );
}

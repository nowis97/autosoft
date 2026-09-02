"use client";

import React from "react";
import { DashboardHeader } from "@/components/shared/DashboardHeader";
import { TaskKanban } from "@/components/tasks/TaskKanban";

export default function TasksOverviewPage() {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Gestión de Tareas Operativas"
        subtitle="Tablero Kanban de seguimiento por patente, vencimientos y áreas"
      />

      <main className="p-6 max-w-7xl w-full">
        <TaskKanban />
      </main>
    </div>
  );
}

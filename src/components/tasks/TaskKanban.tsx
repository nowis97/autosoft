"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { store } from "@/lib/store";
import { DealerTask, DealerTaskStatus, DealerTaskDepartment, DealerTaskPriority } from "@/types";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Car,
  Calendar,
  User,
  Filter,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const COLUMNS: { key: DealerTaskStatus; label: string; color: string }[] = [
  { key: "PENDIENTE", label: "Pendientes", color: "bg-blue-500" },
  { key: "EN_PROGRESO", label: "En Progreso", color: "bg-amber-500" },
  { key: "POR_APROBAR", label: "Por Aprobar", color: "bg-purple-500" },
  { key: "COMPLETADA", label: "Completadas", color: "bg-emerald-500" },
];

export function TaskKanban() {
  const [tasks, setTasks] = useState(store.getTasks());
  const [selectedDept, setSelectedDept] = useState<string>("TODAS");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New task form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState<DealerTaskDepartment>("DOCUMENTACION");
  const [priority, setPriority] = useState<DealerTaskPriority>("MEDIA");
  const [selectedVehiclePlate, setSelectedVehiclePlate] = useState("");

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setTasks(store.getTasks());
    });
    return unsub;
  }, []);

  const filteredTasks = tasks.filter((t) => {
    const matchesDept = selectedDept === "TODAS" || t.department === selectedDept;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.vehiclePlate && t.vehiclePlate.toLowerCase().includes(search.toLowerCase())) ||
      (t.vehicleModel && t.vehicleModel.toLowerCase().includes(search.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  const getDaysOverdue = (dueDate: string) => {
    const diffTime = Date.now() - new Date(dueDate).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    store.createTask({
      tenantId: "tenant-oriente-1",
      title,
      description,
      department,
      priority,
      status: "PENDIENTE",
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      vehiclePlate: selectedVehiclePlate ? selectedVehiclePlate.toUpperCase() : undefined,
      vehicleModel: selectedVehiclePlate ? "Vehículo Seleccionado" : undefined,
    });

    setTitle("");
    setDescription("");
    setShowCreateModal(false);
  };

  const moveTaskStatus = (taskId: string, currentStatus: DealerTaskStatus, direction: 1 | -1) => {
    const currentIndex = COLUMNS.findIndex((c) => c.key === currentStatus);
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < COLUMNS.length) {
      store.updateTask(taskId, { status: COLUMNS[nextIndex].key });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="text"
            placeholder="Buscar tareas por título o patente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="TODAS">Todas las áreas</option>
            <option value="DOCUMENTACION">Documentación</option>
            <option value="VENTA">Venta</option>
            <option value="TALLER">Taller</option>
            <option value="GENERAL">General</option>
          </select>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          size="sm"
          className="gap-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Tarea</span>
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.key);

          return (
            <div
              key={col.key}
              className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 flex flex-col min-h-[550px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <h4 className="font-bold text-slate-900 text-sm">{col.label}</h4>
                </div>
                <span className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center shadow-2xs">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {colTasks.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-medium">
                    Sin tareas en esta columna
                  </div>
                ) : (
                  colTasks.map((t) => {
                    const overdueDays = getDaysOverdue(t.dueDate);
                    const isOverdue = overdueDays > 0 && t.status !== "COMPLETADA";

                    return (
                      <div
                        key={t.id}
                        className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3"
                      >
                        {/* Tags */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            t.priority === 'ALTA' ? 'bg-rose-100 text-rose-700' :
                            t.priority === 'MEDIA' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {t.priority}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 text-amber-800">
                            {t.department}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h5 className="font-bold text-slate-900 text-xs leading-snug">{t.title}</h5>
                          {t.description && (
                            <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                              {t.description}
                            </p>
                          )}
                        </div>

                        {/* Vehicle Link Badge */}
                        {t.vehiclePlate && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] font-semibold text-slate-800">
                            <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{t.vehicleModel || "Vehículo"}</span>
                            <span className="ml-auto font-black text-slate-900 uppercase">{t.vehiclePlate}</span>
                          </div>
                        )}

                        {/* Overdue alert indicator */}
                        {isOverdue && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Vencida hace {overdueDays}d</span>
                          </div>
                        )}

                        {/* Footer and Shift controls */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(t.dueDate).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {col.key !== "PENDIENTE" && (
                              <button
                                onClick={() => moveTaskStatus(t.id, col.key, -1)}
                                className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs"
                                title="Anterior"
                              >
                                ←
                              </button>
                            )}
                            {col.key !== "COMPLETADA" && (
                              <button
                                onClick={() => moveTaskStatus(t.id, col.key, 1)}
                                className="w-5 h-5 rounded bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center font-bold text-xs"
                                title="Siguiente"
                              >
                                →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nueva Tarea */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-lg mb-4">Nueva Tarea Operativa</h3>
            <form onSubmit={handleCreateTask} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-600 block mb-1">Título de la Tarea</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Inspección pre compra"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Descripción / Observaciones</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre horarios o clientes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Área / Categoría</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as DealerTaskDepartment)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DOCUMENTACION">Documentación</option>
                    <option value="VENTA">Venta</option>
                    <option value="TALLER">Taller</option>
                    <option value="GENERAL">General</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1">Prioridad</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as DealerTaskPriority)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Media</option>
                    <option value="BAJA">Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Patente Asociada (Opcional)</label>
                <input
                  type="text"
                  placeholder="ej. LBDC80"
                  value={selectedVehiclePlate}
                  onChange={(e) => setSelectedVehiclePlate(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
                  Crear Tarea
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

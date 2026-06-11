import { useEffect, useSyncExternalStore } from "react";
import type { Quadrant, Task } from "./types";

const KEY = "matrix.tasks.v1";

let tasks: Task[] = [];
const listeners = new Set<() => void>();
let hydrated = false;

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) tasks = JSON.parse(raw) as Task[];
  } catch {
    tasks = [];
  }
  hydrated = true;
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(tasks));
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return tasks;
}
function getServerSnapshot() {
  return tasks;
}

export function useTasks() {
  // hydrate on first browser mount
  useEffect(() => {
    if (!hydrated) {
      load();
      emit();
    }
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const taskActions = {
  add(title: string, quadrant: Quadrant, deadline?: string) {
    const t: Task = {
      id: uid(),
      title: title.trim(),
      quadrant,
      deadline,
      createdAt: new Date().toISOString(),
    };
    if (!t.title) return;
    tasks = [t, ...tasks];
    emit();
  },
  move(id: string, quadrant: Quadrant) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, quadrant } : t));
    emit();
  },
  complete(id: string) {
    tasks = tasks.map((t) =>
      t.id === id ? { ...t, completedAt: new Date().toISOString() } : t,
    );
    emit();
  },
  restore(id: string) {
    tasks = tasks.map((t) =>
      t.id === id ? { ...t, completedAt: undefined } : t,
    );
    emit();
  },
  remove(id: string) {
    tasks = tasks.filter((t) => t.id !== id);
    emit();
  },
  update(id: string, patch: Partial<Pick<Task, "title" | "quadrant" | "deadline">>) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
    emit();
  },
  exportJson(): string {
    return JSON.stringify(
      { version: 1, exportedAt: new Date().toISOString(), tasks },
      null,
      2,
    );
  },
  importJson(json: string, mode: "merge" | "replace" = "replace") {
    const parsed = JSON.parse(json);
    const incoming: Task[] = Array.isArray(parsed) ? parsed : parsed.tasks;
    if (!Array.isArray(incoming)) throw new Error("Invalid backup file");
    // light validation
    const valid = incoming.filter(
      (t) =>
        t &&
        typeof t.id === "string" &&
        typeof t.title === "string" &&
        typeof t.quadrant === "string",
    );
    if (mode === "replace") {
      tasks = valid;
    } else {
      const ids = new Set(tasks.map((t) => t.id));
      tasks = [...tasks, ...valid.filter((t) => !ids.has(t.id))];
    }
    emit();
    return valid.length;
  },
};

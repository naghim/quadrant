import { useEffect, useSyncExternalStore } from "react";
import { type Quadrant } from "./types";

export const DEFAULT_LABELS: Record<Quadrant, string> = {
  work: "Work",
  university: "University",
  personal: "Personal",
  misc: "Misc",
};

const KEY = "matrix.settings.v1";

let labels: Record<Quadrant, string> = { ...DEFAULT_LABELS };
const listeners = new Set<() => void>();
let hydrated = false;

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Partial<Record<Quadrant, string>>;
      labels = { ...DEFAULT_LABELS, ...stored };
    }
  } catch {
    labels = { ...DEFAULT_LABELS };
  }
  hydrated = true;
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(labels));
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
  return labels;
}

function getServerSnapshot() {
  return labels;
}

export function useQuadrantLabels() {
  useEffect(() => {
    if (!hydrated) {
      load();
      emit();
    }
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const labelActions = {
  update(quadrant: Quadrant, label: string) {
    labels = { ...labels, [quadrant]: label.trim() || DEFAULT_LABELS[quadrant] };
    emit();
  },
  updateAll(updated: Record<Quadrant, string>) {
    const next = { ...DEFAULT_LABELS };
    for (const key of Object.keys(DEFAULT_LABELS) as Quadrant[]) {
      const v = updated[key]?.trim();
      if (v) next[key] = v;
    }
    labels = next;
    emit();
  },
  reset() {
    labels = { ...DEFAULT_LABELS };
    emit();
  },
};

// --- Quadrant colors ---

const COLORS_KEY = "matrix.colors.v1";

export const DEFAULT_COLORS: Record<Quadrant, string> = {
  work: "",
  university: "",
  personal: "",
  misc: "",
};

let colors: Record<Quadrant, string> = { ...DEFAULT_COLORS };
const colorListeners = new Set<() => void>();
let colorsHydrated = false;

function loadColors() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(COLORS_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as Partial<Record<Quadrant, string>>;
      colors = { ...DEFAULT_COLORS, ...stored };
    }
  } catch {
    colors = { ...DEFAULT_COLORS };
  }
  colorsHydrated = true;
}

function persistColors() {
  if (typeof window === "undefined") return;
  localStorage.setItem(COLORS_KEY, JSON.stringify(colors));
}

function emitColors() {
  persistColors();
  colorListeners.forEach((l) => l());
}

function subscribeColors(cb: () => void) {
  colorListeners.add(cb);
  return () => colorListeners.delete(cb);
}

function getColorsSnapshot() {
  return colors;
}

function getColorsServerSnapshot() {
  return colors;
}

export function useQuadrantColors() {
  useEffect(() => {
    if (!colorsHydrated) {
      loadColors();
      emitColors();
    }
  }, []);
  return useSyncExternalStore(subscribeColors, getColorsSnapshot, getColorsServerSnapshot);
}

export const colorActions = {
  updateAll(updated: Record<Quadrant, string>) {
    const next = { ...DEFAULT_COLORS };
    for (const key of Object.keys(DEFAULT_COLORS) as Quadrant[]) {
      const v = updated[key]?.trim();
      next[key] = v;
    }
    colors = next;
    emitColors();
  },
  reset() {
    colors = { ...DEFAULT_COLORS };
    emitColors();
  },
};

// --- Page background color ---

const PAGE_KEY = "matrix.pagecolor.v1";

let pageColor = "";
const pageListeners = new Set<() => void>();
let pageHydrated = false;

function loadPageColor() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(PAGE_KEY);
    pageColor = raw || "";
  } catch {
    pageColor = "";
  }
  pageHydrated = true;
}

function persistPageColor() {
  if (typeof window === "undefined") return;
  if (pageColor) {
    localStorage.setItem(PAGE_KEY, pageColor);
  } else {
    localStorage.removeItem(PAGE_KEY);
  }
}

function emitPageColor() {
  persistPageColor();
  pageListeners.forEach((l) => l());
}

function subscribePage(cb: () => void) {
  pageListeners.add(cb);
  return () => pageListeners.delete(cb);
}

function getPageSnapshot() {
  return pageColor;
}

function getPageServerSnapshot() {
  return pageColor;
}

export function usePageColor() {
  useEffect(() => {
    if (!pageHydrated) {
      loadPageColor();
      emitPageColor();
    }
  }, []);
  return useSyncExternalStore(subscribePage, getPageSnapshot, getPageServerSnapshot);
}

export const pageActions = {
  set(color: string) {
    pageColor = color.trim();
    emitPageColor();
  },
  reset() {
    pageColor = "";
    emitPageColor();
  },
};

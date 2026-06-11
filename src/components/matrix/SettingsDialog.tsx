import { useState } from "react";
import { QUADRANTS, type Quadrant } from "@/lib/types";
import {
  useQuadrantLabels,
  labelActions,
  useQuadrantColors,
  colorActions,
  usePageColor,
  pageActions,
} from "@/lib/settings-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export function SettingsDialog({ open, onOpenChange }: Props) {
  const currentLabels = useQuadrantLabels();
  const currentColors = useQuadrantColors();
  const currentPageColor = usePageColor();
  const [labels, setLabels] = useState<Record<Quadrant, string>>({ ...currentLabels });
  const [colors, setColors] = useState<Record<Quadrant, string>>({ ...currentColors });
  const [pageColor, setPageColor] = useState(currentPageColor);

  const changed =
    Object.keys(labels).some(
      (k) => labels[k as Quadrant] !== currentLabels[k as Quadrant],
    ) ||
    Object.keys(colors).some(
      (k) => colors[k as Quadrant] !== currentColors[k as Quadrant],
    ) ||
    pageColor !== currentPageColor;

  function save() {
    labelActions.updateAll(labels);
    colorActions.updateAll(colors);
    pageActions.set(pageColor);
    onOpenChange(false);
  }

  function handleOpenChange(v: boolean) {
    if (!v) {
      setLabels({ ...currentLabels });
      setColors({ ...currentColors });
      setPageColor(currentPageColor);
    }
    onOpenChange(v);
  }

  function resetAll() {
    const emptyLabels = { ...currentLabels };
    Object.keys(emptyLabels).forEach((k) => {
      emptyLabels[k as Quadrant] = "";
    });
    setLabels(emptyLabels);
    const emptyColors = { ...currentColors };
    Object.keys(emptyColors).forEach((k) => {
      emptyColors[k as Quadrant] = "";
    });
    setColors(emptyColors);
    setPageColor("");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border border-border bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-light tracking-tight">
            Settings
          </DialogTitle>
          <DialogDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Customize quadrant labels and colors
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {QUADRANTS.map((q) => (
            <div key={q.id}>
              <label className="mb-1.5 block font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Quadrant {String(QUADRANTS.indexOf(q) + 1).padStart(2, "0")}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={colors[q.id] || "#f5f3ee"}
                  onChange={(e) =>
                    setColors((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  className="h-8 w-8 cursor-pointer border border-border bg-transparent p-0.5"
                />
                <input
                  value={labels[q.id]}
                  onChange={(e) =>
                    setLabels((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                  placeholder={q.label}
                  className="flex-1 border-b border-border bg-transparent pb-1.5 text-sm text-foreground focus:border-foreground focus:outline-none"
                />
                {colors[q.id] && (
                  <button
                    onClick={() =>
                      setColors((prev) => ({ ...prev, [q.id]: "" }))
                    }
                    className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <label className="mb-1.5 block font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Page background
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={pageColor || "#f5f3ee"}
              onChange={(e) => setPageColor(e.target.value)}
              className="h-8 w-8 cursor-pointer border border-border bg-transparent p-0.5"
            />
            <span className="text-xs text-muted-foreground">
              {pageColor ? "Custom color" : "Default paper"}
            </span>
            {pageColor && (
              <button
                onClick={() => setPageColor("")}
                className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 flex flex-row items-center justify-between sm:justify-between">
          <button
            onClick={resetAll}
            className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenChange(false)}
              className="border border-border px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-foreground hover:bg-paper-deep"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={!changed}
              className="border border-foreground bg-foreground px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-background hover:bg-background hover:text-foreground disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

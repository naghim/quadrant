import { format, parseISO } from "date-fns";
import { RotateCcw, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import type { Task } from "@/lib/types";
import { taskActions } from "@/lib/tasks-store";
import { useQuadrantLabels } from "@/lib/settings-store";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tasks: Task[];
};

export function HistorySheet({ open, onOpenChange, tasks }: Props) {
  const labels = useQuadrantLabels();
  const completed = tasks
    .filter((t) => t.completedAt)
    .sort((a, b) => (a.completedAt! < b.completedAt! ? 1 : -1));

  const labelFor = (q: string) =>
    labels[q as keyof typeof labels] ?? q;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md border-l border-border bg-background">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl font-light tracking-tight">
            History
          </SheetTitle>
          <SheetDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {completed.length} completed
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-1 overflow-y-auto pr-1">
          {completed.length === 0 && (
            <p className="text-sm italic text-muted-foreground">
              Nothing completed yet. Check something off to see it here.
            </p>
          )}
          {completed.map((t) => (
            <div
              key={t.id}
              className="group flex items-start gap-3 border-b border-border/60 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground line-through decoration-foreground/40">
                  {t.title}
                </p>
                <p className="mt-1 font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {labelFor(t.quadrant)} ·{" "}
                  {format(parseISO(t.completedAt!), "MMM d, h:mm a")}
                </p>
              </div>
              <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => taskActions.restore(t.id)}
                  aria-label="Restore"
                  className="text-muted-foreground hover:text-foreground"
                  title="Restore"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => taskActions.remove(t.id)}
                  aria-label="Delete permanently"
                  className="text-muted-foreground hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

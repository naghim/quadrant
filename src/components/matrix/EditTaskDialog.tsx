import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { QUADRANTS, type Quadrant, type Task } from "@/lib/types";
import { taskActions } from "@/lib/tasks-store";
import { useQuadrantLabels } from "@/lib/settings-store";

type Props = {
  task: Task | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export function EditTaskDialog({ task, open, onOpenChange }: Props) {
  const labels = useQuadrantLabels();
  const [title, setTitle] = useState("");
  const [quadrant, setQuadrant] = useState<Quadrant>("misc");
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setQuadrant(task.quadrant);
      setDate(task.deadline ? parseISO(task.deadline) : undefined);
    }
  }, [task]);

  function save() {
    if (!task) return;
    const trimmed = title.trim();
    if (!trimmed) return;
    taskActions.update(task.id, {
      title: trimmed,
      quadrant,
      deadline: date ? format(date, "yyyy-MM-dd") : undefined,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-border bg-background sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-light tracking-tight">
            Edit task
          </DialogTitle>
          <DialogDescription className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Change anything · then save
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div>
            <label className="mb-1.5 block font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Title
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && save()}
              className="w-full border-b border-border bg-transparent pb-1.5 text-sm text-foreground focus:border-foreground focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Quadrant
            </label>
            <div className="grid grid-cols-2 gap-px border border-border">
              {QUADRANTS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setQuadrant(q.id)}
                  className={cn(
                    "px-3 py-2 text-xs uppercase tracking-[0.18em] transition-colors",
                    quadrant === q.id
                      ? "bg-foreground text-background"
                      : "bg-background text-muted-foreground hover:text-foreground",
                  )}
                >
                  {labels[q.id]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block font-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Deadline
            </label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.18em] text-foreground hover:bg-paper-deep">
                    <CalendarIcon className="h-3 w-3" />
                    {date ? format(date, "MMM d, yyyy") : "Pick a date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className={cn("p-3 pointer-events-auto")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {date && (
                <button
                  onClick={() => setDate(undefined)}
                  className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2 flex flex-row items-center justify-between sm:justify-between">
          <button
            onClick={() => onOpenChange(false)}
            className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="border border-foreground bg-foreground px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-background hover:bg-background hover:text-foreground"
          >
            Save changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

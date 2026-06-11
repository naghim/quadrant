import { useState } from "react";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Quadrant } from "@/lib/types";
import { taskActions } from "@/lib/tasks-store";

export function AddTaskInline({ quadrant }: { quadrant: Quadrant }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();

  function submit() {
    if (!title.trim()) {
      setOpen(false);
      return;
    }
    taskActions.add(title, quadrant, date ? format(date, "yyyy-MM-dd") : undefined);
    setTitle("");
    setDate(undefined);
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-2 px-1 py-2 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <Plus className="h-3.5 w-3.5" />
        Add task
      </button>
    );
  }

  return (
    <div className="border border-foreground bg-background px-2 py-2">
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") {
            setTitle("");
            setOpen(false);
          }
        }}
        placeholder="What needs doing?"
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em]",
                date ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <CalendarIcon className="h-3 w-3" />
              {date ? format(date, "MMM d") : "Deadline"}
              {date && (
                <X
                  className="h-3 w-3"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDate(undefined);
                  }}
                />
              )}
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
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.16em]">
          <button
            onClick={() => {
              setTitle("");
              setOpen(false);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="text-foreground"
          >
            Save ↵
          </button>
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import {
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  addDays,
  isPast,
  isToday,
  compareAsc,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";
import { useQuadrantLabels } from "@/lib/settings-store";

type Props = {
  tasks: Task[];
  selectedDate: Date | null;
  onSelectDate: (d: Date | null) => void;
};

export function CalendarPanel({ tasks, selectedDate, onSelectDate }: Props) {
  const labels = useQuadrantLabels();
  const [month, setMonth] = useState<Date>(startOfMonth(new Date()));

  const dueByDay = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((t) => {
      if (!t.deadline) return;
      const key = t.deadline;
      const arr = map.get(key) ?? [];
      arr.push(t);
      map.set(key, arr);
    });
    return map;
  }, [tasks]);

  const upcoming = useMemo(() => {
    return tasks
      .filter((t) => t.deadline)
      .sort((a, b) => compareAsc(parseISO(a.deadline!), parseISO(b.deadline!)))
      .slice(0, 8);
  }, [tasks]);

  // build 6-week grid
  const gridStart = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const days: Date[] = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  return (
    <aside className="flex flex-col gap-8">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-xs uppercase tracking-[0.28em] text-foreground">
            {format(month, "MMMM yyyy")}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMonth(addMonths(month, -1))}
              className="p-1 text-muted-foreground hover:text-foreground"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setMonth(addMonths(month, 1))}
              className="p-1 text-muted-foreground hover:text-foreground"
              aria-label="Next month"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px text-center font-display text-[10px] uppercase tracking-widest text-muted-foreground">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="py-1.5">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px">
          {days.map((d) => {
            const key = format(d, "yyyy-MM-dd");
            const items = dueByDay.get(key);
            const outside = !isSameMonth(d, month);
            const selected = selectedDate && isSameDay(d, selectedDate);
            const today = isToday(d);
            return (
              <button
                key={key}
                onClick={() =>
                  onSelectDate(selected ? null : d)
                }
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center text-xs transition-colors",
                  outside ? "text-muted-foreground/40" : "text-foreground",
                  selected
                    ? "bg-foreground text-background"
                    : "hover:bg-paper-deep",
                  today && !selected && "ring-1 ring-inset ring-foreground/60",
                )}
              >
                <span>{format(d, "d")}</span>
                {items && items.length > 0 && (
                  <span
                    className={cn(
                      "absolute bottom-1 h-1 w-1 rounded-full",
                      selected ? "bg-background" : "bg-foreground",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
        {selectedDate && (
          <button
            onClick={() => onSelectDate(null)}
            className="mt-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            Clear filter ×
          </button>
        )}
      </div>

      {(() => {
        const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
        const dayTasks = dateKey ? dueByDay.get(dateKey) : undefined;
        if (!dateKey || !dayTasks) return null;
        return (
          <div>
            <h3 className="mb-3 font-display text-xs uppercase tracking-[0.28em] text-foreground">
              {format(selectedDate!, "MMM d")}
            </h3>
            <ul className="space-y-2">
              {dayTasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-baseline gap-3 border-b border-border/60 pb-2"
                >
                  <span className="w-14 shrink-0 font-display text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {labels[t.quadrant]}
                  </span>
                  <span className="text-xs leading-snug text-foreground">
                    {t.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })()}

      <div>
        <h3 className="mb-3 font-display text-xs uppercase tracking-[0.28em] text-foreground">
          Upcoming
        </h3>
        {upcoming.length === 0 && (
          <p className="text-xs italic text-muted-foreground">
            No deadlines set.
          </p>
        )}
        <ul className="space-y-2">
          {upcoming.map((t) => {
            const d = parseISO(t.deadline!);
            const overdue = isPast(d) && !isToday(d);
            return (
              <li
                key={t.id}
                className="flex items-baseline gap-3 border-b border-border/60 pb-2"
              >
                <span
                  className={cn(
                    "w-14 shrink-0 font-display text-[10px] uppercase tracking-[0.18em]",
                    overdue
                      ? "text-destructive"
                      : isToday(d)
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {format(d, "MMM d")}
                </span>
                <span className="text-xs leading-snug text-foreground">
                  {t.title}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

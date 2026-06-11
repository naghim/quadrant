import { useDroppable } from "@dnd-kit/core";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Quadrant, Task } from "@/lib/types";
import { TaskItem } from "./TaskItem";
import { AddTaskInline } from "./AddTaskInline";

type Props = {
  id: Quadrant;
  label: string;
  index: number;
  tasks: Task[];
  highlightIds?: Set<string> | null;
  color?: string;
};

export function QuadrantCard({ id, label, index, tasks, highlightIds, color }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  // borders to make the 2x2 share interior hairlines
  const borderClasses = cn(
    "border-border",
    index % 2 === 0 ? "md:border-r" : "",
    index < 2 ? "md:border-b" : "",
    "border-b md:border-b", // mobile: stack with bottom borders
  );

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative flex min-h-[260px] flex-col p-6 transition-colors",
        borderClasses,
        isOver && "bg-paper-deep/60",
      )}
      style={color ? { backgroundColor: color } : undefined}
    >
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-xs uppercase tracking-[0.28em] text-foreground">
          {label}
        </h2>
        <span className="font-display text-[10px] text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="flex-1">
        <AnimatePresence initial={false}>
          {tasks.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              dimmed={highlightIds ? !highlightIds.has(t.id) : false}
            />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <p className="py-2 text-xs italic text-muted-foreground/70">
            Nothing here yet.
          </p>
        )}
      </div>

      <div className="mt-3 border-t border-border pt-2">
        <AddTaskInline quadrant={id} />
      </div>
    </div>
  );
}

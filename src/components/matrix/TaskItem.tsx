import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { format, isPast, isToday, parseISO } from "date-fns";
import { Check, Pencil, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";
import { taskActions } from "@/lib/tasks-store";
import { EditTaskDialog } from "./EditTaskDialog";

export function TaskItem({ task, dimmed }: { task: Task; dimmed?: boolean }) {
  const [editing, setEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  const deadline = task.deadline ? parseISO(task.deadline) : undefined;
  const overdue = deadline && isPast(deadline) && !isToday(deadline);
  const due = deadline && isToday(deadline);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: dimmed ? 0.35 : 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative flex cursor-grab items-start gap-3 border-b border-border/60 py-2.5 pl-1 pr-1 active:cursor-grabbing",
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          taskActions.complete(task.id);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        aria-label="Complete task"
        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-foreground transition-colors hover:bg-foreground hover:text-background"
      >
        <Check className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-100" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug text-foreground">{task.title}</p>
        {deadline && (
          <p
            className={cn(
              "mt-1 font-display text-[10px] uppercase tracking-[0.2em]",
              overdue
                ? "text-destructive"
                : due
                  ? "text-foreground"
                  : "text-muted-foreground",
            )}
          >
            {overdue ? "Overdue · " : due ? "Today · " : ""}
            {format(deadline, "MMM d")}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-60">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            setEditing(true);
          }}
          aria-label="Edit task"
          className="hover:text-foreground"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            taskActions.remove(task.id);
          }}
          aria-label="Delete task"
          className="hover:text-destructive"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      <EditTaskDialog task={task} open={editing} onOpenChange={setEditing} />
    </motion.div>
  );
}

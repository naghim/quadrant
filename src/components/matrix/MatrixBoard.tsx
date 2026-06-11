import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { QUADRANTS, type Quadrant, type Task } from "@/lib/types";
import { taskActions } from "@/lib/tasks-store";
import { useQuadrantLabels, useQuadrantColors } from "@/lib/settings-store";
import { QuadrantCard } from "./QuadrantCard";

type Props = {
  tasks: Task[];
  highlightIds: Set<string> | null;
};

export function MatrixBoard({ tasks, highlightIds }: Props) {
  const labels = useQuadrantLabels();
  const colors = useQuadrantColors();
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  function onStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }
  function onEnd(e: DragEndEvent) {
    setActiveId(null);
    const overId = e.over?.id as Quadrant | undefined;
    if (!overId) return;
    const task = tasks.find((t) => t.id === e.active.id);
    if (task && task.quadrant !== overId) taskActions.move(task.id, overId);
  }

  const active = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={onStart} onDragEnd={onEnd}>
      <div className="grid grid-cols-1 border border-border bg-background md:grid-cols-2">
        {QUADRANTS.map((q, i) => (
          <QuadrantCard
            key={q.id}
            id={q.id}
            label={labels[q.id]}
            color={colors[q.id] || undefined}
            index={i}
            tasks={tasks.filter((t) => t.quadrant === q.id)}
            highlightIds={highlightIds}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {active && (
          <div className="border border-foreground bg-background px-3 py-2 shadow-[4px_4px_0_0] shadow-foreground">
            <p className="text-sm">{active.title}</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

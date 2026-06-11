import { Component, useEffect, useMemo, useState, type ReactNode } from "react";
import { format } from "date-fns";
import { useTasks } from "@/lib/tasks-store";
import { usePageColor } from "@/lib/settings-store";
import { Header } from "@/components/matrix/Header";
import { MatrixBoard } from "@/components/matrix/MatrixBoard";
import { CalendarPanel } from "@/components/matrix/CalendarPanel";
import { HistorySheet } from "@/components/matrix/HistorySheet";
import { Toaster } from "@/components/ui/sonner";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              This page didn't load
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Something went wrong on our end. You can try refreshing or head back home.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => {
                  this.setState({ error: null });
                  window.location.reload();
                }}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Try again
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Index() {
  const tasks = useTasks();
  const pageColor = usePageColor();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (pageColor) {
      document.documentElement.style.setProperty("--background", pageColor);
    } else {
      document.documentElement.style.removeProperty("--background");
    }
  }, [pageColor]);

  const active = useMemo(() => tasks.filter((t) => !t.completedAt), [tasks]);
  const completedCount = tasks.length - active.length;

  const highlightIds = useMemo(() => {
    if (!selectedDate) return null;
    const key = format(selectedDate, "yyyy-MM-dd");
    return new Set(active.filter((t) => t.deadline === key).map((t) => t.id));
  }, [selectedDate, active]);

  return (
    <div className="mx-auto min-h-screen max-w-[1320px] px-6 py-6">
      <Header onOpenHistory={() => setHistoryOpen(true)} completedCount={completedCount} />

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_280px]">
        <MatrixBoard tasks={active} highlightIds={highlightIds} />
        <CalendarPanel tasks={active} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      <footer className="mt-16 flex items-center justify-between border-t border-border pt-6 font-display text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        <span>Four quadrants. One mind.</span>
        <span>{active.length} active</span>
      </footer>

      <HistorySheet open={historyOpen} onOpenChange={setHistoryOpen} tasks={tasks} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Index />
      <Toaster position="bottom-right" />
    </ErrorBoundary>
  );
}

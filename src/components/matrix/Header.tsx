import { format } from "date-fns";
import { Archive } from "lucide-react";
import { BackupMenu } from "./BackupMenu";

type Props = {
  onOpenHistory: () => void;
  completedCount: number;
};

export function Header({ onOpenHistory, completedCount }: Props) {
  const today = new Date();
  return (
    <header className="flex items-end justify-between border-b border-border pb-6">
      <div>
        <h1 className="font-display text-4xl font-light tracking-tight text-foreground">
          quadrant<span className="text-muted-foreground">.</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{format(today, "EEEE, MMMM d, yyyy")}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenHistory}
          className="group inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          <Archive className="h-3.5 w-3.5" />
          History
          {completedCount > 0 && (
            <span className="ml-1 text-[10px] text-muted-foreground group-hover:text-background/70">
              {completedCount}
            </span>
          )}
        </button>
        <BackupMenu />
      </div>
    </header>
  );
}

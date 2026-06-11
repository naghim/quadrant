import { useRef, useState } from "react";
import { Download, Upload, Settings, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { taskActions } from "@/lib/tasks-store";
import { SettingsDialog } from "./SettingsDialog";

export function BackupMenu() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingJson, setPendingJson] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  function handleExport() {
    const json = taskActions.exportJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `matrix-backup-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Backup exported");
  }

  function pickFile() {
    fileRef.current?.click();
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting same file
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const incoming = Array.isArray(parsed) ? parsed : parsed.tasks;
      if (!Array.isArray(incoming)) throw new Error("Invalid file");
      setPendingJson(text);
      setPendingCount(incoming.length);
    } catch (err) {
      console.error(err);
      toast.error("Couldn't read that file");
    }
  }

  function confirmImport(mode: "replace" | "merge") {
    if (!pendingJson) return;
    try {
      const n = taskActions.importJson(pendingJson, mode);
      toast.success(
        `${mode === "replace" ? "Replaced with" : "Merged"} ${n} task${n === 1 ? "" : "s"}`,
      );
    } catch (err) {
      console.error(err);
      toast.error("Import failed");
    } finally {
      setPendingJson(null);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Backup menu"
            className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="border-border">
          <DropdownMenuItem onClick={handleExport} className="gap-2 text-xs uppercase tracking-[0.16em]">
            <Download className="h-3.5 w-3.5" />
            Export backup
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={pickFile} className="gap-2 text-xs uppercase tracking-[0.16em]">
            <Upload className="h-3.5 w-3.5" />
            Import backup
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSettingsOpen(true)} className="gap-2 text-xs uppercase tracking-[0.16em]">
            <Settings className="h-3.5 w-3.5" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleFile}
      />

      <AlertDialog
        open={pendingJson !== null}
        onOpenChange={(o) => !o && setPendingJson(null)}
      >
        <AlertDialogContent className="border border-border bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl font-light tracking-tight">
              Import {pendingCount} task{pendingCount === 1 ? "" : "s"}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Replace wipes your current tasks. Merge keeps both, skipping duplicates by id.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="text-[11px] uppercase tracking-[0.18em]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmImport("merge")}
              className="border border-border bg-background text-[11px] uppercase tracking-[0.18em] text-foreground hover:bg-paper-deep"
            >
              Merge
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => confirmImport("replace")}
              className="bg-foreground text-[11px] uppercase tracking-[0.18em] text-background"
            >
              Replace all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

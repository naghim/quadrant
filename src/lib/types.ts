export type Quadrant = "work" | "university" | "personal" | "misc";

export const QUADRANTS: { id: Quadrant; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "university", label: "University" },
  { id: "personal", label: "Personal" },
  { id: "misc", label: "Misc" },
];

export type Task = {
  id: string;
  title: string;
  quadrant: Quadrant;
  deadline?: string; // ISO date (yyyy-mm-dd)
  createdAt: string;
  completedAt?: string;
};

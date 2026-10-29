import type { Note } from "@/types/note";

export const viewLabels: Record<string, string> = {
  all: "All Notes",
  recent: "Recent",
  favorites: "Favorites",
  archived: "Archived",
  trash: "Junk",
  categories: "Categories",
};

export function belongsInView(note: Note, targetView: string): boolean {
  switch (targetView) {
    case "recent":
    case "all":
      return !note.isArchived && !note.isJunk;

    case "favorites":
      return note.isFavorite && !note.isArchived && !note.isJunk;

    case "archived":
      return note.isArchived && !note.isJunk;

    case "trash":
      return note.isJunk;

    default:
      return !note.isArchived && !note.isJunk;
  }
}

export function getDisplayedNotes(notes: Note[], view: string): Note[] {
  const visible = notes
    .filter((note) => belongsInView(note, view))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return view === "recent" ? visible.slice(0, 10) : visible;
}

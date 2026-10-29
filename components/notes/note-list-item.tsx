"use client";

import { Archive, ArchiveRestore, ArchiveX, Star, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Note } from "@/types/note";

type Props = {
  note: Note;
  isSelected: boolean;
  isUpdating: boolean;
  onSelect: (note: Note) => void;
  onToggleFavorite: (note: Note) => void;
  onToggleArchive: (note: Note) => void;
  onToggleJunk: (note: Note) => void;
};

export function NoteListItem({
  note,
  isSelected,
  isUpdating,
  onSelect,
  onToggleFavorite,
  onToggleArchive,
  onToggleJunk,
}: Props) {
  const archiveLabel = note.isArchived
    ? "Restore from archive"
    : "Archive note";

  const junkLabel = note.isJunk ? "Restore from Junk" : "Move to Junk";

  return (
    <div
      className={`border-b p-3 last:border-b-0 hover:bg-sidebar-accent/50 ${
        isSelected ? "bg-sidebar-accent" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          className="flex h-auto min-w-0 flex-1 flex-col items-start gap-2 whitespace-normal rounded-md px-2 py-1 text-left text-sm font-normal"
          onClick={() => onSelect(note)}
        >
          <span className="w-full truncate font-medium">{note.name} </span>
          {note.subject && (
            <span className="w-full truncate font-medium">{note.subject}</span>
          )}
          <span className="line-clamp-2 w-full text-wrap text-xs text-muted-foreground">
            {note.teaser || "No description"}
          </span>
          <span className="text-xs text-muted-foreground">{note.date}</span>
        </Button>

        <div className="flex shrink-0 flex-col items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={
              note.isFavorite ? "Remove from Favorites" : "Add to Favorites"
            }
            title={
              note.isFavorite ? "Remove from Favorites" : "Add to Favorites"
            }
            disabled={isUpdating}
            onClick={() => onToggleFavorite(note)}
          >
            <Star
              className={
                note.isFavorite
                  ? "size-4 fill-current text-yellow-500"
                  : "size-4"
              }
            />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={archiveLabel}
            title={archiveLabel}
            disabled={isUpdating}
            onClick={() => onToggleArchive(note)}
          >
            {note.isArchived ? (
              <ArchiveRestore className="size-4" />
            ) : (
              <Archive className="size-4" />
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label={junkLabel}
            title={junkLabel}
            disabled={isUpdating}
            onClick={() => onToggleJunk(note)}
          >
            {note.isJunk ? (
              <Undo2 className="size-4" />
            ) : (
              <ArchiveX className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

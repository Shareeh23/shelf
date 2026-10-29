"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
} from "@/components/ui/sidebar";

import { NoteListItem } from "@/components/notes/note-list-item";
import { viewLabels } from "@/lib/notes/note-filters";
import type { Note } from "@/types/note";

type Props = {
  notes: Note[];
  view: string;
  selectedNoteId: string | null;
  isLoading: boolean;
  updatingNoteId: string | null;
  onSelectNote: (note: Note) => void;
  onToggleFavorite: (note: Note) => void;
  onToggleArchive: (note: Note) => void;
  onToggleJunk: (note: Note) => void;
};

export function NoteListPanel({
  notes,
  view,
  selectedNoteId,
  isLoading,
  updatingNoteId,
  onSelectNote,
  onToggleFavorite,
  onToggleArchive,
  onToggleJunk,
}: Props) {
  return (
    <>
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="text-base font-medium text-foreground">
          {viewLabels[view] ?? "All Notes"}
        </div>

        <SidebarInput placeholder="Search notes..." />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {isLoading ? (
              <div className="p-4 text-sm text-muted-foreground">
                Loading notes...
              </div>
            ) : notes.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                No notes in this view.
              </div>
            ) : (
              notes.map((note) => (
                <NoteListItem
                  key={note.id}
                  note={note}
                  isSelected={selectedNoteId === note.id}
                  isUpdating={updatingNoteId === note.id}
                  onSelect={onSelectNote}
                  onToggleFavorite={onToggleFavorite}
                  onToggleArchive={onToggleArchive}
                  onToggleJunk={onToggleJunk}
                />
              ))
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}

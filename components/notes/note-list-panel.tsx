"use client";

import { useState, useMemo, useEffect } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredNotes = useMemo(() => {
    const query = debouncedQuery.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter((note) =>
      [note.title, note.category, note.description, note.content]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [notes, debouncedQuery]);

  return (
    <>
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="text-base font-medium text-foreground">
          {viewLabels[view] ?? "All Notes"}
        </div>

        <SidebarInput
          className="px-2"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            {isLoading ? (
              <div className="p-4 text-sm text-muted-foreground">
                Loading notes...
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">
                {searchQuery.trim()
                  ? "No matching notes found."
                  : "No notes in this view."}
              </div>
            ) : (
              filteredNotes.map((note) => (
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

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
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

const PAGE_SIZE = 10;

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const currentPage = Math.max(
    1,
    Math.floor(Number(searchParams.get("page"))) || 1,
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter notes
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredNotes.length / PAGE_SIZE);

  // Change page and update URL
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }

      const queryString = params.toString();

      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [searchParams, router, pathname],
  );

  const previousSearchQuery = useRef(searchQuery);
  const previousView = useRef(view);

  // Reset pagination when search or view changes
  useEffect(() => {
    const searchChanged = previousSearchQuery.current !== searchQuery;
    const viewChanged = previousView.current !== view;

    previousSearchQuery.current = searchQuery;
    previousView.current = view;

    if (!searchChanged && !viewChanged) return;

    const params = new URLSearchParams(searchParams.toString());

    if (!params.has("page")) return;

    params.delete("page");

    const queryString = params.toString();

    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [searchQuery, view, searchParams, router, pathname]);

  // Adjust page if filtered results change
  useEffect(() => {
    // Wait until notes have finished loading
    if (isLoading) return;

    const lastValidPage = Math.max(totalPages, 1);

    if (currentPage <= lastValidPage) return;

    const params = new URLSearchParams(searchParams.toString());

    if (lastValidPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(lastValidPage));
    }

    const queryString = params.toString();

    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [isLoading, currentPage, totalPages, searchParams, router, pathname]);

  // Get notes for current page
  const paginatedNotes = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return filteredNotes.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredNotes, currentPage]);

  function handlePreviousPage() {
    handlePageChange(currentPage - 1);
  }

  function handleNextPage() {
    handlePageChange(currentPage + 1);
  }

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
              paginatedNotes.map((note) => (
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

      {!isLoading && totalPages > 1 && (
        <SidebarFooter className="flex-row items-center justify-between border-t px-4 py-3">
          <span className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </SidebarFooter>
      )}
    </>
  );
}

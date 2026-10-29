"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { NotePreview } from "@/components/notes/note-preview";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { belongsInView, getDisplayedNotes } from "@/lib/notes/note-filters";

import { getErrorMessage, mapApiNote } from "@/lib/notes/note-mappers";

import type { ApiNote, Note, NoteDraft, NoteStatusChanges } from "@/types/note";

function createEmptyDraft(): NoteDraft {
  return {
    name: "",
    email: "",
    subject: "",
    sources: [""],
    content: "",
  };
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const view = searchParams.get("view") ?? "all";
  const noteIdFromUrl = searchParams.get("note");

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [draft, setDraft] = useState<NoteDraft>(createEmptyDraft);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [updatingNoteId, setUpdatingNoteId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const updateNoteUrl = useCallback(
    (noteId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (noteId) {
        params.set("note", noteId);
      } else {
        params.delete("note");
      }

      const query = params.toString();

      router.replace(query ? `/dashboard?${query}` : "/dashboard", {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notes", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("The server returned an invalid notes response.");
      }

      setNotes((data as ApiNote[]).map(mapApiNote));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeNotes = async () => {
      await loadNotes();
    };

    void initializeNotes();
  }, [loadNotes]);

  useEffect(() => {
    const syncSelectedNote = async () => {
      if (isLoading) return;

      if (!noteIdFromUrl) {
        setSelectedNote(null);
        return;
      }

      const noteFromUrl = notes.find((note) => note.id === noteIdFromUrl);

      if (noteFromUrl && belongsInView(noteFromUrl, view)) {
        setSelectedNote((current) =>
          current?.id === noteFromUrl.id ? current : noteFromUrl,
        );
        setIsCreating(false);
        setIsEditing(false);
      } else {
        setSelectedNote(null);
      }
    };

    void syncSelectedNote();
  }, [isLoading, noteIdFromUrl, notes, view]);

  function resetEditor() {
    setIsCreating(false);
    setIsEditing(false);
    setDraft(createEmptyDraft());
  }

  async function updateNoteStatus(note: Note, changes: NoteStatusChanges) {
    if (updatingNoteId) return;

    setUpdatingNoteId(note.id);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const updatedNote = mapApiNote((await response.json()) as ApiNote);

      setNotes((current) =>
        current.map((noteItem) =>
          noteItem.id === updatedNote.id ? updatedNote : noteItem,
        ),
      );

      setSelectedNote((current) =>
        !current || current.id !== updatedNote.id
          ? current
          : belongsInView(updatedNote, view)
            ? updatedNote
            : null,
      );

      if (!belongsInView(updatedNote, view)) {
        updateNoteUrl(null);
        setIsDeleteDialogOpen(false);
        resetEditor();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update note status.",
      );
    } finally {
      setUpdatingNoteId(null);
    }
  }

  const handleToggleFavorite = (note: Note) =>
    void updateNoteStatus(note, {
      isFavorite: !note.isFavorite,
    });

  const handleToggleArchive = (note: Note) =>
    void updateNoteStatus(note, {
      isArchived: !note.isArchived,
    });

  const handleToggleJunk = (note: Note) =>
    void updateNoteStatus(note, {
      isJunk: !note.isJunk,
    });

  function handleCreateNote() {
    updateNoteUrl(null);
    setSelectedNote(null);
    setDraft(createEmptyDraft());
    setIsEditing(false);
    setIsCreating(true);
    setError(null);
  }

  function handleCancelEdit() {
    resetEditor();
    setError(null);
  }

  function handleSelectNote(note: Note) {
    updateNoteUrl(note.id);
    setSelectedNote(note);
    resetEditor();
    setError(null);
  }

  function handleEditNote() {
    if (!selectedNote) return;

    setDraft({
      name: selectedNote.name,
      email: selectedNote.email === "Uncategorized" ? "" : selectedNote.email,
      subject: selectedNote.subject,
      sources:
        selectedNote.sources.length > 0 ? [...selectedNote.sources] : [""],
      content: selectedNote.content,
    });

    setIsEditing(true);
    setIsCreating(true);
    setError(null);
  }

  async function handleSaveNote() {
    if (!draft.name.trim() || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: draft.name.trim(),
          category: draft.email.trim() || "Uncategorized",
          description: draft.subject.trim(),
          content: draft.content.trim(),
          sources: draft.sources.map((source) => source.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const createdNote = mapApiNote((await response.json()) as ApiNote);

      setNotes((current) => [createdNote, ...current]);

      updateNoteUrl(createdNote.id);
      setSelectedNote(createdNote);
      resetEditor();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save note.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdateNote() {
    if (!selectedNote || !draft.name.trim() || isSaving) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${selectedNote.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: draft.name.trim(),
          category: draft.email.trim() || "General",
          description: draft.subject.trim(),
          sources: draft.sources.map((source) => source.trim()).filter(Boolean),
          content: draft.content.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const updatedNote = mapApiNote((await response.json()) as ApiNote);

      setNotes((current) =>
        current.map((note) =>
          note.id === updatedNote.id ? updatedNote : note,
        ),
      );

      setSelectedNote(updatedNote);
      resetEditor();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update note.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteNote() {
    if (!selectedNote || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${selectedNote.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setNotes((current) =>
        current.filter((note) => note.id !== selectedNote.id),
      );

      updateNoteUrl(null);
      setSelectedNote(null);
      setIsDeleteDialogOpen(false);
      resetEditor();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note.");
    } finally {
      setIsSaving(false);
    }
  }

  const displayedNotes = getDisplayedNotes(notes, view);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as CSSProperties
      }
    >
      <AppSidebar
        notes={displayedNotes}
        selectedNoteId={selectedNote?.id ?? null}
        isCreating={isCreating}
        isEditing={isEditing}
        draft={draft}
        isLoading={isLoading}
        isSaving={isSaving}
        error={error}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
        onDraftChange={setDraft}
        onSaveNote={handleSaveNote}
        onUpdateNote={handleUpdateNote}
        onCancelCreate={handleCancelEdit}
        updatingNoteId={updatingNoteId}
        onToggleFavorite={handleToggleFavorite}
        onToggleArchive={handleToggleArchive}
        onToggleJunk={handleToggleJunk}
      />

      <SidebarInset>
        <DashboardHeader
          view={view}
          isCreating={isCreating}
          isEditing={isEditing}
        />

        <main className="min-w-0 flex-1 overflow-y-auto p-6">
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {error}

              <button
                type="button"
                className="ml-2 underline underline-offset-4"
                onClick={() => void loadNotes()}
              >
                Retry
              </button>
            </div>
          )}

          <NotePreview
            selectedNote={selectedNote}
            isCreating={isCreating}
            isEditing={isEditing}
            draft={draft}
            isDeleteDialogOpen={isDeleteDialogOpen}
            onCreateNote={handleCreateNote}
            onEditNote={handleEditNote}
            onCancelEdit={handleCancelEdit}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onDeleteDialogChange={setIsDeleteDialogOpen}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  AppSidebar,
  type Note,
  type NoteDraft,
} from "@/components/app-sidebar";

import { NotePreview } from "@/components/notes/note-preview";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

function createEmptyDraft(): NoteDraft {
  return {
    name: "",
    email: "",
    subject: "",
    sources: [""],
    content: "",
  };
}

const viewLabels: Record<string, string> = {
  all: "All Notes",
  recent: "Recent",
  favorites: "Favorites",
  archived: "Archived",
  trash: "Trash",
};

type ApiNote = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  content: string;
  isArchived: boolean;
  isJunk: boolean;
  isFavorite: boolean;
  sources: string[] | string | null;
  createdAt: string | Date;
  updatedAt: string | number | Date;
};

function createTeaser(content: string): string {
  return (
    content
      .replace(/`[\s\S]*?`/g, " ")
      .replace(/[#>*_`~-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180) || "No content yet."
  );
}

function formatDate(value: string | number | Date): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function parseSources(value: ApiNote["sources"]): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (source): source is string => typeof source === "string",
    );
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.filter(
        (source): source is string => typeof source === "string",
      );
    }
  } catch {
    // Support existing records where sources may be stored as a single URL.
  }

  return [value];
}

function mapApiNote(apiNote: ApiNote): Note {
  const content = apiNote.content ?? "";
  const timestamp = new Date(apiNote.updatedAt ?? apiNote.createdAt).getTime();

  return {
    id: apiNote.id,
    name: apiNote.title,
    email: apiNote.category || "Uncategorized",
    subject: apiNote.description || "",
    sources: parseSources(apiNote.sources),
    date: formatDate(timestamp),
    teaser: createTeaser(content),
    content,
    isArchived: apiNote.isArchived ?? false,
    isJunk: apiNote.isJunk ?? false,
    isFavorite: apiNote.isFavorite ?? false,
    updatedAt: Number.isNaN(timestamp) ? 0 : timestamp,
  };
}

async function getErrorMessage(response: Response): Promise<string> {
  try {
    const body: { error?: string } = await response.json();
    return body.error || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
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

  function updateNoteUrl(noteId: string | null) {
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
  }

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

      const loadedNotes = (data as ApiNote[]).map(mapApiNote);

      setNotes(loadedNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchNotes() {
      await loadNotes();
    }

    void fetchNotes();
  }, [loadNotes]);

  function belongsInView(note: Note, targetView: string): boolean {
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

  // Restore the selected note from the URL, including on a page refresh.
  useEffect(() => {
    async function restoreSelectedNote() {
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
    }

    void restoreSelectedNote();
  }, [isLoading, noteIdFromUrl, notes, view]);

  async function updateNoteStatus(
    note: Note,
    changes: Partial<Pick<Note, "isArchived" | "isJunk" | "isFavorite">>,
  ) {
    if (updatingNoteId) return;

    setUpdatingNoteId(note.id);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const updatedNote = mapApiNote((await response.json()) as ApiNote);

      setNotes((currentNotes) =>
        currentNotes.map((current) =>
          current.id === updatedNote.id ? updatedNote : current,
        ),
      );

      setSelectedNote((current) => {
        if (!current || current.id !== updatedNote.id) return current;

        return belongsInView(updatedNote, view) ? updatedNote : null;
      });

      // If the note leaves the current view, clear its selection and URL.
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

  function handleToggleFavorite(note: Note) {
    void updateNoteStatus(note, { isFavorite: !note.isFavorite });
  }

  function handleToggleArchive(note: Note) {
    void updateNoteStatus(note, { isArchived: !note.isArchived });
  }

  function handleToggleJunk(note: Note) {
    void updateNoteStatus(note, { isJunk: !note.isJunk });
  }

  function resetEditor() {
    setIsCreating(false);
    setIsEditing(false);
    setDraft(createEmptyDraft());
  }

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

      const data: ApiNote = await response.json();
      const createdNote = mapApiNote(data);

      setNotes((currentNotes) => [createdNote, ...currentNotes]);
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
    if (!selectedNote || !draft.name.trim() || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${selectedNote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
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

      setNotes((currentNotes) =>
        currentNotes.map((note) =>
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

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== selectedNote.id),
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

  const visibleNotes = notes
    .filter((note) => belongsInView(note, view))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const displayedNotes =
    view === "recent" ? visibleNotes.slice(0, 10) : visibleNotes;

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

type DashboardHeaderProps = {
  view: string;
  isCreating: boolean;
  isEditing: boolean;
};

function DashboardHeader({
  view,
  isCreating,
  isEditing,
}: DashboardHeaderProps) {
  const pageTitle = isCreating
    ? isEditing
      ? "Edit Note Preview"
      : "New Note Preview"
    : (viewLabels[view] ?? "All Notes");

  return (
    <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b bg-background p-4">
      {" "}
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard">Lorebase</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator className="hidden md:block" />

          <BreadcrumbItem>
            <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}

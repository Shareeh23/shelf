"use client";

import { useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";

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

const emptyDraft: NoteDraft = {
  name: "",
  email: "",
  subject: "",
  source: "",
  content: "",
};

const viewLabels: Record<string, string> = {
  all: "All Notes",
  recent: "Recent",
  favorites: "Favorites",
  archived: "Archived",
  trash: "Trash",
};

function createTeaser(content: string): string {
  return (
    content
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/[#>*_`~-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180) || "No content yet."
  );
}

function createNote(draft: NoteDraft): Note {
  const content = draft.content.trim();

  return {
    id: crypto.randomUUID(),
    name: draft.name.trim(),
    email: draft.email.trim() || "Uncategorized",
    subject: draft.subject.trim(),
    source: draft.source.trim(),
    date: new Date().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    teaser: createTeaser(content),
    content,
  };
}

export default function Page() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "all";

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [draft, setDraft] = useState<NoteDraft>(emptyDraft);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  function resetEditor() {
    setIsCreating(false);
    setIsEditing(false);
    setDraft({ ...emptyDraft });
  }

  function handleCreateNote() {
    setSelectedNote(null);
    setDraft({ ...emptyDraft });
    setIsEditing(false);
    setIsCreating(true);
  }

  function handleCancelEdit() {
    resetEditor();
  }

  function handleSelectNote(note: Note) {
    setSelectedNote(note);
    resetEditor();
  }

  function handleEditNote() {
    if (!selectedNote) return;

    setDraft({
      name: selectedNote.name,
      email: selectedNote.email === "Uncategorized" ? "" : selectedNote.email,
      subject: selectedNote.subject,
      source: selectedNote.source,
      content: selectedNote.content,
    });

    setIsEditing(true);
    setIsCreating(true);
  }

  function handleSaveNote() {
    if (!draft.name.trim()) return;

    const note = createNote(draft);

    setNotes((currentNotes) => [note, ...currentNotes]);
    setSelectedNote(note);

    resetEditor();
  }

  function handleUpdateNote() {
    if (!selectedNote || !draft.name.trim()) return;

    const updatedNote: Note = {
      ...selectedNote,
      name: draft.name.trim(),
      email: draft.email.trim() || "Uncategorized",
      subject: draft.subject.trim(),
      source: draft.source.trim(),
      content: draft.content.trim(),
      teaser: createTeaser(draft.content.trim()),
    };

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note,
      ),
    );

    setSelectedNote(updatedNote);

    resetEditor();
  }

  function handleDeleteNote() {
    if (!selectedNote) return;

    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== selectedNote.id),
    );

    setSelectedNote(null);
    setIsDeleteDialogOpen(false);

    resetEditor();
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as CSSProperties
      }
    >
      <AppSidebar
        notes={notes}
        selectedNoteId={selectedNote?.id ?? null}
        isCreating={isCreating}
        isEditing={isEditing}
        draft={draft}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
        onDraftChange={setDraft}
        onSaveNote={handleSaveNote}
        onCancelCreate={handleCancelEdit}
      />

      <SidebarInset>
        <DashboardHeader
          view={view}
          isCreating={isCreating}
          isEditing={isEditing}
        />

        <main className="min-w-0 flex-1 overflow-y-auto p-6">
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

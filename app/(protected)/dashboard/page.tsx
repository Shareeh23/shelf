"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  AppSidebar,
  type Note,
  type NoteDraft,
} from "@/components/app-sidebar";
import { MarkdownRenderer } from "@/components/markdown-renderer";

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
    teaser:
      content
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/[#>*_`~-]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180) || "No content yet.",
    content,
  };
}

export default function Page() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "all";

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<NoteDraft>(emptyDraft);

  const handleCreateNote = () => {
    setSelectedNote(null);
    setDraft({ ...emptyDraft });
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setDraft({ ...emptyDraft });
  };

  const handleSaveNote = () => {
    if (!draft.name.trim()) return;

    const note = createNote(draft);

    setNotes((currentNotes) => [note, ...currentNotes]);
    setSelectedNote(note);
    setIsCreating(false);
    setDraft({ ...emptyDraft });
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsCreating(false);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        notes={notes}
        selectedNoteId={selectedNote?.id ?? null}
        isCreating={isCreating}
        draft={draft}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
        onDraftChange={setDraft}
        onSaveNote={handleSaveNote}
        onCancelCreate={handleCancelCreate}
      />

      <SidebarInset>
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
                <BreadcrumbPage>
                  {isCreating
                    ? "New Note Preview"
                    : (viewLabels[view] ?? "All Notes")}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="min-w-0 flex-1 p-6">
          {isCreating ? (
            <article className="mx-auto w-full max-w-3xl">
              <div className="mb-8 border-b pb-6">
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  LIVE PREVIEW
                </p>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {draft.name.trim() || "Untitled Note"}
                </h1>

                {draft.subject.trim() && (
                  <p className="mt-3 text-lg text-muted-foreground">
                    {draft.subject}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {draft.email.trim() && (
                    <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {draft.email}
                    </span>
                  )}

                  {draft.source.trim() && (
                    <a
                      href={draft.source}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary underline underline-offset-4"
                    >
                      View source
                    </a>
                  )}
                </div>
              </div>

              {draft.content.trim() ? (
                <MarkdownRenderer content={draft.content} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your rendered Markdown will appear here as you type.
                </p>
              )}
            </article>
          ) : selectedNote ? (
            <article className="mx-auto w-full max-w-3xl">
              <header className="mb-8 border-b pb-6">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {selectedNote.email}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    {selectedNote.date}
                  </span>

                  {selectedNote.source && (
                    <a
                      href={selectedNote.source}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-primary underline underline-offset-4"
                    >
                      Source
                    </a>
                  )}
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {selectedNote.name}
                </h1>

                {selectedNote.subject && (
                  <p className="mt-3 text-lg text-muted-foreground">
                    {selectedNote.subject}
                  </p>
                )}
              </header>

              {selectedNote.content ? (
                <MarkdownRenderer content={selectedNote.content} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  This note has no content yet.
                </p>
              )}
            </article>
          ) : (
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="max-w-sm text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border bg-muted/50">
                  <span className="text-xl">+</span>
                </div>

                <h1 className="text-xl font-semibold">Welcome to Lorebase</h1>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Your knowledge base starts here. Create a note to capture
                  ideas, save useful information, and build your personal
                  library.
                </p>
              </div>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

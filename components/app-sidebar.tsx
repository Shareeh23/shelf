"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { Sidebar } from "@/components/ui/sidebar";

import { SidebarSkeleton } from "@/components/sidebar/sidebar-skeleton";
import { SidebarNavigation } from "@/components/sidebar/sidebar-navigation";
import { CategoryBrowser } from "@/components/sidebar/category-browser";

import { NoteEditorForm } from "@/components/notes/note-editor-form";
import { NoteListPanel } from "@/components/notes/note-list-panel";

import type { AppSidebarProps } from "@/types/app-sidebar";

export function AppSidebar({
  notes,
  selectedNoteId,
  isCreating,
  isEditing,
  draft,
  isLoading,
  isSaving,
  error,
  onSelectNote,
  onCreateNote,
  onDraftChange,
  onSaveNote,
  onUpdateNote,
  onCancelCreate,
  updatingNoteId,
  onToggleFavorite,
  onToggleArchive,
  onToggleJunk,
  ...props
}: AppSidebarProps) {
  const currentView = useSearchParams().get("view") ?? "all";

  return (
    <Suspense fallback={<SidebarSkeleton />}>
      <Sidebar
        collapsible="icon"
        className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
        {...props}
      >
        <SidebarNavigation
          currentView={currentView}
          isCreating={isCreating}
          isEditing={isEditing}
          onCreateNote={onCreateNote}
          onCancelCreate={onCancelCreate}
        />

        <Sidebar collapsible="none" className="hidden min-w-0 flex-1 md:flex">
          {isCreating ? (
            <NoteEditorForm
              isEditing={isEditing}
              draft={draft}
              isSaving={isSaving}
              error={error}
              onDraftChange={onDraftChange}
              onSaveNote={onSaveNote}
              onUpdateNote={onUpdateNote}
              onCancel={onCancelCreate}
            />
          ) : currentView === "categories" ? (
            <CategoryBrowser
              notes={notes}
              selectedNoteId={selectedNoteId}
              isLoading={isLoading}
              onSelectNote={onSelectNote}
            />
          ) : (
            <NoteListPanel
              notes={notes}
              view={currentView}
              selectedNoteId={selectedNoteId}
              isLoading={isLoading}
              updatingNoteId={updatingNoteId}
              onSelectNote={onSelectNote}
              onToggleFavorite={onToggleFavorite}
              onToggleArchive={onToggleArchive}
              onToggleJunk={onToggleJunk}
            />
          )}
        </Sidebar>
      </Sidebar>
    </Suspense>
  );
}

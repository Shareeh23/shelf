import type * as React from "react";
import { Sidebar } from "@/components/ui/sidebar";
import type { Note, NoteDraft } from "@/types/note";

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  notes: Note[];
  selectedNoteId: string | null;
  isCreating: boolean;
  isEditing: boolean;
  draft: NoteDraft;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onDraftChange: (draft: NoteDraft) => void;
  onSaveNote: () => Promise<void>;
  onUpdateNote: () => Promise<void>;
  onCancelCreate: () => void;
  updatingNoteId: string | null;
  onToggleFavorite: (note: Note) => void;
  onToggleArchive: (note: Note) => void;
  onToggleJunk: (note: Note) => void;
};

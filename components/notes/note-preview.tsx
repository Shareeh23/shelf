import type { Note, NoteDraft } from "@/types/note";
import { MarkdownRenderer } from "@/components/notes/markdown-renderer";

import { Card, CardContent } from "@/components/ui/card";

import { DeleteNoteDialog } from "@/components/notes/note-delete-dialog";
import { NoteEmptyState } from "@/components/notes/note-empty-state";
import { NotePreviewHeader } from "@/components/notes/note-preview-header";

type NotePreviewProps = {
  selectedNote: Note | null;
  isCreating: boolean;
  isEditing: boolean;
  draft: NoteDraft;
  isDeleteDialogOpen: boolean;
  onCreateNote: () => void;
  onEditNote: () => void;
  onCancelEdit: () => void;
  onUpdateNote: () => void;
  onDeleteNote: () => void;
  onDeleteDialogChange: (open: boolean) => void;
};

export function NotePreview({
  selectedNote,
  isCreating,
  isEditing,
  draft,
  isDeleteDialogOpen,
  onCreateNote,
  onEditNote,
  onCancelEdit,
  onUpdateNote,
  onDeleteNote,
  onDeleteDialogChange,
}: NotePreviewProps) {
  if (isCreating) {
    return (
      <article className="mx-auto w-full max-w-3xl">
        <NotePreviewHeader
          title={draft.title}
          category={draft.category}
          description={draft.description}
          sources={draft.sources}
          isEditing={isEditing}
          isLivePreview
          canSave={Boolean(draft.title.trim())}
          onCancel={onCancelEdit}
          onSave={onUpdateNote}
        />

        {draft.content.trim() ? (
          <MarkdownRenderer content={draft.content} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Your rendered Markdown will appear here as you type.
          </p>
        )}
      </article>
    );
  }

  if (!selectedNote) {
    return <NoteEmptyState onCreateNote={onCreateNote} />;
  }

  return (
    <>
      <article className="mx-auto w-full min-w-0 max-w-3xl">
        <NotePreviewHeader
          title={selectedNote.title}
          category={selectedNote.category}
          description={selectedNote.description}
          sources={selectedNote.sources}
          date={selectedNote.date}
          onEdit={onEditNote}
          onDelete={() => onDeleteDialogChange(true)}
        />

        <Card className="border-0 shadow-none p-4">
          <CardContent className="px-0">
            {selectedNote.content ? (
              <MarkdownRenderer content={selectedNote.content} />
            ) : (
              <p className="text-sm text-muted-foreground">
                This note has no content yet.
              </p>
            )}
          </CardContent>
        </Card>
      </article>

      <DeleteNoteDialog
        open={isDeleteDialogOpen}
        noteTitle={selectedNote.title}
        onOpenChange={onDeleteDialogChange}
        onConfirm={onDeleteNote}
      />
    </>
  );
}

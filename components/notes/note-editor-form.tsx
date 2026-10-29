"use client";

import { Minus, Plus, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

import type { NoteDraft } from "@/types/note";

type Props = {
  isEditing: boolean;
  draft: NoteDraft;
  isSaving: boolean;
  error: string | null;
  onDraftChange: (draft: NoteDraft) => void;
  onSaveNote: () => Promise<void>;
  onUpdateNote: () => Promise<void>;
  onCancel: () => void;
};

export function NoteEditorForm({
  isEditing,
  draft,
  isSaving,
  error,
  onDraftChange,
  onSaveNote,
  onUpdateNote,
  onCancel,
}: Props) {
  const updateDraft = (field: keyof NoteDraft, value: string) => {
    onDraftChange({
      ...draft,
      [field]: value,
    });
  };

  return (
    <form
      id="note-editor-form"
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();

        if (isEditing) {
          void onUpdateNote();
        } else {
          void onSaveNote();
        }
      }}
    >
      <SidebarHeader className="gap-3 border-b p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-semibold">
            {isEditing ? "Edit Note" : "New Note"}
          </h2>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={onCancel}
            aria-label="Cancel editing"
          >
            <X className="size-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Write your note in Markdown.
        </p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="gap-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="note-title">Title</Label>

            <Input
              id="note-title"
              name="title"
              placeholder="Give your note a title"
              value={draft.name}
              onChange={(event) => updateDraft("name", event.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note-category">Category</Label>

            <Input
              id="note-category"
              name="category"
              placeholder="e.g. Development"
              value={draft.email}
              onChange={(event) => updateDraft("email", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note-description">Description</Label>

            <Input
              id="note-description"
              name="description"
              placeholder="A short summary"
              value={draft.subject}
              onChange={(event) => updateDraft("subject", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Sources</Label>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onDraftChange({
                    ...draft,
                    sources: [...draft.sources, ""],
                  })
                }
              >
                <Plus className="mr-1 size-4" />
                Add source
              </Button>
            </div>

            {draft.sources.map((source, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  id={`note-source-${index}`}
                  name={`sources[${index}]`}
                  type="url"
                  placeholder="https://..."
                  value={source}
                  onChange={(event) =>
                    onDraftChange({
                      ...draft,
                      sources: draft.sources.map((item, itemIndex) =>
                        itemIndex === index ? event.target.value : item,
                      ),
                    })
                  }
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove source ${index + 1}`}
                  disabled={draft.sources.length === 1}
                  onClick={() =>
                    onDraftChange({
                      ...draft,
                      sources: draft.sources.filter(
                        (_, itemIndex) => itemIndex !== index,
                      ),
                    })
                  }
                >
                  <Minus className="size-4" />
                </Button>
              </div>
            ))}

            <p className="text-xs text-muted-foreground">
              Add links to articles, documentation, videos, or other references.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note-content">Markdown content</Label>

            <Textarea
              id="note-content"
              name="content"
              placeholder={
                "# Heading\n\nWrite your note here...\n\n- First point\n- Second point"
              }
              value={draft.content}
              onChange={(event) => updateDraft("content", event.target.value)}
              className="min-h-70 resize-y font-mono text-sm leading-6"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto border-t p-4">
        <Button
          type="submit"
          className="w-full"
          disabled={!draft.name.trim() || isSaving}
        >
          <Save className="mr-2 size-4" />

          {isSaving
            ? isEditing
              ? "Updating..."
              : "Saving..."
            : isEditing
              ? "Update Note"
              : "Save Note"}
        </Button>
      </div>
    </form>
  );
}

import { BookOpen, Plus } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { Button } from "@/components/ui/button";

type NoteEmptyStateProps = {
  onCreateNote: () => void;
};

export function NoteEmptyState({ onCreateNote }: NoteEmptyStateProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpen />
          </EmptyMedia>

          <EmptyTitle>Welcome to Shelf</EmptyTitle>

          <EmptyDescription className="max-w-sm">
            Your knowledge base starts here. Create a note to capture ideas,
            save useful information, and build your personal library.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Button onClick={onCreateNote}>
            <Plus className="mr-2 size-4" />
            Create your first note
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}

import { ExternalLink, Pencil, Save, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NotePreviewHeaderProps = {
  title: string;
  category: string;
  description: string;
  sources: string[];
  date?: string;
  isEditing?: boolean;
  isLivePreview?: boolean;
  canSave?: boolean;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
};

export function NotePreviewHeader({
  title,
  category,
  description,
  sources,
  date,
  isEditing = false,
  isLivePreview = false,
  canSave = false,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: NotePreviewHeaderProps) {
  const validSources = sources
    .map((source) => source.trim())
    .filter((source) => {
      if (!source) return false;

      try {
        const url = new URL(source);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    });

  return (
    <header className="mb-8 space-y-5 border-b pb-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {isLivePreview ? "Live preview" : "Note"}
        </p>
        {isEditing ? (
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 size-4" />
              Cancel
            </Button>

            <Button type="button" disabled={!canSave} onClick={onSave}>
              <Save className="mr-2 size-4" />
              Update Note
            </Button>
          </div>
        ) : !isLivePreview ? (
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={onEdit}>
              <Pencil className="mr-2 size-4" />
              Edit Note
            </Button>

            <Button type="button" variant="destructive" onClick={onDelete}>
              Delete Note
            </Button>
          </div>
        ) : null}
      </div>
      <div className="space-y-3">
        <h1 className="wrap-break-word text-3xl font-bold tracking-tight sm:text-4xl">
          {title || "Untitled Note"}
        </h1>

        {description && (
          <p className="text-lg leading-7 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {category && <Badge variant="secondary">{category}</Badge>}

        {date && <span className="text-sm text-muted-foreground">{date}</span>}
      </div>
      {validSources.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium">Sources</h2>

          <ul className="space-y-2">
            {validSources.map((source, index) => (
              <li key={`${source}-${index}`}>
                <a
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: "link", size: "sm" }),
                    "h-auto max-w-full justify-start gap-1 px-0 text-left",
                  )}
                >
                  <span className="break-all">{source}</span>

                  <ExternalLink className="size-3.5 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

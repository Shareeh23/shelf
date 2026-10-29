"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";

import {
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";

import type { Note } from "@/types/note";

type Props = {
  notes: Note[];
  selectedNoteId: string | null;
  isLoading: boolean;
  onSelectNote: (note: Note) => void;
};

export function CategoryBrowser({
  notes,
  selectedNoteId,
  isLoading,
  onSelectNote,
}: Props) {
  const [expandedCategories, setExpandedCategories] = React.useState<
    Record<string, number>
  >({});

  const notesByCategory = React.useMemo(() => {
    const groups = new Map<string, Note[]>();

    for (const note of notes) {
      const category = note.email.trim().toLowerCase() || "general";

      groups.set(category, [...(groups.get(category) ?? []), note]);
    }

    return Array.from(groups.entries())
      .map(([category, categoryNotes]) => ({
        category,
        notes: categoryNotes.sort((a, b) => b.updatedAt - a.updatedAt),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [notes]);

  return (
    <>
      <SidebarHeader className="gap-3.5 border-b p-4">
        <div className="text-base font-medium text-foreground">Categories</div>

        <p className="text-xs text-muted-foreground">
          Browse notes by category.
        </p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-2">
          {isLoading ? (
            <p className="p-3 text-sm text-muted-foreground">
              Loading categories...
            </p>
          ) : notesByCategory.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">
              No categories yet.
            </p>
          ) : (
            <Accordion multiple className="w-full">
              {notesByCategory.map(({ category, notes: categoryNotes }) => {
                const visibleCount = Math.min(
                  expandedCategories[category] ?? 5,
                  categoryNotes.length,
                );

                const hasMore = visibleCount < categoryNotes.length;

                const canShowFewer = visibleCount > 5;

                return (
                  <AccordionItem key={category} value={category}>
                    <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="capitalize">{category}</span>

                        <span className="text-xs text-muted-foreground">
                          {categoryNotes.length}
                        </span>
                      </span>
                    </AccordionTrigger>

                    <AccordionContent className="pb-2">
                      <div className="space-y-1 pl-3">
                        {categoryNotes.slice(0, visibleCount).map((note) => (
                          <button
                            key={note.id}
                            type="button"
                            className={`block w-full truncate rounded-md px-3 py-2 text-left text-sm hover:bg-sidebar-accent ${
                              selectedNoteId === note.id
                                ? "bg-sidebar-accent"
                                : ""
                            }`}
                            onClick={() => onSelectNote(note)}
                            title={note.name}
                          >
                            {note.name}
                          </button>
                        ))}

                        {(hasMore || canShowFewer) && (
                          <div className="flex gap-1 px-3 pt-1">
                            {hasMore && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                aria-label={`Show 5 more ${category} notes`}
                                title="Show 5 more"
                                onClick={() =>
                                  setExpandedCategories((current) => ({
                                    ...current,
                                    [category]: Math.min(
                                      (current[category] ?? 5) + 5,
                                      categoryNotes.length,
                                    ),
                                  }))
                                }
                              >
                                <Plus className="size-4" />
                              </Button>
                            )}

                            {canShowFewer && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7"
                                aria-label={`Show 5 fewer ${category} notes`}
                                title="Show 5 fewer"
                                onClick={() =>
                                  setExpandedCategories((current) => ({
                                    ...current,
                                    [category]: Math.max(
                                      5,
                                      (current[category] ?? 5) - 5,
                                    ),
                                  }))
                                }
                              >
                                <Minus className="size-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}

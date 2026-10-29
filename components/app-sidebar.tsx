"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Archive,
  ArchiveRestore,
  BookOpen,
  Clock,
  Files,
  Plus,
  Minus,
  Save,
  Star,
  X,
  ArchiveX,
  Undo2,
  FolderTree,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type Note = {
  id: string;
  name: string;
  email: string;
  subject: string;
  sources: string[];
  date: string;
  teaser: string;
  content: string;
  isArchived: boolean;
  isJunk: boolean;
  isFavorite: boolean;
  updatedAt: number;
};

export type NoteDraft = {
  name: string;
  email: string;
  subject: string;
  sources: string[];
  content: string;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
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

const data = {
  user: {
    name: "Lorebase",
    email: "Your personal knowledge base",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "New Note",
      url: "/dashboard",
      view: "new",
      icon: <Plus />,
    },
    {
      title: "All Notes",
      url: "/dashboard",
      view: "all",
      icon: <Files />,
    },
    {
      title: "Categories",
      url: "/dashboard?view=categories",
      view: "categories",
      icon: <FolderTree />,
    },
    {
      title: "Recent",
      url: "/dashboard?view=recent",
      view: "recent",
      icon: <Clock />,
    },
    {
      title: "Favorites",
      url: "/dashboard?view=favorites",
      view: "favorites",
      icon: <Star />,
    },
    {
      title: "Archived",
      url: "/dashboard?view=archived",
      view: "archived",
      icon: <Archive />,
    },
    {
      title: "Junk",
      url: "/dashboard?view=trash",
      view: "trash",
      icon: <ArchiveX />,
    },
  ],
};

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
  const { setOpen } = useSidebar();

  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") ?? "all";

  const [expandedCategories, setExpandedCategories] = React.useState<
    Record<string, number>
  >({});

  function updateDraft(field: keyof NoteDraft, value: string) {
    onDraftChange({
      ...draft,
      [field]: value,
    });
  }

  const canSave = draft.name.trim().length > 0 && !isSaving;

  const notesByCategory = React.useMemo(() => {
    const groups = new Map<string, Note[]>();

    for (const note of notes) {
      const category = note.email.trim().toLowerCase() || "general";
      const categoryNotes = groups.get(category) ?? [];

      categoryNotes.push(note);
      groups.set(category, categoryNotes);
    }

    return Array.from(groups.entries())
      .map(([category, categoryNotes]) => ({
        category,
        notes: categoryNotes.sort((a, b) => b.updatedAt - a.updatedAt),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [notes]);

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* Navigation sidebar */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="md:h-8 md:p-0"
                tooltip="Lorebase"
                render={<Link href="/dashboard" />}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BookOpen className="size-4" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Lorebase</span>
                  <span className="truncate text-xs">Knowledge Base</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => {
                  const isActive =
                    item.view === "new"
                      ? isCreating && !isEditing
                      : !isCreating && currentView === item.view;

                  if (item.view === "new") {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          tooltip={{
                            children: item.title,
                            hidden: false,
                          }}
                          isActive={isActive}
                          className="px-2.5 md:px-2"
                          onClick={() => {
                            onCreateNote();
                            setOpen(true);
                          }}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={{
                          children: item.title,
                          hidden: false,
                        }}
                        isActive={isActive}
                        className="px-2.5 md:px-2"
                        render={
                          <Link
                            href={item.url}
                            onClick={() => {
                              onCancelCreate();
                              setOpen(true);
                            }}
                          />
                        }
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* Middle panel: Markdown editor, categories, or note list */}
      <Sidebar collapsible="none" className="hidden min-w-0 flex-1 md:flex">
        {isCreating ? (
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
                  onClick={onCancelCreate}
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
                    onChange={(event) =>
                      updateDraft("name", event.target.value)
                    }
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
                    onChange={(event) =>
                      updateDraft("email", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note-description">Description</Label>
                  <Input
                    id="note-description"
                    name="description"
                    placeholder="A short summary"
                    value={draft.subject}
                    onChange={(event) =>
                      updateDraft("subject", event.target.value)
                    }
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
                    Add links to articles, documentation, videos, or other
                    references.
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
                    onChange={(event) =>
                      updateDraft("content", event.target.value)
                    }
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
              <Button type="submit" className="w-full" disabled={!canSave}>
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
        ) : currentView === "categories" ? (
          <>
            <SidebarHeader className="gap-3.5 border-b p-4">
              <div className="text-base font-medium text-foreground">
                Categories
              </div>

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
                    {notesByCategory.map(
                      ({ category, notes: categoryNotes }) => {
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
                                {categoryNotes
                                  .slice(0, visibleCount)
                                  .map((note) => (
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
                      },
                    )}
                  </Accordion>
                )}
              </SidebarGroup>
            </SidebarContent>
          </>
        ) : (
          <>
            <SidebarHeader className="gap-3.5 border-b p-4">
              <div className="text-base font-medium text-foreground">
                {{
                  all: "All Notes",
                  recent: "Recent",
                  favorites: "Favorites",
                  archived: "Archived",
                  trash: "Junk",
                }[currentView] ?? "All Notes"}
              </div>

              <SidebarInput placeholder="Search notes..." />
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup className="px-0">
                <SidebarGroupContent>
                  {isLoading ? (
                    <div className="p-4 text-sm text-muted-foreground">
                      Loading notes...
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">
                      No notes in this view.
                    </div>
                  ) : (
                    notes.map((note) => {
                      const isUpdating = updatingNoteId === note.id;

                      const archiveLabel = note.isArchived
                        ? "Restore from archive"
                        : "Archive note";

                      const junkLabel = note.isJunk
                        ? "Restore from Junk"
                        : "Move to Junk";

                      return (
                        <div
                          key={note.id}
                          className={`border-b p-3 last:border-b-0 hover:bg-sidebar-accent/50 ${
                            selectedNoteId === note.id
                              ? "bg-sidebar-accent"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onSelectNote(note)}
                              className="flex min-w-0 flex-1 flex-col items-start gap-2 text-left text-sm leading-tight"
                            >
                              <span className="w-full truncate font-medium">
                                {note.name}
                              </span>

                              {note.subject && (
                                <span className="w-full truncate font-medium">
                                  {note.subject}
                                </span>
                              )}

                              <span className="line-clamp-2 w-full whitespace-normal text-xs text-muted-foreground">
                                {note.teaser || "No description"}
                              </span>

                              <span className="text-xs text-muted-foreground">
                                {note.date}
                              </span>
                            </button>

                            <div className="flex shrink-0 flex-col items-center gap-0.5">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                aria-label={
                                  note.isFavorite
                                    ? "Remove from Favorites"
                                    : "Add to Favorites"
                                }
                                title={
                                  note.isFavorite
                                    ? "Remove from Favorites"
                                    : "Add to Favorites"
                                }
                                disabled={isUpdating}
                                onClick={() => onToggleFavorite(note)}
                              >
                                <Star
                                  className={`size-4 ${
                                    note.isFavorite
                                      ? "fill-current text-yellow-500"
                                      : ""
                                  }`}
                                />
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                aria-label={archiveLabel}
                                title={archiveLabel}
                                disabled={isUpdating}
                                onClick={() => onToggleArchive(note)}
                              >
                                {note.isArchived ? (
                                  <ArchiveRestore className="size-4" />
                                ) : (
                                  <Archive className="size-4" />
                                )}
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                aria-label={junkLabel}
                                title={junkLabel}
                                disabled={isUpdating}
                                onClick={() => onToggleJunk(note)}
                              >
                                {note.isJunk ? (
                                  <Undo2 className="size-4" />
                                ) : (
                                  <ArchiveX className="size-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </>
        )}
      </Sidebar>
    </Sidebar>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Archive,
  BookOpen,
  Clock,
  Files,
  Plus,
  Save,
  Star,
  Trash2,
  X,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type Note = {
  id: string;
  name: string;
  email: string;
  subject: string;
  source: string;
  date: string;
  teaser: string;
  content: string;
};

export type NoteDraft = {
  name: string;
  email: string;
  subject: string;
  source: string;
  content: string;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  notes: Note[];
  selectedNoteId: string | null;
  isCreating: boolean;
  isEditing: boolean;
  draft: NoteDraft;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onDraftChange: (draft: NoteDraft) => void;
  onSaveNote: () => void;
  onCancelCreate: () => void;
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
      title: "Trash",
      url: "/dashboard?view=trash",
      view: "trash",
      icon: <Trash2 />,
    },
  ],
};

export function AppSidebar({
  notes,
  selectedNoteId,
  isCreating,
  isEditing,
  draft,
  onSelectNote,
  onCreateNote,
  onDraftChange,
  onSaveNote,
  onCancelCreate,
  ...props
}: AppSidebarProps) {
  const { setOpen } = useSidebar();

  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") ?? "all";

  const updateDraft = (field: keyof NoteDraft, value: string) => {
    onDraftChange({
      ...draft,
      [field]: value,
    });
  };

  const canSave = draft.name.trim().length > 0;

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

      {/* Middle panel: Markdown editor or note list */}
      <Sidebar collapsible="none" className="hidden min-w-0 flex-1 md:flex">
        {isCreating ? (
          <>
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
                    placeholder="Give your note a title"
                    value={draft.name}
                    onChange={(event) =>
                      updateDraft("name", event.target.value)
                    }
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note-category">Category</Label>
                  <Input
                    id="note-category"
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
                    placeholder="A short summary"
                    value={draft.subject}
                    onChange={(event) =>
                      updateDraft("subject", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note-source">Source URL</Label>
                  <Input
                    id="note-source"
                    type="url"
                    placeholder="https://..."
                    value={draft.source}
                    onChange={(event) =>
                      updateDraft("source", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note-content">Markdown content</Label>
                  <Textarea
                    id="note-content"
                    placeholder={
                      "# Heading\n\nWrite your note here...\n\n- First point\n- Second point"
                    }
                    value={draft.content}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateDraft("content", event.target.value)
                    }
                    className="min-h-70 resize-y font-mono text-sm leading-6"
                  />
                </div>
              </SidebarGroup>
            </SidebarContent>

            {!isEditing && (
              <div className="border-t p-4">
                <Button
                  type="button"
                  className="w-full"
                  disabled={!canSave}
                  onClick={onSaveNote}
                >
                  <Save className="mr-2 size-4" />
                  Save Note
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <SidebarHeader className="gap-3.5 border-b p-4">
              <div className="text-base font-medium text-foreground">
                All Notes
              </div>

              <SidebarInput placeholder="Search notes..." />
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup className="px-0">
                <SidebarGroupContent>
                  {notes.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">
                      No notes yet. Click New Note to create one.
                    </div>
                  ) : (
                    notes.map((note) => (
                      <button
                        type="button"
                        key={note.id}
                        onClick={() => onSelectNote(note)}
                        className={`flex w-full flex-col items-start gap-2 border-b p-4 text-left text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                          selectedNoteId === note.id ? "bg-sidebar-accent" : ""
                        }`}
                      >
                        <div className="flex w-full items-center gap-2">
                          <span className="truncate font-medium">
                            {note.name}
                          </span>

                          <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                            {note.date}
                          </span>
                        </div>

                        {note.subject && (
                          <span className="font-medium">{note.subject}</span>
                        )}

                        <span className="line-clamp-2 w-full whitespace-normal text-xs text-muted-foreground">
                          {note.teaser || "No description"}
                        </span>
                      </button>
                    ))
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

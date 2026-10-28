"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { AppSidebar, type Note } from "@/components/app-sidebar";
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

export default function Page() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "all";

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const viewLabels: Record<string, string> = {
    all: "All Notes",
    recent: "Recent",
    favorites: "Favorites",
    archived: "Archived",
    trash: "Trash",
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
        selectedNoteId={selectedNote?.id ?? null}
        onSelectNote={setSelectedNote}
      />

      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
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
                  {viewLabels[view] ?? "All Notes"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col p-6">
          {selectedNote ? (
            <article className="mx-auto w-full max-w-3xl">
              {/* Note metadata */}
              <header className="mb-8 border-b pb-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {selectedNote.email}
                  </span>

                  <span className="text-sm text-muted-foreground">
                    {selectedNote.date}
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {selectedNote.name}
                </h1>

                <p className="mt-3 text-lg text-muted-foreground">
                  {selectedNote.subject}
                </p>
              </header>

              {/* Markdown content */}
              <MarkdownRenderer content={selectedNote.content} />
            </article>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="max-w-sm text-center">
                <h1 className="text-xl font-semibold">Welcome to Lorebase</h1>

                <p className="mt-2 text-sm text-muted-foreground">
                  Select a note from the sidebar to start reading.
                </p>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

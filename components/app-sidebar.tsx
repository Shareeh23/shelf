"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Archive,
  BookOpen,
  Clock,
  Files,
  Star,
  Trash2,
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

const data = {
  user: {
    name: "Lorebase",
    email: "Your personal knowledge base",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "New Note", url: "/dashboard/new", view: "new", icon: <Plus /> },
    { title: "All Notes", url: "/dashboard", view: "all", icon: <Files /> },
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
  notes: [
    {
      name: "React Server Components",
      email: "Development",
      subject: "Understanding React Server Components",
      date: "10:30 AM",
      teaser:
        "Server Components render on the server and allow you to access server-side resources without sending component JavaScript to the client. Client Components are needed for interactivity, state, and browser APIs.",
    },
    {
      name: "Database Indexing",
      email: "Backend",
      subject: "How B-tree indexes work",
      date: "Yesterday",
      teaser:
        "Database indexes improve query performance by reducing the amount of data the database needs to scan. B-tree indexes are useful for equality comparisons, range queries, and sorting. Composite indexes follow the leftmost-prefix rule.",
    },
    {
      name: "HTTP Caching",
      email: "Backend",
      subject: "Cache-Control directives",
      date: "Yesterday",
      teaser:
        "Cache-Control determines how responses can be cached. Use max-age to specify freshness lifetime, no-cache to require revalidation, and no-store to prevent storing a response. ETags can help validate cached resources.",
    },
    {
      name: "TypeScript Generics",
      email: "Development",
      subject: "Reusable type-safe functions",
      date: "2 days ago",
      teaser:
        "Generics allow functions, interfaces, and classes to work with different types while preserving type safety. Instead of using any, introduce a type parameter such as T to retain information about the input and output types.",
    },
    {
      name: "Learning with Active Recall",
      email: "Learning",
      subject: "Test yourself instead of rereading",
      date: "3 days ago",
      teaser:
        "Active recall strengthens learning by requiring you to retrieve information from memory. After studying a concept, close your notes and explain it in your own words. Review difficult concepts more frequently.",
    },
    {
      name: "Atomic Habits",
      email: "Personal Development",
      subject: "Make habits obvious and easy",
      date: "4 days ago",
      teaser:
        "Small improvements compound over time. Make desired habits obvious, attractive, easy, and satisfying. Reduce friction for good habits and increase friction for unwanted ones. Focus on building a system rather than relying entirely on motivation.",
    },
    {
      name: "Express.js Middleware",
      email: "Backend",
      subject: "Understanding middleware execution",
      date: "5 days ago",
      teaser:
        "Express middleware functions have access to the request, response, and next function. Middleware executes in registration order. Use next() to continue the chain, and ensure error-handling middleware follows the four-argument signature.",
    },
    {
      name: "System Design Fundamentals",
      email: "Architecture",
      subject: "Scaling a web application",
      date: "1 week ago",
      teaser:
        "Start with the application's requirements and identify potential bottlenecks. Consider caching, database indexing, connection pooling, load balancing, and asynchronous processing. Introduce complexity only when the requirements justify it.",
    },
    {
      name: "Quran Memorization",
      email: "Personal",
      subject: "A consistent daily revision routine",
      date: "1 week ago",
      teaser:
        "Prioritize consistency over volume. Review previously memorized passages before adding new verses. Recite from memory, check mistakes against the Mushaf, and revisit difficult passages regularly to strengthen retention.",
    },
    {
      name: "Project Ideas",
      email: "Development",
      subject: "Ideas worth exploring",
      date: "2 weeks ago",
      teaser:
        "Build projects that solve real problems and reinforce concepts you want to learn. Potential ideas include a developer knowledge base, a GitHub profile explorer, a personal finance tracker, and an AI-powered reading list. Keep the initial scope small and expand incrementally.",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const searchParams = useSearchParams();
  const { setOpen } = useSidebar();

  const currentView = searchParams.get("view") ?? "all";

  const activeItem =
    data.navMain.find((item) => item.view === currentView) ?? data.navMain[0];

  const [notes] = React.useState(data.notes);

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
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      isActive={activeItem.view === item.view}
                      className="px-2.5 md:px-2"
                      render={
                        <Link href={item.url} onClick={() => setOpen(true)} />
                      }
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* Notes list sidebar */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="text-base font-medium text-foreground">
            {activeItem.title}
          </div>

          <SidebarInput placeholder="Search notes..." />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {notes.map((note) => (
                <button
                  type="button"
                  key={note.name}
                  className="flex w-full flex-col items-start gap-2 border-b p-4 text-left text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <div className="flex w-full items-center gap-2">
                    <span className="truncate">{note.name}</span>
                    <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                      {note.date}
                    </span>
                  </div>

                  <span className="font-medium">{note.subject}</span>

                  <span className="line-clamp-2 w-full text-xs whitespace-normal text-muted-foreground">
                    {note.teaser}
                  </span>
                </button>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}

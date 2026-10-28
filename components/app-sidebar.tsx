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

export type Note = {
  id: string;
  name: string;
  email: string;
  subject: string;
  date: string;
  teaser: string;
  content: string;
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  selectedNoteId: string | null;
  onSelectNote: (note: Note) => void;
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
      url: "/dashboard/new",
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

  notes: [
    {
      id: "javascript-closures",
      name: "JavaScript Closures",
      email: "Development",
      subject: "Understanding lexical scope and closures",
      date: "Today",
      teaser:
        "Closures allow functions to retain access to variables from their outer lexical scope, even after the outer function has finished executing.",
      content: `# JavaScript Closures

A **closure** is created when a function retains access to variables from its outer lexical scope, even after the outer function has finished executing.

## Example

\`\`\`javascript
function createCounter() {
  let count = 0;

  return function () {
    count++;
    return count;
  };
}

const counter = createCounter();

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
\`\`\`

## Key Takeaways

- Inner functions can access variables from their outer functions.
- Closures preserve access to their lexical environment.
- Each call to \`createCounter()\` creates an independent counter.

## Common Use Cases

- Data privacy and encapsulation
- Function factories
- Event handlers
- Maintaining state between function calls
`,
    },
    {
      id: "sql-transactions",
      name: "SQL Transactions",
      email: "Backend",
      subject: "Understanding ACID properties",
      date: "Today",
      teaser:
        "Database transactions group operations into a single logical unit. ACID properties help ensure reliable and consistent data changes.",
      content: `# SQL Transactions

A **transaction** groups multiple database operations into a single logical unit of work.

## ACID Properties

- **Atomicity:** All operations succeed, or none of them do.
- **Consistency:** A transaction preserves database rules and constraints.
- **Isolation:** Concurrent transactions are protected from inappropriate interference.
- **Durability:** Committed changes persist even after a system failure.

## Example

\`\`\`sql
START TRANSACTION;

UPDATE accounts
SET balance = balance - 100
WHERE id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE id = 2;

COMMIT;
\`\`\`

## Rollback

If an operation fails before the transaction is committed, you can roll back the changes:

\`\`\`sql
ROLLBACK;
\`\`\`

## When to Use Transactions

- Transferring money between accounts
- Updating related records
- Maintaining data consistency across multiple operations
`,
    },
    {
      id: "react-useeffect",
      name: "React useEffect",
      email: "Development",
      subject: "Synchronizing components with external systems",
      date: "Yesterday",
      teaser:
        "The useEffect hook synchronizes a React component with external systems, such as browser APIs, subscriptions, and network connections.",
      content: `# React useEffect

The \`useEffect\` hook lets a component synchronize with external systems.

## Basic Example

\`\`\`tsx
import { useEffect, useState } from "react";

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

## Dependency Array

- No dependency array: the effect runs after every commit.
- Empty array \`[]\`: the effect runs after the initial mount, subject to Strict Mode behavior.
- \`[count]\`: the effect re-synchronizes when \`count\` changes.

## Cleanup

Effects can return a cleanup function to remove subscriptions, clear timers, or disconnect external resources.

\`\`\`tsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Running...");
  }, 1000);

  return () => clearInterval(timer);
}, []);
\`\`\`

## Important

Don't use effects for values that can be calculated directly during rendering. Use them when synchronization with an external system is necessary.
`,
    },
    {
      id: "http-status-codes",
      name: "HTTP Status Codes",
      email: "Backend",
      subject: "Understanding response status codes",
      date: "2 days ago",
      teaser:
        "HTTP status codes communicate whether a request succeeded, requires further action, or failed due to a client or server error.",
      content: `# HTTP Status Codes

HTTP status codes describe the outcome of an HTTP request.

## 1xx — Informational

The request has been received and processing is continuing.

## 2xx — Success

- **200 OK:** The request succeeded.
- **201 Created:** A resource was created successfully.
- **204 No Content:** The request succeeded without a response body.

## 3xx — Redirection

- **301 Moved Permanently:** The resource has a permanent new URL.
- **302 Found:** The resource is temporarily available at another URL.
- **304 Not Modified:** A cached representation can be reused.

## 4xx — Client Errors

- **400 Bad Request:** The request is invalid.
- **401 Unauthorized:** Valid authentication credentials are required.
- **403 Forbidden:** The server refuses to fulfill the request.
- **404 Not Found:** The requested resource was not found.
- **429 Too Many Requests:** The client has sent too many requests.

## 5xx — Server Errors

- **500 Internal Server Error:** An unexpected server error occurred.
- **502 Bad Gateway:** A gateway received an invalid response from an upstream server.
- **503 Service Unavailable:** The server cannot currently handle the request.

## Best Practice

Choose status codes that accurately describe the result of the operation, and return a consistent response body containing useful error information when appropriate.
`,
    },
    {
      id: "spaced-repetition",
      name: "Spaced Repetition",
      email: "Learning",
      subject: "Remember more through scheduled reviews",
      date: "3 days ago",
      teaser:
        "Spaced repetition improves long-term retention by reviewing information at increasing intervals, especially when combined with active recall.",
      content: `# Spaced Repetition

**Spaced repetition** is a learning technique that schedules reviews over time rather than concentrating them into a single session.

## How It Works

Instead of reviewing a topic repeatedly in one sitting, revisit it at intervals.

For example:

1. Learn the concept today.
2. Review it tomorrow.
3. Review it again after three days.
4. Review it after one week.
5. Continue reviewing based on how well you remember it.

These intervals are illustrative, not a universal schedule.

## Combine It With Active Recall

During each review:

- Close your notes.
- Explain the concept from memory.
- Answer questions without looking at the answer.
- Check your mistakes.
- Schedule another review based on how difficult the material was.

## Example: Learning React

For a topic like \`useEffect\`:

- Day 1: Learn its purpose and syntax.
- Day 2: Explain dependency arrays from memory.
- Day 4: Write an example without referring to your notes.
- Day 7: Solve a problem involving effect cleanup.

## Key Takeaway

The goal isn't to reread information as often as possible. It's to retrieve it from memory at appropriate intervals and strengthen what you struggle to remember.
`,
    },
  ] satisfies Note[],
};

export function AppSidebar({
  selectedNoteId,
  onSelectNote,
  ...props
}: AppSidebarProps) {
  const searchParams = useSearchParams();
  const { setOpen } = useSidebar();

  const currentView = searchParams.get("view") ?? "all";

  const activeItem =
    data.navMain.find((item) => item.view === currentView) ??
    data.navMain[1];

  const notes: Note[] = data.notes;

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
                        <Link
                          href={item.url}
                          onClick={() => setOpen(true)}
                        />
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
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  className={`flex w-full flex-col items-start gap-2 border-b p-4 text-left text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                    selectedNoteId === note.id ? "bg-sidebar-accent" : ""
                  }`}
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
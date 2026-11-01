"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import {
  Archive,
  ArchiveX,
  BookOpen,
  Clock,
  Files,
  FolderTree,
  Plus,
  Star,
} from "lucide-react";

import { NavUser } from "@/components/sidebar/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "New Note",
    url: "/dashboard",
    view: "new",
    icon: Plus,
  },
  {
    title: "All Notes",
    url: "/dashboard",
    view: "all",
    icon: Files,
  },
  {
    title: "Categories",
    url: "/dashboard?view=categories",
    view: "categories",
    icon: FolderTree,
  },
  {
    title: "Recent",
    url: "/dashboard?view=recent",
    view: "recent",
    icon: Clock,
  },
  {
    title: "Favorites",
    url: "/dashboard?view=favorites",
    view: "favorites",
    icon: Star,
  },
  {
    title: "Archived",
    url: "/dashboard?view=archived",
    view: "archived",
    icon: Archive,
  },
  {
    title: "Junk",
    url: "/dashboard?view=trash",
    view: "trash",
    icon: ArchiveX,
  },
];

type Props = {
  currentView: string;
  isCreating: boolean;
  isEditing: boolean;
  onCreateNote: () => void;
  onCancelCreate: () => void;
};

export function SidebarNavigation({
  currentView,
  isCreating,
  isEditing,
  onCreateNote,
  onCancelCreate,
}: Props) {
  const { setOpen } = useSidebar();

  const { data: session } = authClient.useSession();

  return (
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
              tooltip="Shelf"
              render={<Link href="/dashboard" />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <BookOpen className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Shelf</span>
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
              {navItems.map((item) => {
                const Icon = item.icon;

                const isActive =
                  item.view === "new"
                    ? isCreating && !isEditing
                    : !isCreating && currentView === item.view;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      isActive={isActive}
                      className="px-2.5 md:px-2"
                      {...(item.view === "new"
                        ? {
                            onClick: () => {
                              onCreateNote();
                              setOpen(true);
                            },
                          }
                        : {
                            render: (
                              <Link
                                href={item.url}
                                onClick={() => {
                                  onCancelCreate();
                                  setOpen(true);
                                }}
                              />
                            ),
                          })}
                    >
                      <Icon />
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
        {session?.user && (
          <NavUser
            user={{
              name: session.user.name,
              email: session.user.email,
              avatar: session.user.image ?? "",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

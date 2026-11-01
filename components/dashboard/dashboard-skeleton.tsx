import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-87.5 shrink-0 border-r p-4 md:flex md:flex-col md:gap-5">
        {/* Sidebar header */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-8 w-full" />
        </div>

        {/* Note list */}
        <div className="flex flex-col gap-5 pt-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Dashboard header */}
        <header className="flex h-14 items-center justify-between border-b px-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="size-8 rounded-full" />
        </header>

        {/* Note preview */}
        <main className="flex-1 space-y-6 p-6">
          <div className="space-y-3">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>

          <div className="space-y-3 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </main>
      </div>
    </div>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      {/* Header */}
      <Skeleton className="h-5 w-28" />
      <Skeleton className="h-8 w-full" />

      {/* Note list */}
      <div className="flex flex-col gap-4 pt-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

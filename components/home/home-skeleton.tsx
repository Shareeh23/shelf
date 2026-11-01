import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <main className="flex min-h-svh flex-col">
      {/* Navbar */}
      <header className="border-b">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Skeleton className="h-6 w-28" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-28" />
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-16 w-3/4 max-w-md" />
          <Skeleton className="h-12 w-full max-w-xl" />
          <div className="mt-4 flex gap-4">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="h-11 w-32" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col items-center gap-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-xl border bg-background p-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </footer>
    </main>
  );
}

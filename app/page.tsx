import Link from "next/link";
import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthenticated = !!session;

  return (
    <main className="flex min-h-svh flex-col">
      {/* Navbar */}
      <header className="border-b">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Lorebase<span className="text-red-600">.</span>
          </Link>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button nativeButton={false} render={<Link href="/dashboard" />}>
                Open Lorebase
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  nativeButton={false}
                  render={<Link href="/login" />}
                >
                  Login
                </Button>

                <Button nativeButton={false} render={<Link href="/signup" />}>
                  Get started
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
            Your personal knowledge space
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Your knowledge,
            <br />
            <span className="text-red-600">organized.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            A simple space to create, organize, and manage your learning notes.
            Keep your knowledge accessible and build your personal library.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {isAuthenticated ? (
              <Button
                size="lg"
                nativeButton={false}
                render={<Link href="/dashboard" />}
              >
                Open Lorebase
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  nativeButton={false}
                  render={<Link href="/signup" />}
                >
                  Get started
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/login" />}
                >
                  Sign in
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Everything in its place.
            </h2>

            <p className="mt-3 text-muted-foreground">
              A straightforward way to manage your notes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Feature
              title="Create notes"
              description="Write, edit, and maintain your personal learning notes in one place."
            />

            <Feature
              title="Stay organized"
              description="Group notes into categories and browse your knowledge by topic."
            />

            <Feature
              title="Manage your notes"
              description="Mark favorites, archive notes, and move unwanted notes to Junk."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Lorebase.</span>
          <span>© {new Date().getFullYear()} Lorebase</span>
        </div>
      </footer>
    </main>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-background p-6">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

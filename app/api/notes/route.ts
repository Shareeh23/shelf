import { randomUUID } from "node:crypto";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { notes } from "@/lib/db/notes-schema";
import { createNoteSchema } from "@/lib/schema/notes";
import { getCachedUserNotes, getUserNotesCacheTag } from "@/lib/notes/cache";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userNotes = await getCachedUserNotes(session.user.id);

    return NextResponse.json(userNotes);
  } catch (error) {
    console.error("Failed to fetch notes:", error);

    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const result = createNoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: result.error.issues,
        },
        { status: 400 },
      );
    }

    const [createdNote] = await db
      .insert(notes)
      .values({
        id: randomUUID(),
        title: result.data.title,
        category: result.data.category,
        description: result.data.description,
        content: result.data.content,
        sources: result.data.sources,
        isArchived: result.data.isArchived,
        isJunk: result.data.isJunk,
        isFavorite: result.data.isFavorite,
        userId: session.user.id,
      })
      .returning();

    // Invalidate the user's cached notes
    revalidateTag(getUserNotesCacheTag(session.user.id), { expire: 0 });

    return NextResponse.json(createdNote, { status: 201 });
  } catch (error) {
    console.error("Failed to create note:", error);

    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 },
    );
  }
}

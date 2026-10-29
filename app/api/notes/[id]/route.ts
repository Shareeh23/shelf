import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notes } from "@/lib/db/notes-schema";
import { createNoteSchema } from "@/lib/schema/notes";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const updateNoteSchema = createNoteSchema.partial();

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    const result = updateNoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: result.error.issues,
        },
        { status: 400 },
      );
    }

    if (Object.keys(result.data).length === 0) {
      return NextResponse.json(
        { error: "At least one field is required" },
        { status: 400 },
      );
    }

    const changes = { ...result.data };

    // A note cannot be archived and in Junk simultaneously.
    if (changes.isArchived === true) {
      changes.isJunk = false;
    }

    if (changes.isJunk === true) {
      changes.isArchived = false;
    }

    const [updatedNote] = await db
      .update(notes)
      .set(changes)
      .where(
        and(
          eq(notes.id, id),
          eq(notes.userId, session.user.id),
        ),
      )
      .returning();

    if (!updatedNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("Failed to update note:", error);

    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;

    const [deletedNote] = await db
      .delete(notes)
      .where(
        and(
          eq(notes.id, id),
          eq(notes.userId, session.user.id),
        ),
      )
      .returning({ id: notes.id });

    if (!deletedNote) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 },
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete note:", error);

    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 },
    );
  }
}
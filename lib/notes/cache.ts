import { cacheLife, cacheTag } from "next/cache";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { notes } from "@/lib/db/notes-schema";

export function getUserNotesCacheTag(userId: string) {
  return `user-notes:${userId}`;
}

export async function getCachedUserNotes(userId: string) {
  "use cache";

  cacheLife("minutes");
  cacheTag(getUserNotesCacheTag(userId));

  return db
    .select()
    .from(notes)
    .where(eq(notes.userId, userId))
    .orderBy(desc(notes.updatedAt));
}

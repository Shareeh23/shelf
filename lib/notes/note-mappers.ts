import type { ApiNote, Note } from "@/types/note";

export function createTeaser(content: string): string {
  return (
    content
      .replace(/`[\s\S]*?`/g, " ")
      .replace(/[#>*_`~-]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180) || "No content yet."
  );
}

export function formatDate(value: string | number | Date): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function parseSources(value: ApiNote["sources"]): string[] {
  if (Array.isArray(value)) {
    return value.filter(
      (source): source is string => typeof source === "string",
    );
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.filter(
        (source): source is string => typeof source === "string",
      );
    }
  } catch {
    // Support existing records where sources may be stored as a single URL.
  }

  return [value];
}

export function mapApiNote(apiNote: ApiNote): Note {
  const content = apiNote.content ?? "";
  const timestamp = new Date(apiNote.updatedAt ?? apiNote.createdAt).getTime();

  return {
    id: apiNote.id,
    name: apiNote.title,
    email: apiNote.category || "Uncategorized",
    subject: apiNote.description || "",
    sources: parseSources(apiNote.sources),
    date: formatDate(timestamp),
    teaser: createTeaser(content),
    content,
    isArchived: apiNote.isArchived ?? false,
    isJunk: apiNote.isJunk ?? false,
    isFavorite: apiNote.isFavorite ?? false,
    updatedAt: Number.isNaN(timestamp) ? 0 : timestamp,
  };
}

export async function getErrorMessage(response: Response): Promise<string> {
  try {
    const body: { error?: string } = await response.json();

    return body.error || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

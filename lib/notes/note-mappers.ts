import type { ApiNote, Note } from "@/types/note";

export function createTeaser(content: string): string {
  return (
    content
      .replace(/```[\s\S]*?```/g, " ")
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

export function mapApiNote(apiNote: ApiNote): Note {
  const createdAt = new Date(apiNote.createdAt).getTime();
  const updatedAt = new Date(apiNote.updatedAt).getTime();

  return {
    ...apiNote,
    sources: Array.isArray(apiNote.sources) ? apiNote.sources : [],
    date: formatDate(updatedAt),
    teaser: createTeaser(apiNote.content),
    createdAt: Number.isNaN(createdAt) ? 0 : createdAt,
    updatedAt: Number.isNaN(updatedAt) ? 0 : updatedAt,
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

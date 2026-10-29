export type Note = {
  id: string;
  name: string;
  email: string;
  subject: string;
  sources: string[];
  date: string;
  teaser: string;
  content: string;
  isArchived: boolean;
  isJunk: boolean;
  isFavorite: boolean;
  updatedAt: number;
};

export type NoteDraft = {
  name: string;
  email: string;
  subject: string;
  sources: string[];
  content: string;
};

export type ApiNote = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  content: string;
  isArchived: boolean;
  isJunk: boolean;
  isFavorite: boolean;
  sources: string[] | string | null;
  createdAt: string | Date;
  updatedAt: string | number | Date;
};

export type NoteStatusChanges = Partial<
  Pick<Note, "isArchived" | "isJunk" | "isFavorite">
>;

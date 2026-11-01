export type Note = {
  id: string;
  title: string;
  category: string;
  description: string;
  sources: string[];
  content: string;
  date: string;
  teaser: string;
  isArchived: boolean;
  isJunk: boolean;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
};

export type ApiNote = Omit<
  Note,
  "date" | "teaser" | "createdAt" | "updatedAt"
> & {
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
};

export type NoteDraft = {
  title: string;
  category: string;
  description: string;
  sources: string[];
  content: string;
};

export type NoteStatusChanges = Partial<
  Pick<Note, "isArchived" | "isJunk" | "isFavorite">
>;

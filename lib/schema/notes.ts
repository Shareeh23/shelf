import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  category: z
    .string()
    .trim()
    .transform((category) => category.toLowerCase())
    .default("general"),
  description: z.string().trim().default(""),
  content: z.string(),
  sources: z.array(z.string().url()).default([]),
  isArchived: z.boolean().default(false),
  isJunk: z.boolean().default(false),
  isFavorite: z.boolean().default(false),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

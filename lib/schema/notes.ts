import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  category: z.string().trim().min(1, "Category is required"),
  description: z.string().trim().min(1, "Description is required"),
  content: z.string().trim().min(1, "Content is required"),
  sources: z.array(z.httpUrl()).default([]),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

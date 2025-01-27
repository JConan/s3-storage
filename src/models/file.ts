import { z } from "zod";

export const FileSchema = z.object({
  name: z.string().min(1),
  bucket: z.string().min(1),
  size: z.number().positive(),
  contentType: z.string().default("application/octet-stream"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type File = z.infer<typeof FileSchema>;

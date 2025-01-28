import { z } from "zod";

export const BucketSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(63)
    .regex(
      /^[a-z0-9.-]+$/,
      "Bucket name must contain only lowercase letters, numbers, dots, and hyphens"
    )
    .refine(
      (name: string) =>
        !name.startsWith(".") && !name.endsWith(".") && !name.includes(".."),
      "Bucket name cannot start or end with a dot and cannot contain consecutive dots"
    ),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Bucket = z.infer<typeof BucketSchema>;

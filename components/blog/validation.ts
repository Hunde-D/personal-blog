import z from "zod";

export const PostCreateSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content must be less than 5000 characters")
    .trim(),
  excerpt: z
    .string()
    .min(2, "Excerpt must be at least 2 characters")
    .max(200, "Excerpt must be less than 200 characters")
    .trim(),
  published: z.boolean().default(false),
  coverImage: z.string().url("Invalid URL format").nullable().optional(),
  slug: z
    .string()
    .min(1, "Slug must be at least 1 character")
    .max(120, "Slug must be less than 120 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can contain lowercase letters, numbers and dashes only")
    .optional(),
  tags: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
      })
    )
    .default([]),
});

export const PostMutateSchema = z.object({
  id: z.string().min(1, "Post ID is required"),
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be less than 100 characters")
    .trim()
    .optional(),
  excerpt: z
    .string()
    .min(2, "Excerpt must be at least 2 characters")
    .max(200, "Excerpt must be less than 200 characters")
    .trim()
    .optional(),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(5000, "Content must be less than 5000 characters")
    .trim()
    .optional(),
  published: z.boolean().optional(),
  readTimeMin: z
    .number()
    .min(1, "Read time must be at least 1 minute")
    .optional(),
  coverImage: z.string().url("Invalid URL format").nullable().optional(),
  slug: z
    .string()
    .min(1, "Slug must be at least 1 character")
    .max(120, "Slug must be less than 120 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can contain lowercase letters, numbers and dashes only")
    .optional(),
  tags: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
      })
    )
    .optional(),
});

export const PostSelectSchema = z.object({
  limit: z
    .number()
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot exceed 50")
    .default(10),
  cursor: z.string().nullish(),
  query: z
    .string()
    .min(1, "Search query must be at least 1 character")
    .max(100, "Search query cannot exceed 100 characters")
    .trim()
    .optional(),
});

// Helper function to calculate read time from content
export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// New schema for post search
export const PostSearchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(200, "Search query must be less than 200 characters")
    .trim(),
  category: z.string().optional(),
  tags: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
      })
    )
    .optional(),
  published: z.boolean().optional(),
});

// Schema for post filters
export const PostFilterSchema = z.object({
  limit: z
    .number()
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot exceed 50")
    .default(10),
  cursor: z.string().nullish(),
  status: z.enum(["all", "published", "draft"]).default("all"),
  category: z.string().optional(),
  tags: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
      })
    )
    .optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
});

// Export types
export type PostCreateInput = z.infer<typeof PostCreateSchema>;
export type PostMutateInput = z.infer<typeof PostMutateSchema>;
export type PostSelectInput = z.infer<typeof PostSelectSchema>;
export type PostSearchInput = z.infer<typeof PostSearchSchema>;
export type PostFilterInput = z.infer<typeof PostFilterSchema>;

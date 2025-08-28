import { read } from "fs";
import z from "zod";
import { sl } from "zod/v4/locales";

export const PostCreateSchema = z.object({
  title: z.string().min(2).max(100),
  content: z.string().min(10).max(5000),
  excerpt: z.string().min(2).max(200),
});
export const PostMutateSchema = z.object({
  id: z.string(),
  title: z.string().min(2).max(100).optional(),
  excerpt: z.string().min(2).max(200).optional(),
  content: z.string().min(10).max(5000).optional(),
  published: z.boolean().optional(),
  readTimeMin: z.number().optional(),
  coverImage: z.url().optional(),
});

export const PostSelectSchema = z.object({
  limit: z.number().min(1).max(20).default(10),
  cursor: z.string().nullish(),
  direction: z.enum(["forward", "backward"]).default("forward"),
  query: z.string().optional(),
});

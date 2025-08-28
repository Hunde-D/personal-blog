import z from "zod";
import { PostCreateSchema, PostMutateSchema } from "./validation";

export type PostT = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  excerpt: string | null;
  slug: string;
  content: string;
  coverImage: string | null;
  readTimeMin: number | null;
  published: boolean;
  publishedAt: Date | null;
  authorId: string;
};

export type PostCT = z.infer<typeof PostCreateSchema>;
export type PostMT = z.infer<typeof PostMutateSchema>;

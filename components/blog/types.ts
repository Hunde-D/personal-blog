import type z from "zod";
import type { PostCreateSchema, PostMutateSchema } from "./validation";

export type PostT = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  readTimeMin: number | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: AuthorT;
  tags: TagT[] | null;
};

export type AuthorT = {
  id: string;
  name: string;
  image: string | null;
};

export type TagT = {
  id: string;
  name: string;
};

export type PostCT = z.infer<typeof PostCreateSchema>;
export type PostMT = z.infer<typeof PostMutateSchema>;

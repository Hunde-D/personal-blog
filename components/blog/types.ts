import { Prisma } from "@prisma/client";

export interface BlogPostType {
  title: string;
  content: string;
  excerpt: string;
}

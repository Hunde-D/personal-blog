import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import slug from "slug";
const PostSchema = z.object({
  title: z.string().min(2).max(100),
  content: z.string().min(10).max(5000),
  excerpt: z.string().min(2).max(200),
});
const PostUpdateSchema = z.object({
  id: z.string(),
  title: z.string().min(2).max(100),
  content: z.string().min(10).max(5000),
  excerpt: z.string().min(2).max(200),
});

export const postRouter = createTRPCRouter({
  infinitePosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(20).default(2),
        cursor: z.string().nullish(),
        direction: z.enum(["forward", "backward"]),
        query: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, query } = input;
      const where: Prisma.PostWhereInput = {};
      if (query) {
        const tsQuery = query.split(/\s+/).filter(Boolean).join(" & "); // "about me" => "about & me"
        where.OR = [
          { title: { search: tsQuery } },
          { excerpt: { search: tsQuery } },
        ];
      }
      const posts = await ctx.db.post.findMany({
        where,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          publishedAt: "asc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }
      return {
        posts,
        nextCursor,
      };
    }),
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.post.findMany();
  }),
  find: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.post.findUnique({
        where: {
          slug: input.slug,
        },
      });
    }),
  admin: createTRPCRouter({
    create: protectedProcedure
      .input(PostSchema)
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db.post.create({
          data: {
            title: input.title,
            excerpt: input.excerpt,
            content: input.content,
            slug: slug(input.title),
            readTimeMin: 500,
            author: { connect: { id: ctx.user.id } },
          },
        });
        return result;
      }),
    update: protectedProcedure
      .input(PostUpdateSchema)
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db.post.update({
          where: { id: input.id },
          data: {
            title: input.title,
            excerpt: input.excerpt,
            content: input.content,
            slug: slug(input.title),
            readTimeMin: 500,
          },
        });
        return result;
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const result = await ctx.db.post.delete({
          where: { id: input.id },
        });
        return result;
      }),
  }),
});

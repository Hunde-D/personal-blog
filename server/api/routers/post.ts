import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import slug from "slug";
import {
  PostCreateSchema,
  PostSelectSchema,
  PostMutateSchema,
} from "@/components/blog/validation";

export const postRouter = createTRPCRouter({
  listPublished: publicProcedure
    .input(PostSelectSchema)
    .query(async ({ ctx, input }) => {
      const { limit, cursor, query } = input;
      const where: Prisma.PostWhereInput = {
        published: true,
      };
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
          publishedAt: "desc",
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
  listAll: publicProcedure
    .input(PostSelectSchema)
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
          createdAt: "desc",
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
    return await ctx.db.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
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
      .input(PostCreateSchema)
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
    mutate: protectedProcedure
      .input(PostMutateSchema)
      .mutation(async ({ ctx, input }) => {
        const { id, title, ...rest } = input;
        const result = await ctx.db.post.update({
          where: { id },
          data: {
            ...rest,
            ...(title ? { title, slug: slug(title) } : {}),
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

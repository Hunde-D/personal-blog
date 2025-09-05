import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import slug from "slug";
import z from "zod";
import {
  calculateReadTime,
  PostCreateSchema,
  PostMutateSchema,
  PostSelectSchema,
  PostFilterSchema,
} from "@/components/blog/validation";
import {
  buildPostSearchWhere,
  validateSearchParams,
  buildTagFilterWhere,
} from "@/lib/search-utils";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  // List posts (all)
  list: publicProcedure
    .input(PostSelectSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { limit, cursor, query } = input;

        // Validate and sanitize input
        const validation = validateSearchParams(query, limit);
        if (!validation.isValid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: validation.errors.join(", "),
          });
        }

        // Build search where clause
        const where = buildPostSearchWhere(validation.sanitizedQuery, false);

        const posts = await ctx.db.post.findMany({
          where,
          take: validation.sanitizedLimit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });

        let nextCursor: typeof cursor | undefined;
        if (posts.length > validation.sanitizedLimit) {
          const nextItem = posts.pop();
          nextCursor = nextItem?.id;
        }

        return {
          posts,
          nextCursor,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch posts",
          cause: error,
        });
      }
    }),

  // List posts (published only)
  listPublished: publicProcedure
    .input(PostSelectSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { limit, cursor, query } = input;

        // Validate and sanitize input
        const validation = validateSearchParams(query, limit);
        if (!validation.isValid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: validation.errors.join(", "),
          });
        }

        // Build where clause for published posts
        const where = buildPostSearchWhere(validation.sanitizedQuery, true);

        const posts = await ctx.db.post.findMany({
          where,
          take: validation.sanitizedLimit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            publishedAt: "desc",
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });

        let nextCursor: typeof cursor | undefined;
        if (posts.length > validation.sanitizedLimit) {
          const nextItem = posts.pop();
          nextCursor = nextItem?.id;
        }

        return {
          posts,
          nextCursor,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch published posts",
          cause: error,
        });
      }
    }),

  // Find a single post by slug
  find: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1, "Slug is required"),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const post = await ctx.db.post.findUnique({
          where: { slug: input.slug },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            tags: true,
          },
        });

        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found",
          });
        }

        return post;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch post",
          cause: error,
        });
      }
    }),

  // Get all available tags with counts
  getTags: publicProcedure.query(async ({ ctx }) => {
    try {
      const tags = await ctx.db.tag.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      // Attach post count per tag
      const tagsWithCount = await Promise.all(
        tags.map(async (tag) => {
          const postCount = await ctx.db.post.count({
            where: {
              tags: {
                some: {
                  id: tag.id,
                },
              },
            },
          });

          return {
            id: tag.id,
            name: tag.name,
            postCount,
          };
        })
      );

      // Sort by post count (desc)
      return tagsWithCount.sort((a, b) => b.postCount - a.postCount);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch tags",
        cause: error,
      });
    }
  }),

  // List posts with tag/status/date filters
  listWithFilters: publicProcedure
    .input(PostFilterSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { limit = 10, cursor, status, tags, dateRange } = input;

        // Build where clause from filters
        const where = buildTagFilterWhere({
          status,
          tags,
          dateRange,
        });

        const posts = await ctx.db.post.findMany({
          where,
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            tags: true,
          },
        });

        let nextCursor: typeof cursor | undefined;
        if (posts.length > limit) {
          const nextItem = posts.pop();
          nextCursor = nextItem?.id;
        }

        return {
          posts,
          nextCursor,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch posts with filters",
          cause: error,
        });
      }
    }),

  // Admin procedures
  admin: createTRPCRouter({
    create: protectedProcedure
      .input(PostCreateSchema)
      .mutation(async ({ ctx, input }) => {
        try {
          // Choose slug: user-provided or generated from title
          const desiredSlug =
            input.slug && input.slug.trim().length > 0
              ? input.slug
              : slug(input.title);

          // Ensure slug is unique
          const existingPost = await ctx.db.post.findUnique({
            where: { slug: desiredSlug },
          });

          if (existingPost) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Slug already in use",
            });
          }

          // Compute read time from content
          const readTimeMin = calculateReadTime(input.content);

          const result = await ctx.db.post.create({
            data: {
              title: input.title,
              excerpt: input.excerpt,
              content: input.content,
              slug: desiredSlug,
              readTimeMin,
              coverImage: input.coverImage,
              published: input.published,
              publishedAt: input.published ? new Date() : null,
              author: { connect: { id: ctx.user.id } },
              tags: {
                connectOrCreate:
                  input.tags?.map((tag) => ({
                    where: { name: tag.name },
                    create: { name: tag.name },
                  })) || [],
              },
            },
          });

          return result;
        } catch (error) {
          if (error instanceof TRPCError) throw error;

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create post",
            cause: error,
          });
        }
      }),

    mutate: protectedProcedure
      .input(PostMutateSchema)
      .mutation(async ({ ctx, input }) => {
        try {
          const { id, title, ...rest } = input;

          // Ensure post exists and user owns it
          const existingPost = await ctx.db.post.findUnique({
            where: { id },
            select: { authorId: true, slug: true },
          });

          if (!existingPost) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Post not found",
            });
          }

          if (existingPost.authorId !== ctx.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You can only edit your own posts",
            });
          }

          // Slug update: explicit slug wins; otherwise derive from title
          let slugUpdate = {} as any;
          if (rest.slug && rest.slug !== existingPost.slug) {
            // Check provided slug uniqueness
            const providedExists = await ctx.db.post.findUnique({
              where: { slug: rest.slug },
            });
            if (providedExists && providedExists.id !== id) {
              throw new TRPCError({
                code: "CONFLICT",
                message: "Slug already in use",
              });
            }
            slugUpdate = { slug: rest.slug };
          } else if (title) {
            const newSlug = slug(title);

            // Check if new slug already exists
            const slugExists = await ctx.db.post.findUnique({
              where: { slug: newSlug },
            });

            if (slugExists && slugExists.id !== id) {
              throw new TRPCError({
                code: "CONFLICT",
                message: "Slug already in use",
              });
            }

            slugUpdate = { slug: newSlug };
          }

          // Recompute read time if content changed
          let readTimeUpdate = {};
          if (rest.content) {
            readTimeUpdate = { readTimeMin: calculateReadTime(rest.content) };
          }

          // Update publishedAt if published flag changed
          let publishedAtUpdate = {};
          if (rest.published !== undefined) {
            publishedAtUpdate = {
              publishedAt: rest.published ? new Date() : null,
            };
          }

          // Replace tags if provided
          let tagsUpdate = {};
          if (rest.tags !== undefined) {
            // Disconnect all existing tags
            await ctx.db.post.update({
              where: { id },
              data: {
                tags: {
                  set: [],
                },
              },
            });

            // Connect or create new tags
            tagsUpdate = {
              tags: {
                connectOrCreate: rest.tags.map((tag) => ({
                  where: { name: tag.name },
                  create: { name: tag.name },
                })),
              },
            };
          }

          const result = await ctx.db.post.update({
            where: { id },
            data: {
              ...(title && { title }),
              ...(rest.excerpt !== undefined && { excerpt: rest.excerpt }),
              ...(rest.content && { content: rest.content }),
              ...(rest.coverImage !== undefined && {
                coverImage: rest.coverImage,
              }),
              ...(rest.readTimeMin && { readTimeMin: rest.readTimeMin }),
              ...(rest.published !== undefined && {
                published: rest.published,
              }),
              ...slugUpdate,
              ...readTimeUpdate,
              ...publishedAtUpdate,
              ...tagsUpdate,
            },
          });

          return result;
        } catch (error) {
          if (error instanceof TRPCError) throw error;

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update post",
            cause: error,
          });
        }
      }),

    delete: protectedProcedure
      .input(
        z.object({
          id: z.string().min(1, "Post ID is required"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          // Ensure post exists and user owns it
          const existingPost = await ctx.db.post.findUnique({
            where: { id: input.id },
            select: { authorId: true },
          });

          if (!existingPost) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Post not found",
            });
          }

          if (existingPost.authorId !== ctx.user.id) {
            throw new TRPCError({
              code: "FORBIDDEN",
              message: "You can only delete your own posts",
            });
          }

          const result = await ctx.db.post.delete({
            where: { id: input.id },
          });

          return result;
        } catch (error) {
          if (error instanceof TRPCError) throw error;

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete post",
            cause: error,
          });
        }
      }),
  }),
});

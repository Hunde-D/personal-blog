import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

interface Post {
  id: number;
  name: string;
}

const posts: Post[] = [
  {
    id: 1,
    name: "First Post",
  },
];

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return { greeting: `Hello ${input.text} from the post router!` };
    }),
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const post: Post = {
        id: posts.length + 1,
        name: input.name,
      };
      console.log("ctx.db.user.findMany =>>", await ctx.db.user.findMany());
      console.log("ctx.user =>>", ctx.user);
      posts.push(post);
      return post;
    }),
  createNewsLatter: protectedProcedure
    .input(z.object({ email: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.newsletter.create({
        data: {
          email: input.email,
        },
      });
      console.log("ctx.db.newsletter.create7 =>>", result.email);
      return result;
    }),

  getNewsLatter: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.newsletter.findMany();
  }),

  getLatest: publicProcedure.query(() => {
    return posts.at(-1) ?? null;
  }),

  user: protectedProcedure.query(({ ctx }) => {
    const user = ctx.db.user.findUnique({
      where: { id: ctx.user.id },
    });
    console.log("userCtx =>>", ctx.user);
    console.log("userDb =>>>>", user);
    return user;
  }),
});

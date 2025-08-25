import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
    .mutation(async ({ input }) => {
      const post: Post = {
        id: posts.length + 1,
        name: input.name,
      };
      posts.push(post);
      return post;
    }),
  createNewsLatter: publicProcedure
    .input(z.object({ email: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.newsletter.create({
        data: {
          email: input.email,
        },
      });
    }),

  getNewsLatter: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.newsletter.findMany();
  }),

  getLatest: publicProcedure.query(() => {
    return posts.at(-1) ?? null;
  }),
});

import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  // socialProviders: {
  //   notion: {
  //     clientId: process.env.NOTION_CLIENT_ID as string,
  //     clientSecret: process.env.NOTION_CLIENT_SECRET as string,
  //   },
  // },
  plugins: [admin()],
});

import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";
import { env } from "process";

export const authClient = createAuthClient({
  baseURL: env.BETTER_AUTH_URL,
  plugins: [adminClient()],
});

import { createAuthClient } from "better-auth/client";
import { adminClient } from "better-auth/client/plugins";
import { env } from "process";

export const authClient = createAuthClient({
  baseURL: env.BASE_URL,
  plugins: [adminClient()],
});

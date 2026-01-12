import { magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/vue';
export const { signIn, signUp, useSession, getSession, signOut } =
  createAuthClient({
    baseURL: process.env.BASE_URL,
    plugins: [magicLinkClient()],
  });

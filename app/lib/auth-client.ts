import { createAuthClient } from 'better-auth/vue';
export const { signIn, signUp, useSession, getSession, signOut } = createAuthClient({
  baseURL: 'http://localhost:4000',
});

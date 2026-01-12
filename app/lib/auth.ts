import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './database';
import { magicLink } from 'better-auth/plugins';
import * as schema from '~/lib/database/schema';
import { verificationEmailHtml } from './email/verify-email-template';
import { resend } from './email/email-client';

export const auth = betterAuth({
  appName: 'FairGrade',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: 'FairGrade Assessments <no-reply@verify.fscx.cloud>',
          to: email,
          subject: 'Sign in to FairGrade',
          html: verificationEmailHtml(url),
        });
      },
    }),
  ],
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: import.meta.env.GOOGLE_CLIENT_ID as string,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

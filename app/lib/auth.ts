import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './database';
import { magicLink } from 'better-auth/plugins';
import * as schema from '~/lib/database/schema';
import { Resend } from 'resend';
import { verificationEmailHtml } from './email-template';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const resend = new Resend(process.env.RESEND_API_KEY);
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

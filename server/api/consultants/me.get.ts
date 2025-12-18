import { eq } from 'drizzle-orm';
import { auth } from '~/lib/auth';
import { db } from '~/lib/database';
import { consultants } from '~/lib/database/schema/consultants';

// server/api/consultants/me.get.ts
export default defineEventHandler(async (event) => {
  // Reuse from middleware if available
  if (event.context.consultant) {
    return event.context.consultant;
  }

  // Otherwise fetch fresh (for API-only calls)
  const session = await auth.api.getSession({ headers: event.headers });

  if (!session) {
    throw createError({ statusCode: 401 });
  }

  const consultant = await db.query.consultants.findFirst({
    where: eq(consultants.userId, session.user.id),
  });

  return consultant;
});

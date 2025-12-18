import { eq } from 'drizzle-orm';
import { auth } from '~/lib/auth';
import { db } from '~/lib/database';
import { consultants } from '~/lib/database/schema';

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (session && event.path === '/login') {
    const consultant = await db.query.consultants.findFirst({
      where: eq(consultants.userId, session.user.id),
    });

    if (consultant?.isActive) {
      const redirectTo =
        consultant.role === 'consultant' ? '/grading' : '/dashboard';
      await sendRedirect(event, redirectTo, 302);
    }
  }

  if (
    event.path.startsWith('/dashboard') ||
    event.path.startsWith('/grading')
  ) {
    if (!session) {
      await sendRedirect(event, '/login', 401);
    }

    const consultant = await db.query.consultants.findFirst({
      where: eq(consultants.userId, session!.user.id),
    });

    if (!consultant?.isActive) {
      await sendRedirect(event, '/login', 403);
    }

    if (
      consultant?.role === 'consultant' &&
      !event.path.startsWith('/grading')
    ) {
      await sendRedirect(event, '/grading');
    }

    event.context.consultant = consultant;
  }
});

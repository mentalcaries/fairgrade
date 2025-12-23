import { eq } from 'drizzle-orm';
import { auth } from '~/lib/auth';
import { db } from '~/lib/database';
import { consultants } from '~/lib/database/schema';

export default defineEventHandler(async (event) => {
  if (event.path === '/login/unauthorized') {
    return;
  }
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session) {
    if (
      event.path.startsWith('/dashboard') ||
      event.path.startsWith('/grading')
    ) {
      return sendRedirect(event, '/login', 401);
    }
    return;
  }

  let consultant = await db.query.consultants.findFirst({
    where: eq(consultants.userId, session.user.id),
  });

  if (!consultant) {
    consultant = await db.query.consultants.findFirst({
      where: eq(consultants.email, session.user.email),
    });

    if (consultant) {
      await db
        .update(consultants)
        .set({ userId: session.user.id })
        .where(eq(consultants.id, consultant.id));

      consultant.userId = session.user.id;
    }
  }

  if (!consultant) {
    return sendRedirect(event, '/login/unauthorized', 403);
  }

  if (event.path === '/login' && consultant?.isActive) {
    const redirectTo =
      consultant.role === 'consultant' ? '/grading' : '/dashboard';
    return sendRedirect(event, redirectTo, 302);
  }

  if (
    event.path.startsWith('/dashboard') ||
    event.path.startsWith('/grading')
  ) {
    if (!consultant?.isActive) {
      return sendRedirect(event, '/login', 403);
    }

    if (
      consultant.role === 'consultant' &&
      event.path.startsWith('/dashboard')
    ) {
      return sendRedirect(event, '/grading');
    }
  }

  event.context.consultant = consultant;
});

import { db } from '~/lib/database';
import { assessments } from '~/lib/database/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async () => {
  try {
    const allAssessments = await db
      .select()
      .from(assessments)
      .orderBy(desc(assessments.submittedAt));

    return allAssessments;
  } catch (error) {
    console.error('Error fetching assessments:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch assessments',
    });
  }
});

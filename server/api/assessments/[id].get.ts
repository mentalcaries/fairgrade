import { db } from '~/lib/database';
import { assessments } from '~/lib/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Assessment ID is required',
      });
    }

    const [assessment] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, id))
      .limit(1);

    if (!assessment) {
      throw createError({
        statusCode: 404,
        message: 'Assessment not found',
      });
    }

    return assessment;
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    console.error('Error fetching assessment:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch assessment',
    });
  }
});

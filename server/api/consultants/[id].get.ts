import { db } from '~~/server/database';
import { consultants } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Consultant ID is required',
      });
    }

    const [consultant] = await db
      .select()
      .from(consultants)
      .where(eq(consultants.id, id));

    if (!consultant) {
      throw createError({
        statusCode: 404,
        message: 'Consultant not found',
      });
    }

    return consultant;
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    console.error('Error fetching consultant:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch consultant',
    });
  }
});

import { db } from '~~/server/database';
import { units } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Unit ID is required',
      });
    }

    const [unit] = await db
      .select()
      .from(units)
      .where(eq(units.id, id))
      .limit(1);

    if (!unit) {
      throw createError({
        statusCode: 404,
        message: 'Unit not found',
      });
    }

    return unit;
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    console.error('Error fetching unit:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch unit',
    });
  }
});

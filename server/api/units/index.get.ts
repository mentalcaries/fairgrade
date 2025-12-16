import { db } from '~~/server/database';
import { units } from '~~/server/database/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async () => {
  try {
    const allUnits = await db
      .select()
      .from(units)
      .orderBy(desc(units.createdAt));

    return allUnits;
  } catch (error) {
    console.error('Error fetching units:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch units',
    });
  }
});

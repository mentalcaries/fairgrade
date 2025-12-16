import { desc } from 'drizzle-orm';
import { db } from '~~/server/database';
import { consultants } from '~~/server/database/schema';

export default defineEventHandler(async () => {
  try {
    const allConsultants = await db
      .select()
      .from(consultants)
      .orderBy(desc(consultants.createdAt));
    return allConsultants;
  } catch (error) {
    console.error('Error fetching consultants:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch consultants',
    });
  }
});

import { desc, eq } from 'drizzle-orm';
import { db } from '~/lib/database';
import { consultants } from '~/lib/database/schema';

export default defineEventHandler(async () => {
  try {
    const allConsultants = await db
      .select()
      .from(consultants)
      .where(eq(consultants.role, 'consultant'))
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

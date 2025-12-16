import { db } from '~~/server/database';
import { classes } from '~~/server/database/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async () => {
  try {
    const allClasses = await db
      .select()
      .from(classes)
      .orderBy(desc(classes.createdAt));

    return allClasses;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch classes',
    });
  }
});

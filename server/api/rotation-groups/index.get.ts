import { db } from '~~/server/database';
import { rotationGroups } from '~~/server/database/schema';
import { asc } from 'drizzle-orm';

export default defineEventHandler(async () => {
  try {
    const allGroups = await db
      .select()
      .from(rotationGroups)
      .orderBy(asc(rotationGroups.name));

    return allGroups;
  } catch (error) {
    console.error('Error fetching rotation groups:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch rotation groups',
    });
  }
});

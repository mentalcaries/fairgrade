import { db } from '~/lib/database';
import { rotationGroups } from '~/lib/database/schema';
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

import { db } from '~/lib/database';
import { rotationGroups } from '~/lib/database/schema';
import { asc, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { classId } = getQuery(event);
  
  if (!classId || typeof classId !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'classId query parameter is required'
    });
  }

  try {
    const allGroups = await db
      .select()
      .from(rotationGroups)
      .where(eq(rotationGroups.classId, classId))
      .orderBy(asc(rotationGroups.name));

    return allGroups;
  } catch (error) {
    console.error('Error fetching rotation groups:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch rotation groups',
    });
  }
});
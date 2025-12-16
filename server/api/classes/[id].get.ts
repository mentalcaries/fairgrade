import { db } from '~~/server/database';
import { classes } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Class ID is required',
      });
    }

    const [classItem] = await db
      .select()
      .from(classes)
      .where(eq(classes.id, id))
      .limit(1);

    if (!classItem) {
      throw createError({
        statusCode: 404,
        message: 'Class not found',
      });
    }

    return classItem;
  } catch (error) {
    console.error('Error fetching class:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch class',
    });
  }
});

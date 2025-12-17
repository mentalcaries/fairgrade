import { db } from '~/lib/database';
import { classes } from '~/lib/database/schema';
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

    const [existingClass] = await db
      .select()
      .from(classes)
      .where(eq(classes.id, id))
      .limit(1);

    if (!existingClass) {
      throw createError({
        statusCode: 404,
        message: 'Class not found',
      });
    }

    await db.delete(classes).where(eq(classes.id, id));

    return {
      success: true,
      message: 'Class deleted successfully',
    };
  } catch (error) {
    const statusCode =
      error && typeof error === 'object' && 'statusCode' in error
        ? (error as { statusCode: number }).statusCode
        : 500;

    console.error('Error deleting class:', error);
    throw createError({
      statusCode,
      message: 'Failed to delete class',
    });
  }
});

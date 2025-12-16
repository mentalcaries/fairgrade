import { db } from '~~/server/database';
import { classes } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';
import { updateClassSchema } from '~~/server/utils/validation/classes';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Class ID is required',
      });
    }

    const body = await readBody(event);
    const validatedData = updateClassSchema.parse(body);

    const [updatedClass] = await db
      .update(classes)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(classes.id, id))
      .returning();

    if (!updatedClass) {
      throw createError({
        statusCode: 404,
        message: 'Class not found',
      });
    }

    return updatedClass;
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: 'Validation failed',
        data: error,
      });
    }

    console.error('Error updating class:', error);
    const statusCode =
      error && typeof error === 'object' && 'statusCode' in error
        ? (error as { statusCode: number }).statusCode
        : 500;

    throw createError({
      statusCode,
      message: 'Failed to update class',
    });
  }
});

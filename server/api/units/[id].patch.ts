import { db } from '~/lib/database';
import { units } from '~/lib/database/schema';
import { eq } from 'drizzle-orm';
import { updateUnitSchema } from '~~/server/utils/validation/units';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Unit ID is required',
      });
    }

    const body = await readBody(event);
    const validatedData = updateUnitSchema.parse(body);

    const [updatedUnit] = await db
      .update(units)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(units.id, id))
      .returning();

    if (!updatedUnit) {
      throw createError({
        statusCode: 404,
        message: 'Unit not found',
      });
    }

    return updatedUnit;
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: 'Validation failed',
        data: error,
      });
    }

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    console.error('Error updating unit:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to update unit',
    });
  }
});

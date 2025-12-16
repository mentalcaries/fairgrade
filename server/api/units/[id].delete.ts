import { db } from '~~/server/database';
import { units } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Unit ID is required',
      });
    }

    // Check if unit exists
    const [existingUnit] = await db
      .select()
      .from(units)
      .where(eq(units.id, id))
      .limit(1);

    if (!existingUnit) {
      throw createError({
        statusCode: 404,
        message: 'Unit not found',
      });
    }

    // Delete unit - students will have unitId set to null (onDelete: 'set null')
    await db.delete(units).where(eq(units.id, id));

    return {
      success: true,
      message: 'Unit deleted successfully',
    };
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error;
    }

    console.error('Error deleting unit:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to delete unit',
    });
  }
});

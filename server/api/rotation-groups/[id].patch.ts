import { db } from '~/lib/database';
import { rotationGroups } from '~/lib/database/schema';
import { eq } from 'drizzle-orm';
import { updateRotationGroupSchema } from '~~/server/utils/validation/rotation-groups';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Rotation group ID is required',
      });
    }

    // Read and validate request body
    const body = await readBody(event);
    const validatedData = updateRotationGroupSchema.parse(body);

    // Check if rotation group exists
    const [existingGroup] = await db
      .select()
      .from(rotationGroups)
      .where(eq(rotationGroups.id, id))
      .limit(1);

    if (!existingGroup) {
      throw createError({
        statusCode: 404,
        message: 'Rotation group not found',
      });
    }

    // Update rotation group
    const [updatedGroup] = await db
      .update(rotationGroups)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(rotationGroups.id, id))
      .returning();

    return updatedGroup;
  } catch (error) {
    // Handle Zod validation errors
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

    console.error('Error updating rotation group:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to update rotation group',
    });
  }
});

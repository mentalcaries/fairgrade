import { db } from '~/lib/database';
import { consultants } from '~/lib/database/schema';
import { DrizzleQueryError, eq } from 'drizzle-orm';
import { updateConsultantSchema } from '~~/server/utils/validation/consultants';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Consultant ID is required',
      });
    }

    const body = await readBody(event);
    const validatedData = updateConsultantSchema.parse(body);

    const [updatedConsultant] = await db
      .update(consultants)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(consultants.id, id))
      .returning();

    return updatedConsultant;
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: 'Validation failed',
        data: error,
      });
    }

    if (error instanceof DrizzleQueryError) {
      const cause = error.cause as { code?: string };
      if (cause?.code === '23505') {
        throw createError({
          statusCode: 409,
          message: 'A consultant with this email already exists',
        });
      }
    }

    console.error('Error updating consultant:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to update consultant',
    });
  }
});

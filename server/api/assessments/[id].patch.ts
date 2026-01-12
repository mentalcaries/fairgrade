import { db } from '~/lib/database';
import { assessments } from '~/lib/database/schema';
import { eq } from 'drizzle-orm';
import { updateAssessmentSchema } from '~~/server/utils/validation/assessments';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Assessment ID is required',
    });
  }

  try {
    const body = await readBody(event);
    const validatedData = updateAssessmentSchema.parse(body);

    const [updatedAssessment] = await db
      .update(assessments)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(assessments.id, id))
      .returning();

    if (!updatedAssessment) {
      throw createError({
        statusCode: 404,
        message: 'Assessment not found',
      });
    }

    return updatedAssessment;
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

    console.error('Error updating assessment:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to update assessment',
    });
  }
});
import { db } from '~/lib/database';
import { assessments } from '~/lib/database/schema';
import { eq } from 'drizzle-orm';
import { updateAssessmentSchema } from '~~/server/utils/validation/assessments';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Assessment ID is required',
      });
    }

    const body = await readBody(event);
    const validatedData = updateAssessmentSchema.parse(body);

    // Check if assessment exists
    const [existingAssessment] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.id, id))
      .limit(1);

    if (!existingAssessment) {
      throw createError({
        statusCode: 404,
        message: 'Assessment not found',
      });
    }

    // TODO: Add auth check here
    // - If user is consultant AND assessment.isCompleted === true, deny
    // - If user is admin, allow
    // For now, allow all updates (auth will be added later)

    // Update assessment
    const [updatedAssessment] = await db
      .update(assessments)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(assessments.id, id))
      .returning();

    return updatedAssessment;
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

    console.error('Error updating assessment:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to update assessment',
    });
  }
});

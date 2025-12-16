import { db } from '~~/server/database';
import { assessments } from '~~/server/database/schema';
import { createAssessmentSchema } from '~~/server/utils/validation/assessments';
import { DrizzleQueryError } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    // Read and validate request body
    const body = await readBody(event);
    const validatedData = createAssessmentSchema.parse(body);

    // Insert new assessment (automatically completed)
    const [newAssessment] = await db
      .insert(assessments)
      .values({
        studentId: validatedData.studentId,
        consultantId: validatedData.consultantId,
        attendance: validatedData.attendance,
        factualKnowledge: validatedData.factualKnowledge,
        clinicalApproach: validatedData.clinicalApproach,
        reliabilityDeportment: validatedData.reliabilityDeportment,
        initiative: validatedData.initiative,
        notes: validatedData.notes,
        isCompleted: true, // Always completed on creation
      })
      .returning();

    return newAssessment;
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: 'Validation failed',
        data: error,
      });
    }

    // Handle database errors
    if (error instanceof DrizzleQueryError) {
      const cause = error.cause as { code?: string; constraint?: string };

      // Unique constraint violation (student already has assessment)
      if (cause?.code === '23505') {
        throw createError({
          statusCode: 409,
          message: 'This student already has an assessment',
        });
      }

      // Foreign key violation
      if (cause?.code === '23503') {
        let message = 'Invalid reference';

        if (cause.constraint?.includes('student')) {
          message = 'Invalid student ID';
        } else if (cause.constraint?.includes('consultant')) {
          message = 'Invalid consultant ID';
        }

        throw createError({
          statusCode: 400,
          message,
        });
      }
    }

    console.error('Error creating assessment:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create assessment',
    });
  }
});

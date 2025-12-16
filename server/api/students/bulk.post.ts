import { db } from '~~/server/database';
import { students } from '~~/server/database/schema';
import { bulkCreateStudentsSchema } from '~~/server/utils/validation/students';
import { DrizzleQueryError } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = bulkCreateStudentsSchema.parse(body);

    const newStudents = await db
      .insert(students)
      .values(
        validatedData.students.map((student) => ({
          firstName: student.firstName,
          lastName: student.lastName,
          studentId: student.studentId,
          classId: validatedData.classId,
          rotationGroupId: validatedData.rotationGroupId,
          unitId: null, // Will be assigned later
        }))
      )
      .returning();

    return {
      success: true,
      count: newStudents.length,
      students: newStudents,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: 'Validation failed',
        data: error,
      });
    }

    if (error instanceof DrizzleQueryError) {
      const cause = error.cause as { code?: string; constraint?: string };

      if (cause?.code === '23505') {
        throw createError({
          statusCode: 409,
          message: 'One or more student IDs already exist',
        });
      }

      if (cause?.code === '23503') {
        let message = 'Invalid reference';

        if (cause.constraint?.includes('class')) {
          message = 'Invalid class ID';
        } else if (cause.constraint?.includes('rotation_group')) {
          message = 'Invalid rotation group ID';
        }

        throw createError({
          statusCode: 400,
          message,
        });
      }
    }

    console.error('Error bulk creating students:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to bulk create students',
    });
  }
});

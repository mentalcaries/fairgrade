import { db } from '~/lib/database';
import { students } from '~/lib/database/schema';
import { createStudentSchema } from '~~/server/utils/validation/students';
import { DrizzleQueryError } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = createStudentSchema.parse(body);

    const [newStudent] = await db
      .insert(students)
      .values({
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        studentId: validatedData.studentId,
        classId: validatedData.classId,
        rotationGroupId: validatedData.rotationGroupId,
        unitId: validatedData.unitId,
      })
      .returning();

    return newStudent;
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
          message: 'A student with this ID already exists',
        });
      }

      // Foreign key violation
      if (cause?.code === '23503') {
        let message = 'Invalid reference';

        if (cause.constraint?.includes('class')) {
          message = 'Invalid class ID';
        } else if (cause.constraint?.includes('rotation_group')) {
          message = 'Invalid rotation group ID';
        } else if (cause.constraint?.includes('unit')) {
          message = 'Invalid unit ID';
        }

        throw createError({
          statusCode: 400,
          message,
        });
      }
    }

    console.error('Error creating student:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create student',
    });
  }
});

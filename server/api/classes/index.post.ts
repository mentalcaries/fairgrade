import { db } from '~/lib/database';
import { classes, rotationGroups } from '~/lib/database/schema';
import { createClassSchema } from '~~/server/utils/validation/classes';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = createClassSchema.parse(body);

    const [newClass] = await db
      .insert(classes)
      .values({
        name: validatedData.name,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
      })
      .returning();

    const groupNames = ['A', 'B', 'C', 'D', 'E', 'F'];
    await db.insert(rotationGroups).values(
      groupNames.map((name) => ({
        classId: newClass.id,
        name,
      }))
    );

    return newClass;
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: 'Validation failed',
        data: error,
      });
    }

    console.error('Error creating class:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create class',
    });
  }
});

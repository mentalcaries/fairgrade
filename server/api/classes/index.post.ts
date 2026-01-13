import { db } from '~/lib/database';
import { classes, rotationGroups } from '~/lib/database/schema';
import { eq } from 'drizzle-orm';
import { createClassSchema } from '~~/server/utils/validation/classes';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = createClassSchema.parse(body);

    // If creating as active, deactivate all currently active classes first
    if (validatedData.isActive === true) {
      await db
        .update(classes)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(classes.isActive, true));
    }

    // Insert new class
    const [newClass] = await db
      .insert(classes)
      .values({
        name: validatedData.name,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        isActive: validatedData.isActive ?? false, // Use provided value or default to false
      })
      .returning();

    // Auto-create 6 rotation groups (A-F) with no dates
    const groupNames = ['A', 'B', 'C', 'D', 'E', 'F'];
    await db.insert(rotationGroups).values(
      groupNames.map((name) => ({
        classId: newClass.id,
        name,
        startDate: null,
        endDate: null,
      }))
    );

    return newClass;
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: 'Validation failed',
        data: error,
      });
    }

    console.error('Error creating class:', error);
    const statusCode =
      error && typeof error === 'object' && 'statusCode' in error
        ? (error as { statusCode: number }).statusCode
        : 500;

    throw createError({
      statusCode,
      message: 'Failed to create class',
    });
  }
});
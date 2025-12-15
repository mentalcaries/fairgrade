import { db } from '~~/server/database';
import { consultants } from '~~/server/database/schema';
import { createConsultantSchema } from '#imports';
import { randomUUID } from 'crypto';
import { DrizzleQueryError } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const validatedData = createConsultantSchema.parse(body);

    // TEMP ID - Better Auth to generate this later
    const userId = randomUUID();

    const [newConsultant] = await db
      .insert(consultants)
      .values({
        userId,
        name: validatedData.name,
        email: validatedData.email,
        role: validatedData.role,
      })
      .returning();

    return newConsultant;
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: `Validation failed: ${error.message}`,
      });
    }

    if (error instanceof DrizzleQueryError) {
      const cause = error.cause as { code?: string };
      if (cause?.code === '23505') {
        throw createError({
          statusCode: 409,
          statusMessage: 'A consultant with this email already exists',
        });
      }
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create consultant',
    });
  }
});

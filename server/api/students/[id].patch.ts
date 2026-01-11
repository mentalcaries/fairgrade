import { db } from '~/lib/database';
import { students } from '~/lib/database/schema';
import { eq } from 'drizzle-orm';
import { updateStudentSchema } from '~~/server/utils/validation/students';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Student ID is required',
    });
  }

  const body = await readBody(event);
  const validatedData = updateStudentSchema.parse(body);

  const [updatedStudent] = await db
    .update(students)
    .set({
      ...validatedData,
      updatedAt: new Date(),
    })
    .where(eq(students.id, id))
    .returning();

  if (!updatedStudent) {
    throw createError({
      statusCode: 404,
      message: 'Student not found',
    });
  }

  return updatedStudent;
});

import { db } from '~/lib/database';
import { students } from '~/lib/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Student ID is required',
    });
  }

  const [deletedStudent] = await db
    .delete(students)
    .where(eq(students.id, id))
    .returning();

  if (!deletedStudent) {
    throw createError({
      statusCode: 404,
      message: 'Student not found',
    });
  }

  return {
    success: true,
    message: 'Student deleted successfully',
  };
});

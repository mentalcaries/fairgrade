import { db } from '~/lib/database';
import { students } from '~/lib/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const classId = query.classId as string | undefined;

    // If classId provided, filter by it
    if (classId) {
      const filteredStudents = await db
        .select()
        .from(students)
        .where(eq(students.classId, classId));

      return filteredStudents;
    }

    // Otherwise return all students
    const allStudents = await db.select().from(students);

    return allStudents;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch students',
    });
  }
});
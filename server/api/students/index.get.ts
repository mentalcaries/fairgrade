import { db } from '~~/server/database';
import { students } from '~~/server/database/schema';
import { asc } from 'drizzle-orm';

export default defineEventHandler(async () => {
  try {
    const allStudents = await db
      .select()
      .from(students)
      .orderBy(asc(students.lastName), asc(students.firstName));

    return allStudents;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch students',
    });
  }
});

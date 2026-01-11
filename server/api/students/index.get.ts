import { db } from '~/lib/database';
import { students, units } from '~/lib/database/schema';
import { asc, eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { rotationGroupId, consultantId, unitId } = query;

    // Build where conditions
    const conditions = [];
    
    if (rotationGroupId) {
      conditions.push(eq(students.rotationGroupId, rotationGroupId as string));
    }

    if (unitId) {
      conditions.push(eq(students.unitId, unitId as string));
    }

    if (consultantId) {
      conditions.push(eq(units.consultantId, consultantId as string));
    }

    const allStudents = await db
      .select({
        id: students.id,
        firstName: students.firstName,
        lastName: students.lastName,
        studentId: students.studentId,
        classId: students.classId,
        rotationGroupId: students.rotationGroupId,
        unitId: students.unitId,
        createdAt: students.createdAt,
        updatedAt: students.updatedAt,
        unit: {
          id: units.id,
          name: units.name,
          hospital: units.hospital,
          consultantId: units.consultantId,
        },
      })
      .from(students)
      .leftJoin(units, eq(students.unitId, units.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
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
import { db } from '~/lib/database';
import { assessments, students } from '~/lib/database/schema';
import { desc, eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { consultantId, classId } = query;

    const conditions = [];

    if (consultantId) {
      conditions.push(eq(assessments.consultantId, consultantId as string));
    }

    if (classId) {
      conditions.push(eq(students.classId, classId as string));
    }

    const allAssessments = await db
      .select({
        id: assessments.id,
        studentId: assessments.studentId,
        consultantId: assessments.consultantId,
        attendance: assessments.attendance,
        factualKnowledge: assessments.factualKnowledge,
        clinicalApproach: assessments.clinicalApproach,
        reliabilityDeportment: assessments.reliabilityDeportment,
        initiative: assessments.initiative,
        notes: assessments.notes,
        isCompleted: assessments.isCompleted,
        submittedAt: assessments.submittedAt,
        createdAt: assessments.createdAt,
        updatedAt: assessments.updatedAt,
        student: {
          id: students.id,
          firstName: students.firstName,
          lastName: students.lastName,
          studentId: students.studentId,
          classId: students.classId,
        },
      })
      .from(assessments)
      .leftJoin(students, eq(assessments.studentId, students.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(assessments.submittedAt));

    return allAssessments;
  } catch (error) {
    console.error('Error fetching assessments:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch assessments',
    });
  }
});

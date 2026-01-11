import { db } from '~/lib/database';
import { students } from '~/lib/database/schema';
import { z } from 'zod';
import { DrizzleQueryError } from 'drizzle-orm';

const bulkImportSchema = z.object({
  students: z.array(
    z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      studentId: z.string().min(1),
    })
  ),
  classId: z.string().uuid(),
  rotationGroupId: z.string().uuid(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = bulkImportSchema.parse(body);

  const results = {
    success: [] as Array<{ studentId: string; firstName: string; lastName: string }>,
    failed: [] as Array<{ studentId: string; firstName: string; lastName: string; reason: string }>,
  };

  for (const student of validatedData.students) {
    try {
      await db.insert(students).values({
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
        classId: validatedData.classId,
        rotationGroupId: validatedData.rotationGroupId,
        unitId: null,
      });

      results.success.push(student);
    } catch (error) {
      if (error instanceof DrizzleQueryError) {
        const cause = error.cause as { code?: string };
        
        if (cause?.code === '23505') {
          results.failed.push({
            ...student,
            reason: 'Student ID already exists',
          });
          continue;
        }
      }

      results.failed.push({
        ...student,
        reason: 'Failed to import',
      });
    }
  }

  return results;
});
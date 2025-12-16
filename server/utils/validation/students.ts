import { z } from 'zod';

export const createStudentSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(255),
  lastName: z.string().min(1, 'Last name is required').max(255),
  studentId: z.string().min(1, 'Student ID is required').max(255),
  classId: z.string().uuid('Invalid class ID'),
  rotationGroupId: z.string().uuid('Invalid rotation group ID'),
  unitId: z.string().uuid('Invalid unit ID').optional().nullable(),
});

export const bulkCreateStudentsSchema = z.object({
  classId: z.string().uuid('Invalid class ID'),
  rotationGroupId: z.string().uuid('Invalid rotation group ID'),
  students: z
    .array(
      z.object({
        firstName: z.string().min(1, 'First name is required').max(255),
        lastName: z.string().min(1, 'Last name is required').max(255),
        studentId: z.string().min(1, 'Student ID is required').max(255),
      })
    )
    .min(1, 'At least one student is required'),
});

export const updateStudentSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(255).optional(),
    lastName: z.string().min(1, 'Last name is required').max(255).optional(),
    studentId: z.string().min(1, 'Student ID is required').max(255).optional(),
    classId: z.string().uuid('Invalid class ID').optional(),
    rotationGroupId: z.string().uuid('Invalid rotation group ID').optional(),
    unitId: z.string().uuid('Invalid unit ID').optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

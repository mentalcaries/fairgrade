import { z } from 'zod';

export const createUnitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  hospital: z.string().min(1, 'Hospital is required'),
  consultantId: z.string().uuid('Invalid consultant ID').optional().nullable(),
  rotationGroupId: z.string().uuid('Invalid rotation group ID'),
  classId: z.string().uuid('Invalid class ID'),
});

export const updateUnitSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(255).optional(),
    hospital: z.string().min(1, 'Hospital is required').optional(),
    consultantId: z
      .string()
      .uuid('Invalid consultant ID')
      .optional()
      .nullable(),
    rotationGroupId: z.string().uuid('Invalid rotation group ID').optional(),
    classId: z.string().uuid('Invalid class ID').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

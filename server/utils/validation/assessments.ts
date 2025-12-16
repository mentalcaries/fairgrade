import { z } from 'zod';

// Score must be between 1-100
const scoreSchema = z
  .number()
  .int()
  .min(1, 'Score must be at least 1')
  .max(100, 'Score must be at most 100');

export const createAssessmentSchema = z.object({
  studentId: z.string().uuid('Invalid student ID'),
  consultantId: z.string().uuid('Invalid consultant ID'),
  attendance: scoreSchema,
  factualKnowledge: scoreSchema,
  clinicalApproach: scoreSchema,
  reliabilityDeportment: scoreSchema,
  initiative: scoreSchema,
  notes: z.string().max(5000).optional().nullable(),
});

export const updateAssessmentSchema = z
  .object({
    attendance: scoreSchema.optional(),
    factualKnowledge: scoreSchema.optional(),
    clinicalApproach: scoreSchema.optional(),
    reliabilityDeportment: scoreSchema.optional(),
    initiative: scoreSchema.optional(),
    notes: z.string().max(5000).optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

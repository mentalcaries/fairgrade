import { z } from 'zod'

export const updateRotationGroupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(1).optional(), // Single letter A-F
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
}).refine((data) => {
  // If both dates provided, validate end > start
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) > new Date(data.startDate)
  }
  return true
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
})
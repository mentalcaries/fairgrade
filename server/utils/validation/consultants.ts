import { z } from 'zod'

export const createConsultantSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.email('Invalid email address'),
  role: z.enum(['admin', 'consultant']).optional(),
})

export const updateConsultantSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255).optional(),
  email: z.string().email('Invalid email address').optional(),
  role: z.enum(['admin', 'consultant']).optional(),
  isActive: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
})
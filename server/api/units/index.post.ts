import { db } from '~~/server/database'
import { units } from '~~/server/database/schema'
import { createUnitSchema } from '~~/server/utils/validation/units'
import { DrizzleQueryError } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = createUnitSchema.parse(body)

    const [newUnit] = await db
      .insert(units)
      .values({
        name: validatedData.name,
        hospital: validatedData.hospital,
        consultantId: validatedData.consultantId,
        rotationGroupId: validatedData.rotationGroupId,
        classId: validatedData.classId,
      })
      .returning()

    return newUnit
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        message: 'Validation failed',
        data: error,
      })
    }

    if (error instanceof DrizzleQueryError) {
      const cause = error.cause as { code?: string; constraint?: string }
      
      if (cause?.code === '23503') { // Foreign key violation
        let message = 'Invalid reference'
        
        if (cause.constraint?.includes('consultant')) {
          message = 'Invalid consultant ID'
        } else if (cause.constraint?.includes('class')) {
          message = 'Invalid class ID'
        }
        
        throw createError({
          statusCode: 400,
          message,
        })
      }
    }

    console.error('Error creating unit:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create unit',
    })
  }
})
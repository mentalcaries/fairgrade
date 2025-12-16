import { db } from '~~/server/database'
import { students } from '~~/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Student ID is required',
      })
    }

    // Check if student exists
    const [existingStudent] = await db
      .select()
      .from(students)
      .where(eq(students.id, id))
      .limit(1)

    if (!existingStudent) {
      throw createError({
        statusCode: 404,
        message: 'Student not found',
      })
    }

    // Hard delete - assessments will cascade delete
    await db.delete(students).where(eq(students.id, id))

    return {
      success: true,
      message: 'Student deleted successfully',
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    console.error('Error deleting student:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete student',
    })
  }
})
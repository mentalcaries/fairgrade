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

    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, id))
      .limit(1)

    if (!student) {
      throw createError({
        statusCode: 404,
        message: 'Student not found',
      })
    }

    return student
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    console.error('Error fetching student:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch student',
    })
  }
})
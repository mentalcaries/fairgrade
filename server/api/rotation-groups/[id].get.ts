import { db } from '~~/server/database'
import { rotationGroups } from '~~/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Rotation group ID is required',
      })
    }

    const [group] = await db
      .select()
      .from(rotationGroups)
      .where(eq(rotationGroups.id, id))
      .limit(1)

    if (!group) {
      throw createError({
        statusCode: 404,
        message: 'Rotation group not found',
      })
    }

    return group
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    console.error('Error fetching rotation group:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch rotation group',
    })
  }
})
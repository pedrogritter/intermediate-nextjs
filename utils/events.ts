import 'server-only'
import { db } from '@/db/db'
import { and, asc, count, desc, eq, ne, not } from 'drizzle-orm'
import { events, rsvps } from '@/db/schema'
import { delay } from './delay'
import { memoize } from 'nextjs-better-unstable-cache'

export const getEventsForDashboard = memoize(
  async (userId: string) => {
    await delay()

    const data = await db.query.events.findMany({
      where: eq(events.createdById, userId),
      columns: {
        id: true,
        name: true,
        startOn: true,
        status: true,
      },
      with: {
        rsvps: true,
      },
      limit: 5,
      orderBy: [asc(events.startOn)],
    })

    return data ?? []
  },
  {
    revalidateTags: () => ['dashboard:events'],
    persist: true,
  }
)

export const getAllEvents = memoize(
  async (userId: string) => {
    await delay(2000)

    const data = await db.query.events.findMany({
      where: eq(events.createdById, userId),
      orderBy: [asc(events.startOn)],
    })

    return data ?? []
  },
  {
    revalidateTags: () => ['events'],
    persist: true,
  }
)

export const getEvent = memoize(
  async (userId: string, eventId: string) => {
    await delay(2000)
    return db.query.events.findFirst({
      where: and(eq(events.createdById, userId), eq(events.id, eventId)),
    })
  },
  { persist: true, revalidateTags: (userID, eventId) => ['events', eventId] }
)

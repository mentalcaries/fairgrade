import { pgTable, text, timestamp, uuid, boolean, date } from 'drizzle-orm/pg-core';

export const classes = pgTable('classes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(), // e.g., "2024-2025"
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
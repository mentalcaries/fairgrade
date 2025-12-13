import { pgTable, text, timestamp, uuid, date } from 'drizzle-orm/pg-core';
import { classes } from './classes';

export const rotationGroups = pgTable('rotation_groups', {
  id: uuid('id').defaultRandom().primaryKey(),
  classId: uuid('class_id')
    .notNull()
    .references(() => classes.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // "A", "B", "C", "D", "E", "F"
  startDate: date('start_date').notNull(), // 6-week rotation start
  endDate: date('end_date').notNull(), // 6-week rotation end
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
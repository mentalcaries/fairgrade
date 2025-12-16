import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { consultants, classes } from './index';

export const units = pgTable('units', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  hospital: text('hospital').notNull(),
  consultantId: uuid('consultant_id').references(() => consultants.id),
  rotationGroupId: uuid('rotation_group_id').notNull(),
  classId: uuid('class_id')
    .notNull()
    .references(() => classes.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

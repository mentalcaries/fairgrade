import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { units } from './units';
import { rotationGroups } from './rotation-groups';
import { classes } from './classes';

export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  studentId: text('student_id').notNull().unique(),
  classId: uuid('class_id')
    .notNull()
    .references(() => classes.id, { onDelete: 'cascade' }),
  rotationGroupId: uuid('rotation_group_id')
    .notNull()
    .references(() => rotationGroups.id, { onDelete: 'restrict' }),
  unitId: uuid('unit_id').references(() => units.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

import { pgTable, text, timestamp, uuid, boolean, pgEnum } from 'drizzle-orm/pg-core';


export const roleEnum = pgEnum('role', ['admin', 'consultant'])

export const consultants = pgTable('consultants', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: roleEnum('role').notNull().default('consultant'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

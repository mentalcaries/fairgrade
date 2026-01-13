import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { user } from './auth';

export const roleEnum = pgEnum('role', ['admin', 'consultant', 'system']);

export const consultants = pgTable('consultants', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => user.id),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: roleEnum('role').notNull().default('consultant'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

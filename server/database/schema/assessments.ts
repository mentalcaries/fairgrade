import { pgTable, text, timestamp, uuid, integer, boolean, unique } from 'drizzle-orm/pg-core';
import { students } from './students';
import { consultants } from './consultants';

export const assessments = pgTable('assessments', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id')
    .notNull()
    .references(() => students.id, { onDelete: 'cascade' }),
  consultantId: uuid('consultant_id')
    .notNull()
    .references(() => consultants.id), 
  attendance: integer('attendance').notNull(),
  factualKnowledge: integer('factual_knowledge').notNull(),
  clinicalApproach: integer('clinical_approach').notNull(),
  reliabilityDeportment: integer('reliability_deportment').notNull(),
  initiative: integer('initiative').notNull(),
  notes: text('notes'),
  submittedAt: timestamp('submitted_at').notNull().defaultNow(),
  isLocked: boolean('is_locked').default(false).notNull(), 
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  uniqueStudentAssessment: unique().on(table.studentId),
}));
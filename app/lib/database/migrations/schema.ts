import { pgTable, foreignKey, unique, uuid, text, timestamp, integer, boolean, date, index, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const role = pgEnum("role", ['admin', 'consultant'])


export const students = pgTable("students", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	studentId: text("student_id").notNull(),
	classId: uuid("class_id").notNull(),
	rotationGroupId: uuid("rotation_group_id").notNull(),
	unitId: uuid("unit_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.classId],
			foreignColumns: [classes.id],
			name: "students_class_id_classes_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.rotationGroupId],
			foreignColumns: [rotationGroups.id],
			name: "students_rotation_group_id_rotation_groups_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.unitId],
			foreignColumns: [units.id],
			name: "students_unit_id_units_id_fk"
		}).onDelete("set null"),
	unique("students_student_id_unique").on(table.studentId),
]);

export const assessments = pgTable("assessments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	studentId: uuid("student_id").notNull(),
	consultantId: uuid("consultant_id").notNull(),
	attendance: integer().notNull(),
	factualKnowledge: integer("factual_knowledge").notNull(),
	clinicalApproach: integer("clinical_approach").notNull(),
	reliabilityDeportment: integer("reliability_deportment").notNull(),
	initiative: integer().notNull(),
	notes: text(),
	submittedAt: timestamp("submitted_at", { mode: 'string' }).defaultNow().notNull(),
	isCompleted: boolean("is_completed").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.id],
			name: "assessments_student_id_students_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.consultantId],
			foreignColumns: [consultants.id],
			name: "assessments_consultant_id_consultants_id_fk"
		}),
	unique("assessments_student_id_unique").on(table.studentId),
]);

export const consultants = pgTable("consultants", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	name: text().notNull(),
	email: text().notNull(),
	role: role().default('consultant').notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("consultants_user_id_unique").on(table.userId),
	unique("consultants_email_unique").on(table.email),
]);

export const classes = pgTable("classes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	startDate: date("start_date").notNull(),
	endDate: date("end_date").notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const rotationGroups = pgTable("rotation_groups", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	classId: uuid("class_id").notNull(),
	name: text().notNull(),
	startDate: date("start_date"),
	endDate: date("end_date"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.classId],
			foreignColumns: [classes.id],
			name: "rotation_groups_class_id_classes_id_fk"
		}).onDelete("cascade"),
]);

export const units = pgTable("units", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	hospital: text().notNull(),
	consultantId: uuid("consultant_id"),
	rotationGroupId: uuid("rotation_group_id").notNull(),
	classId: uuid("class_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.consultantId],
			foreignColumns: [consultants.id],
			name: "units_consultant_id_consultants_id_fk"
		}),
	foreignKey({
			columns: [table.classId],
			foreignColumns: [classes.id],
			name: "units_class_id_classes_id_fk"
		}),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	index("session_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast().op("text_ops")),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("account_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

import { relations } from "drizzle-orm/relations";
import { classes, students, rotationGroups, units, assessments, consultants, user, session, account } from "./schema";

export const studentsRelations = relations(students, ({one, many}) => ({
	class: one(classes, {
		fields: [students.classId],
		references: [classes.id]
	}),
	rotationGroup: one(rotationGroups, {
		fields: [students.rotationGroupId],
		references: [rotationGroups.id]
	}),
	unit: one(units, {
		fields: [students.unitId],
		references: [units.id]
	}),
	assessments: many(assessments),
}));

export const classesRelations = relations(classes, ({many}) => ({
	students: many(students),
	rotationGroups: many(rotationGroups),
	units: many(units),
}));

export const rotationGroupsRelations = relations(rotationGroups, ({one, many}) => ({
	students: many(students),
	class: one(classes, {
		fields: [rotationGroups.classId],
		references: [classes.id]
	}),
}));

export const unitsRelations = relations(units, ({one, many}) => ({
	students: many(students),
	consultant: one(consultants, {
		fields: [units.consultantId],
		references: [consultants.id]
	}),
	class: one(classes, {
		fields: [units.classId],
		references: [classes.id]
	}),
}));

export const assessmentsRelations = relations(assessments, ({one}) => ({
	student: one(students, {
		fields: [assessments.studentId],
		references: [students.id]
	}),
	consultant: one(consultants, {
		fields: [assessments.consultantId],
		references: [consultants.id]
	}),
}));

export const consultantsRelations = relations(consultants, ({many}) => ({
	assessments: many(assessments),
	units: many(units),
}));
export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	accounts: many(account),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));
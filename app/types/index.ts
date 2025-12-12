export const HOSPITALS = [
  "San Fernando General Hospital",
  "Port of Spain General Hospital",
  "Mount Hope Women's Hospital",
  "Sangre Grande Hospital",
] as const

export type Hospital = (typeof HOSPITALS)[number]

export interface Student {
  id: string
  name: string
  email: string
  studentId: string
  groupId?: string
  academicYearId?: string
  rotationGroupId?: string
  cohortId?: string
}

export interface Cohort {
  id: string
  name: string
  rotationGroupId: string
  academicYearId: string
  hospital: Hospital
  instructorId?: string
  studentIds: string[]
}

export interface StudentGroup {
  id: string
  name: string
  studentIds: string[]
}

export interface Instructor {
  id: string
  name: string
  email: string
  status: "active" | "inactive"
  assignedStudentIds: string[]
  assignedGroupIds: string[]
}

export interface Assessment {
  id: string
  studentId: string
  criterion1: number
  criterion2: number
  criterion3: number
  criterion4: number
  criterion5: number
  submittedBy: string
  submittedAt: string
}

export interface RotationGroup {
  id: string
  name: string
  startDate: string
  endDate: string
  cohortCount: number
  studentCount: number
  gradedCount: number
  status: "pending" | "active" | "complete"
}

export interface AcademicYear {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  rotationGroups: RotationGroup[]
}

export interface PendingAction {
  id: string
  message: string
  href: string
  count: number
}

export const HOSPITALS = [
  'San Fernando General Hospital',
  'Port of Spain General Hospital',
  "Mount Hope Women's Hospital",
  'Sangre Grande Hospital',
] as const;

export type Hospital = (typeof HOSPITALS)[number];

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  groupId?: string;
  classId?: string;
  rotationGroupId?: string;
  unitId?: string;
}

export interface Unit {
  id: string;
  name: string;
  hospital: Hospital;
  consultantId: string | null;
  rotationGroupId: string;
  classId: string;
}

export interface StudentWithUnit extends Student {
  unit: Unit | null;
}

export interface StudentWithGrades extends StudentWithUnit {
  attendance: number | null;
  factualKnowledge: number | null;
  clinicalApproach: number | null;
  reliabilityDeportment: number | null;
  initiative: number | null;
  average: string | null;
  finalScore: string | null;
  consultantName: string | null;
}

export interface Consultant {
  id: string;
  userId: string | null;
  name: string;
  email: string;
  role: 'admin' | 'consultant';
  isActive: boolean;
}

export interface Assessment {
  id: string;
  studentId: string;
  attendance: number;
  factualKnowledge: number;
  clinicalApproach: number;
  reliabilityDeportment: number;
  initiative: number;
  submittedBy: string;
  submittedAt: string;
  notes: string;
  consultantId: string;
}

export interface RotationGroup {
  id: string;
  name: string;
  classId: string;
  startDate: string;
  endDate: string;
}

export interface Class {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PendingAction {
  id: string;
  message: string;
  href: string;
  count: number;
}

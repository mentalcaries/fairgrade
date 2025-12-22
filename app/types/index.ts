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
  rotationGroupId: string;
  classId: string;
  hospital: Hospital;
  instructorId?: string;
  studentIds: string[];
}

export interface StudentGroup {
  id: string;
  name: string;
  studentIds: string[];
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
  criterion1: number;
  criterion2: number;
  criterion3: number;
  criterion4: number;
  criterion5: number;
  submittedBy: string;
  submittedAt: string;
}

export interface RotationGroup {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  unitCount: number;
  studentCount: number;
  gradedCount: number;
  status: 'pending' | 'active' | 'complete';
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  rotationGroups: RotationGroup[];
}

export interface PendingAction {
  id: string;
  message: string;
  href: string;
  count: number;
}

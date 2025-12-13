import type {
  Student,
  Instructor,
  Unit,
  Assessment,
  AcademicYear,
  PendingAction,
} from '~/types';

export function usePendingActions(
  students: Student[],
  instructors: Instructor[],
  units: Unit[],
  assessments: Assessment[],
  activeYear: AcademicYear | undefined
) {
  const pendingActions = computed<PendingAction[]>(() => {
    const actions: PendingAction[] = [];

    // Units without instructors
    const unitsWithoutInstructors = units.filter((c) => !c.instructorId);
    if (unitsWithoutInstructors.length > 0) {
      actions.push({
        id: 'no-instructor',
        message: `${unitsWithoutInstructors.length} unit${
          unitsWithoutInstructors.length > 1 ? 's' : ''
        } without assigned instructors`,
        href: '/dashboard/class',
        count: unitsWithoutInstructors.length,
      });
    }

    // Unassigned students per group
    if (activeYear) {
      activeYear.rotationGroups.forEach((group) => {
        const unassignedInGroup = students.filter(
          (s) => s.rotationGroupId === group.id && !s.unitId
        );
        if (unassignedInGroup.length > 0) {
          actions.push({
            id: `unassigned-${group.id}`,
            message: `${unassignedInGroup.length} unassigned student${
              unassignedInGroup.length > 1 ? 's' : ''
            } in Group ${group.name}`,
            href: `/dashboard/class/${activeYear.id}/groups/${group.id}`,
            count: unassignedInGroup.length,
          });
        }
      });
    }

    // Instructors who haven't submitted grades
    const activeInstructorsWithUnits = instructors.filter(
      (i) =>
        i.status === 'active' && units.some((c) => c.instructorId === i.id)
    );

    const instructorsWithoutGrades = activeInstructorsWithUnits.filter(
      (instructor) => {
        const instructorUnits = units.filter(
          (c) => c.instructorId === instructor.id
        );
        const hasSubmittedGrades = instructorUnits.some((unit) =>
          unit.studentIds.some((studentId) =>
            assessments.some(
              (a) =>
                a.studentId === studentId && a.submittedBy === instructor.id
            )
          )
        );
        return !hasSubmittedGrades;
      }
    );

    if (instructorsWithoutGrades.length > 0) {
      actions.push({
        id: 'no-grades',
        message: `${instructorsWithoutGrades.length} instructor${
          instructorsWithoutGrades.length > 1 ? 's' : ''
        } haven't submitted grades`,
        href: '/dashboard/consultants',
        count: instructorsWithoutGrades.length,
      });
    }

    return actions;
  });

  return {
    pendingActions,
  };
}

import type {
  StudentWithUnit,
  Consultant,
  Unit,
  Assessment,
  Class,
  PendingAction,
  RotationGroup,
} from '~/types';

export function usePendingActions(
  students: Ref<StudentWithUnit[]>,
  consultants: Ref<Consultant[]>,
  units: Ref<Unit[]>,
  assessments: Ref<Assessment[]>,
  activeYear: Ref<Class | undefined>
) {
  const rotationGroups = inject<Ref<RotationGroup[]>>('rotationGroups')!;

  const pendingActions = computed<PendingAction[]>(() => {
    const actions: PendingAction[] = [];

    if (activeYear.value) {
      const activeYearId = activeYear.value.id;
      const activeGroups =
        rotationGroups.value?.filter(
          (g) => g.classId === activeYear.value?.id
        ) || [];

      activeGroups.forEach((group) => {
        const unassignedInGroup = students.value.filter(
          (s) => s.rotationGroupId === group.id && !s.unitId
        );
        if (unassignedInGroup.length > 0) {
          actions.push({
            id: `unassigned-${group.id}`,
            message: `${unassignedInGroup.length} unassigned student${
              unassignedInGroup.length > 1 ? 's' : ''
            } in Group ${group.name}`,
            href: `/dashboard/class/${activeYearId}/groups/${group.id}`,
            count: unassignedInGroup.length,
          });
        }
      });
    }

    // Consultants who haven't submitted grades
    const activeConsultantsWithUnits = consultants.value.filter(
      (c) => c.isActive && units.value.some((u) => u.consultantId === c.id)
    );

    const consultantsWithoutGrades = activeConsultantsWithUnits.filter(
      (consultant) => {
        const consultantUnits = units.value.filter(
          (u) => u.consultantId === consultant.id
        );

        // Get all students in consultant's units
        const studentsInUnits = students.value.filter((s) =>
          consultantUnits.some((u) => u.id === s.unitId)
        );

        // Check if any assessments exist for these students
        const hasSubmittedGrades = studentsInUnits.some((student) =>
          assessments.value.some((a) => a.studentId === student.id)
        );

        return !hasSubmittedGrades;
      }
    );

    if (consultantsWithoutGrades.length > 0) {
      actions.push({
        id: 'no-grades',
        message: `${consultantsWithoutGrades.length} consultant${
          consultantsWithoutGrades.length > 1 ? 's' : ''
        } haven't submitted grades`,
        href: '/dashboard/consultants',
        count: consultantsWithoutGrades.length,
      });
    }

    return actions;
  });

  return {
    pendingActions,
  };
}

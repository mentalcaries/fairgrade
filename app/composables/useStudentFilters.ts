import type { StudentWithUnit } from '~/types';

export function useStudentFilters(students: Ref<StudentWithUnit[]>) {
  const searchTerm = ref('');
  const groupFilter = ref('all');
  const unitFilter = ref('all');

  const filteredStudents = computed(() => {
    return students.value.filter((s) => {
      const matchesSearch =
        s.firstName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchTerm.value.toLowerCase());

      const matchesGroup =
        groupFilter.value === 'all' || s.rotationGroupId === groupFilter.value;

      const matchesUnit =
        unitFilter.value === 'all' ||
        (unitFilter.value === 'assigned' && s.unitId) ||
        (unitFilter.value === 'unassigned' && !s.unitId);

      return matchesSearch && matchesGroup && matchesUnit;
    });
  });

  return {
    searchTerm,
    groupFilter,
    unitFilter,
    filteredStudents,
  };
}

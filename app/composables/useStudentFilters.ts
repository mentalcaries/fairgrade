import type { Student } from '~/types'

export function useStudentFilters(students: Student[]) {
  const searchTerm = ref('')
  const groupFilter = ref('all')
  const unitFilter = ref('all')

  const filteredStudents = computed(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchTerm.value.toLowerCase())

      const matchesGroup =
        groupFilter.value === 'all' ||
        (groupFilter.value === 'A' && s.rotationGroupId === 'rg1') ||
        (groupFilter.value === 'B' && s.rotationGroupId === 'rg2') ||
        (groupFilter.value === 'C' && s.rotationGroupId === 'rg3') ||
        (groupFilter.value === 'D' && s.rotationGroupId === 'rg4') ||
        (groupFilter.value === 'E' && s.rotationGroupId === 'rg5') ||
        (groupFilter.value === 'F' && s.rotationGroupId === 'rg6')

      const matchesUnit =
        unitFilter.value === 'all' ||
        (unitFilter.value === 'assigned' && s.unitId) ||
        (unitFilter.value === 'unassigned' && !s.unitId)

      return matchesSearch && matchesGroup && matchesUnit
    })
  })

  return {
    searchTerm,
    groupFilter,
    unitFilter,
    filteredStudents,
  }
}

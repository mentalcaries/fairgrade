import type { Student, AcademicYear, Unit } from '~/types'

export function useStudentHelpers(academicYears: AcademicYear[], units: Unit[]) {
  const getUnitLabel = (student: Student): string | null => {
    if (!student.academicYearId || !student.rotationGroupId) {
      return null
    }
    
    const year = academicYears.find((y) => y.id === student.academicYearId)
    const unit = units.find((c) => c.id === student.unitId)

    if (!year) return null

    if (unit) {
      return `${year.name} ${unit.name}`
    }
    
    return null
  }

  return {
    getUnitLabel,
  }
}

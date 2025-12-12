import type { Student, AcademicYear, Cohort } from '~/types'

export function useStudentHelpers(academicYears: AcademicYear[], cohorts: Cohort[]) {
  const getCohortLabel = (student: Student): string | null => {
    if (!student.academicYearId || !student.rotationGroupId) {
      return null
    }
    
    const year = academicYears.find((y) => y.id === student.academicYearId)
    const cohort = cohorts.find((c) => c.id === student.cohortId)

    if (!year) return null

    if (cohort) {
      return `${year.name} ${cohort.name}`
    }
    
    return null
  }

  return {
    getCohortLabel,
  }
}

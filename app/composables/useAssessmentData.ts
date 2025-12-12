import type { Student, Assessment } from '~/types'

export interface StudentWithGrades extends Student {
  criterion1: number | null
  criterion2: number | null
  criterion3: number | null
  criterion4: number | null
  criterion5: number | null
  average: string | null
}

export function useAssessmentData(students: Student[], assessments: Assessment[]) {
  const searchTerm = ref('')

  const studentsWithGrades = computed<StudentWithGrades[]>(() => {
    return students.map((student) => {
      const assessment = assessments.find((a) => a.studentId === student.id)
      
      return {
        ...student,
        criterion1: assessment?.criterion1 ?? null,
        criterion2: assessment?.criterion2 ?? null,
        criterion3: assessment?.criterion3 ?? null,
        criterion4: assessment?.criterion4 ?? null,
        criterion5: assessment?.criterion5 ?? null,
        average: assessment
          ? (
              (assessment.criterion1 +
                assessment.criterion2 +
                assessment.criterion3 +
                assessment.criterion4 +
                assessment.criterion5) /
              5
            ).toFixed(1)
          : null,
      }
    })
  })

  const filteredStudents = computed(() => {
    return studentsWithGrades.value.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  })

  return {
    searchTerm,
    studentsWithGrades,
    filteredStudents,
  }
}
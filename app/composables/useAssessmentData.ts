import type { StudentWithUnit, Assessment, Consultant, StudentWithGrades } from '~/types'


export function useAssessmentData(
  students: Ref<StudentWithUnit[]>, 
  assessments: Ref<Assessment[]>,
  consultants: Ref<Consultant[]>
) {
  const searchTerm = ref('')

  const studentsWithGrades = computed<StudentWithGrades[]>(() => {
    return students.value.map((student) => {
      const assessment = assessments.value.find((a) => a.studentId === student.id)
      const consultant = assessment 
        ? consultants.value.find((c) => c.id === assessment.consultantId)
        : null
      
      const average = assessment
        ? (
            (assessment.attendance +
              assessment.factualKnowledge +
              assessment.clinicalApproach +
              assessment.reliabilityDeportment +
              assessment.initiative) /
            5
          )
        : null

      return {
        ...student,
        attendance: assessment?.attendance ?? null,
        factualKnowledge: assessment?.factualKnowledge ?? null,
        clinicalApproach: assessment?.clinicalApproach ?? null,
        reliabilityDeportment: assessment?.reliabilityDeportment ?? null,
        initiative: assessment?.initiative ?? null,
        average: average ? average.toFixed(1) : null,
        finalScore: average ? (average * 0.2).toFixed(2) : null,
        consultantName: consultant?.name || null,
      }
    })
  })

  const filteredStudents = computed(() => {
    return studentsWithGrades.value.filter(
      (s) =>
        s.firstName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        s.lastName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  })

  return {
    searchTerm,
    studentsWithGrades,
    filteredStudents,
  }
}
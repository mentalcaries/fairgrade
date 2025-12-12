import type { Student, Instructor, Cohort, Assessment, AcademicYear, PendingAction } from "~/types"

export function usePendingActions(
  students: Student[],
  instructors: Instructor[],
  cohorts: Cohort[],
  assessments: Assessment[],
  activeYear: AcademicYear | undefined
) {
  const pendingActions = computed<PendingAction[]>(() => {
    const actions: PendingAction[] = []

    // Cohorts without instructors
    const cohortsWithoutInstructors = cohorts.filter((c) => !c.instructorId)
    if (cohortsWithoutInstructors.length > 0) {
      actions.push({
        id: "no-instructor",
        message: `${cohortsWithoutInstructors.length} cohort${cohortsWithoutInstructors.length > 1 ? "s" : ""} without assigned instructors`,
        href: "/dashboard/academic-years",
        count: cohortsWithoutInstructors.length,
      })
    }

    // Unassigned students per group
    if (activeYear) {
      activeYear.rotationGroups.forEach((group) => {
        const unassignedInGroup = students.filter(
          (s) => s.rotationGroupId === group.id && !s.cohortId
        )
        if (unassignedInGroup.length > 0) {
          actions.push({
            id: `unassigned-${group.id}`,
            message: `${unassignedInGroup.length} unassigned student${unassignedInGroup.length > 1 ? "s" : ""} in Group ${group.name}`,
            href: `/dashboard/academic-years/${activeYear.id}/groups/${group.id}`,
            count: unassignedInGroup.length,
          })
        }
      })
    }

    // Instructors who haven't submitted grades
    const activeInstructorsWithCohorts = instructors.filter(
      (i) => i.status === "active" && cohorts.some((c) => c.instructorId === i.id)
    )
    
    const instructorsWithoutGrades = activeInstructorsWithCohorts.filter((instructor) => {
      const instructorCohorts = cohorts.filter((c) => c.instructorId === instructor.id)
      const hasSubmittedGrades = instructorCohorts.some((cohort) =>
        cohort.studentIds.some((studentId) =>
          assessments.some((a) => a.studentId === studentId && a.submittedBy === instructor.id)
        )
      )
      return !hasSubmittedGrades
    })
    
    if (instructorsWithoutGrades.length > 0) {
      actions.push({
        id: "no-grades",
        message: `${instructorsWithoutGrades.length} instructor${instructorsWithoutGrades.length > 1 ? "s" : ""} haven't submitted grades`,
        href: "/dashboard/instructors",
        count: instructorsWithoutGrades.length,
      })
    }

    return actions
  })

  return {
    pendingActions,
  }
}

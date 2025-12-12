import type { Student, Instructor, Assessment } from "~/types"
import { Users, UserCog, ClipboardList, TrendingUp } from "lucide-vue-next"

export function useDashboardStats(
  students: Student[],
  instructors: Instructor[],
  assessments: Assessment[]
) {
  const avgScore = computed(() => {
    if (assessments.length === 0) return 0
    
    const total = assessments.reduce((acc, a) => {
      const avg = (a.criterion1 + a.criterion2 + a.criterion3 + a.criterion4 + a.criterion5) / 5
      return acc + avg
    }, 0)
    
    return (total / assessments.length).toFixed(1)
  })

  const stats = computed(() => [
    { 
      label: "Total Students", 
      value: students.length, 
      icon: Users, 
      color: "text-chart-1" 
    },
    { 
      label: "Instructors", 
      value: instructors.length, 
      icon: UserCog, 
      color: "text-chart-2" 
    },
    { 
      label: "Assessments", 
      value: assessments.length, 
      icon: ClipboardList, 
      color: "text-chart-3" 
    },
    { 
      label: "Avg Score", 
      value: avgScore.value, 
      icon: TrendingUp, 
      color: "text-chart-4" 
    },
  ])

  return {
    stats,
  }
}

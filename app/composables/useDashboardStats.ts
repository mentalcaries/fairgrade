import type { StudentWithUnit, Consultant, Assessment } from "~/types"
import { Users, UserCog, ClipboardList, TrendingUp } from "lucide-vue-next"

export function useDashboardStats(
  students: Ref<StudentWithUnit[]>,
  consultants: Ref<Consultant[]>,
  assessments: Ref<Assessment[]>
) {
  const avgScore = computed(() => {
    if (assessments.value.length === 0) return 0
    
    const total = assessments.value.reduce((acc, a) => {
      const avg = (a.attendance + a.factualKnowledge + a.clinicalApproach + a.reliabilityDeportment + a.initiative) / 5
      return acc + avg
    }, 0)
    
    return (total / assessments.value.length).toFixed(1)
  })

  const stats = computed(() => [
    { 
      label: "Total Students", 
      value: students.value.length, 
      icon: Users, 
      color: "text-chart-1" 
    },
    { 
      label: "Consultants", 
      value: consultants.value.length, 
      icon: UserCog, 
      color: "text-chart-2" 
    },
    { 
      label: "Assessments", 
      value: assessments.value.length, 
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
import type { StudentWithUnit, Consultant, Assessment } from '~/types';
import { Users, UserCog, ClipboardList } from 'lucide-vue-next';

export function useDashboardStats(
  students: Ref<StudentWithUnit[]>,
  consultants: Ref<Consultant[]>,
  assessments: Ref<Assessment[]>
) {
  const stats = computed(() => [
    {
      label: 'Total Students',
      value: students.value.length,
      icon: Users,
      color: 'text-chart-1',
    },
    {
      label: 'Consultants',
      value: consultants.value.length,
      icon: UserCog,
      color: 'text-chart-2',
    },
    {
      label: 'Completed Assessments',
      value: assessments.value.length,
      icon: ClipboardList,
      color: 'text-chart-3',
    },
  ]);

  return {
    stats,
  };
}

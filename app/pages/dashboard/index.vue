<script setup lang="ts">
import type {
  Class,
  StudentWithUnit,
  Consultant,
  Unit,
  Assessment,
} from '~/types';
import { useDashboardStats } from '~/composables/useDashboardStats';
import { usePendingActions } from '~/composables/usePendingActions';

definePageMeta({
  layout: 'dashboard',
});

const classes = inject<Ref<Class[]>>('classes')!;
const students = inject<Ref<StudentWithUnit[]>>('students')!;
const consultants = inject<Ref<Consultant[]>>('consultants')!;
const units = inject<Ref<Unit[]>>('units')!;
const assessments = inject<Ref<Assessment[]>>('assessments')!;

const activeYear = computed(() => classes.value?.find((y) => y.isActive));

const { stats } = useDashboardStats(students, consultants, assessments);

const { pendingActions } = usePendingActions(
  students,
  consultants,
  units,
  assessments,
  activeYear
);
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Dashboard</h1>
      <p class="text-muted-foreground mt-1">
        Overview of your grading platform
      </p>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DashboardStatsCard
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :icon="stat.icon"
        :color="stat.color"
      />
    </div>

    <!-- Current Rotations & Pending Actions -->
    <div class="grid gap-6 lg:grid-cols-2">
      <DashboardCurrentRotations :active-year="activeYear" />
      <DashboardPendingActions :actions="pendingActions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMockData } from '@/composables/useMockData'
import { useDashboardStats } from '~/composables/useDashboardStats'
import { usePendingActions } from '~/composables/usePendingActions'

definePageMeta({
  layout:'dashboard'
})
// Get mock data (replace with API calls later)
const { students, instructors, assessments, academicYears, units } = useMockData()

// Get active academic year
const activeYear = computed(() => academicYears.find((y) => y.isActive))

// Calculate stats
const { stats } = useDashboardStats(students, instructors, assessments)

// Calculate pending actions
const { pendingActions } = usePendingActions(
  students,
  instructors,
  units,
  assessments,
  activeYear.value
)
</script>

<template>
  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Dashboard</h1>
      <p class="text-muted-foreground mt-1">Overview of your grading platform</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
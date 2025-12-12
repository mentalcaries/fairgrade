<script setup lang="ts">
import type { RotationGroup } from '~/types'
import { Button } from '@/components/ui/button'
import { formatDateRange } from '~/utils/dateFormat'

interface Props {
  group: RotationGroup
  academicYearId: string
}

const props = defineProps<Props>()

const progress = computed(() => {
  return props.group.studentCount > 0
    ? Math.round((props.group.gradedCount / props.group.studentCount) * 100)
    : 0
})
</script>

<template>
  <div class="p-4 rounded-lg border border-border bg-secondary/30">
    <div class="flex items-center justify-between mb-2">
      <h3 class="font-semibold">Group {{ group.name }}</h3>
      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        Active
      </span>
    </div>
    
    <p class="text-sm text-muted-foreground mb-3">
      {{ formatDateRange(group.startDate, group.endDate) }}
    </p>
    
    <div class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">
          {{ group.gradedCount }}/{{ group.studentCount }} graded
        </span>
        <span class="font-medium">{{ progress }}%</span>
      </div>
      
      <div class="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          class="h-full bg-primary rounded-full transition-all"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
    
    <NuxtLink :to="`/dashboard/academic-years/${academicYearId}/groups/${group.id}`">
      <Button variant="outline" size="sm" class="w-full mt-3 bg-transparent">
        Manage
      </Button>
    </NuxtLink>
  </div>
</template>

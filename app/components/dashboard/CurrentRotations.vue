<script setup lang="ts">
import type { AcademicYear, RotationGroup } from '~/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from 'lucide-vue-next'

interface Props {
  activeYear: AcademicYear | undefined
}

const props = defineProps<Props>()

const currentRotations = computed<RotationGroup[]>(() => {
  if (!props.activeYear) return []
  
  const today = new Date()
  return props.activeYear.rotationGroups.filter((group) => {
    const startDate = new Date(group.startDate)
    const endDate = new Date(group.endDate)
    return today >= startDate && today <= endDate
  })
})
</script>

<template>
  <Card class="bg-card border-border">
    <CardHeader>
      <CardTitle>Current Rotations</CardTitle>
      <CardDescription>Groups currently in their rotation period</CardDescription>
    </CardHeader>
    
    <CardContent>
      <div v-if="currentRotations.length > 0" class="grid gap-4 sm:grid-cols-2">
        <DashboardRotationCard
          v-for="group in currentRotations"
          :key="group.id"
          :group="group"
          :academic-year-id="activeYear?.id ?? ''"
        />
      </div>
      
      <div v-else class="text-center py-8">
        <Calendar class="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p class="font-medium text-foreground">No active rotations right now</p>
        <p class="text-sm text-muted-foreground mt-1">
          Groups will appear here when their rotation period begins
        </p>
      </div>
    </CardContent>
  </Card>
</template>

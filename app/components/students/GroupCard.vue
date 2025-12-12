<script setup lang="ts">
import type { Student, StudentGroup } from '~/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Pencil, Trash2 } from 'lucide-vue-next'

interface Props {
  group: StudentGroup
  students: Student[]
}

interface Emits {
  (e: 'edit', group: StudentGroup): void
  (e: 'delete', groupId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const groupStudents = computed(() => {
  return props.group.studentIds
    .map((id) => props.students.find((s) => s.id === id))
    .filter((s): s is Student => s !== undefined)
})
</script>

<template>
  <Card class="bg-secondary/30 border-border">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="text-lg flex items-center gap-2">
          <Users class="h-5 w-5 text-primary" />
          {{ group.name }}
        </CardTitle>
        <div class="flex gap-1">
          <Button variant="ghost" size="icon" @click="emit('edit', group)">
            <Pencil class="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="text-destructive hover:text-destructive"
            @click="emit('delete', group.id)"
          >
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardDescription>{{ group.studentIds.length }} students</CardDescription>
    </CardHeader>
    
    <CardContent>
      <div class="space-y-2">
        <div
          v-for="student in groupStudents"
          :key="student.id"
          class="flex items-center gap-2 text-sm"
        >
          <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span class="text-xs font-medium text-primary">
              {{ student.name.charAt(0) }}
            </span>
          </div>
          <span>{{ student.name }}</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

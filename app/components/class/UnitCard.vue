<script setup lang="ts">
import type { Unit, Student, Consultant } from '~/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Pencil,
} from 'lucide-vue-next';

interface Props {
  unit: Unit;
  students: Student[];
  consultant?: Consultant;
  yearId: string;
  groupId: string;
}

interface Emits {
  (e: 'view' | 'edit' | 'delete'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const unitStudents = computed(() => {
  return props.students.filter((s) => s.unitId === props.unit.id);
});

const gradedStudents = computed(() => {
  // TODO: Replace with actual grading logic
  return unitStudents.value.filter(() => true).length;
});

const gradingStatus = computed(() => {
  if (unitStudents.value.length === 0) {
    return { type: 'not-setup', label: 'Not setup' };
  }
  if (gradedStudents.value === unitStudents.value.length) {
    return {
      type: 'complete',
      label: `${gradedStudents.value}/${unitStudents.value.length} graded`,
    };
  }
  return {
    type: 'incomplete',
    label: `${gradedStudents.value}/${unitStudents.value.length} graded`,
  };
});
</script>

<template>
  <Card
    class="bg-card border-border hover:shadow-md transition-shadow relative group"
  >
    <div
      class="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
    >
      <button
        class="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
        title="Edit unit"
        @click.stop="emit('edit')"
      >
        <Pencil class="h-4 w-4" />
      </button>
      <button
        class="p-1.5 rounded-md text-red-500 hover:text-red-600 hover:bg-red-50"
        title="Delete unit"
        @click.stop="emit('delete')"
      >
        <Trash2 class="h-4 w-4" />
      </button>
    </div>

    <CardHeader class="pb-3">
      <div class="flex items-center justify-between pr-16">
        <CardTitle class="text-lg font-semibold">
          {{ unit.name }}
        </CardTitle>

        <span
          v-if="gradingStatus.type === 'complete'"
          class="inline-flex items-center gap-1 text-xs text-emerald-600"
        >
          <CheckCircle2 class="h-3 w-3" />
          {{ gradingStatus.label }}
        </span>
        <span
          v-else
          class="inline-flex items-center gap-1 text-xs text-amber-600"
        >
          <AlertTriangle class="h-3 w-3" />
          {{ gradingStatus.label }}
        </span>
      </div>
    </CardHeader>

    <CardContent class="space-y-3">
      <p class="text-sm text-muted-foreground">
        {{ consultant ? consultant.name : 'Unassigned' }}
      </p>

      <p class="text-sm">
        <Users class="h-4 w-4 inline mr-1 text-muted-foreground" />
        {{ unitStudents.length }} students
      </p>

      <Button
        variant="outline"
        size="sm"
        class="w-full bg-transparent"
        @click="emit('view')"
      >
        View
      </Button>
    </CardContent>
  </Card>
</template>

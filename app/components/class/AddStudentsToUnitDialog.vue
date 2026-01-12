<script setup lang="ts">
import type { Student, Unit } from '~/types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
  open: boolean;
  unit: Unit;
  unassignedStudents: Student[];
  currentStudentCount: number;
  groupName: string;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'submit', studentIds: string[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedStudentIds = ref<string[]>([]);

const toggleStudent = (studentId: string) => {
  if (selectedStudentIds.value.includes(studentId)) {
    selectedStudentIds.value = selectedStudentIds.value.filter(
      (id) => id !== studentId
    );
  } else {
    selectedStudentIds.value = [...selectedStudentIds.value, studentId];
  }
};

const handleSubmit = () => {
  emit('submit', selectedStudentIds.value);
  // selectedStudentIds.value = [];
};

// Reset when dialog closes
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      selectedStudentIds.value = [];
    }
  }
);
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Students to Unit {{ unit.name }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label>
            Select Students ({{ selectedStudentIds.length }} selected)
          </Label>
          <div
            class="max-h-64 overflow-y-auto border border-border rounded-lg p-3 space-y-2"
          >
            <template v-if="unassignedStudents.length > 0">
              <div
                v-for="student in unassignedStudents"
                :key="student.id"
                class="flex items-center space-x-3 cursor-pointer"
              >
                <Checkbox
                  :id="`add-student-${student.id}`"
                  :checked="selectedStudentIds.includes(student.id)"
                  @click="toggleStudent(student.id)"
                />
                <label
                  :for="`add-student-${student.id}`"
                  class="text-sm cursor-pointer"
                >
                  {{ student.firstName }} {{ student.lastName }} ({{
                    student.studentId
                  }})
                </label>
              </div>
            </template>

            <p v-else class="text-sm text-muted-foreground text-center py-4">
              No unassigned students available in Group {{ groupName }}
            </p>
          </div>
        </div>

        <p class="text-sm text-muted-foreground">
          Currently {{ currentStudentCount }} students in this unit
        </p>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Cancel
        </Button>
        <Button
          :disabled="selectedStudentIds.length === 0"
          @click="handleSubmit"
        >
          Add Students
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

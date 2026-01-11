<script setup lang="ts">
import type { StudentWithUnit, Assessment } from '~/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-vue-next';

interface Props {
  open: boolean;
  student: StudentWithUnit | undefined;
  loading?: boolean;
  assessments: Assessment[];
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'confirm'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const hasAssessment = computed(() =>
  props.assessments.some((a) => a.studentId === props.student?.id)
);
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Student?</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete {{ student?.firstName }}
          {{ student?.lastName }} ({{ student?.studentId }})? This action cannot
          be undone.
        </DialogDescription>
      </DialogHeader>

      <div
        v-if="hasAssessment"
        class="flex items-start gap-3 p-3 bg-red-50 text-red-700 rounded-lg"
      >
        <AlertTriangle class="h-5 w-5 mt-0.5 shrink-0" />
        <div class="text-sm">
          <p class="font-medium">This student has assessment data</p>
          <p class="mt-1">
            Deleting this student will also delete their assessment records.
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          :disabled="loading"
          @click="emit('update:open', false)"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          :disabled="loading"
          @click="emit('confirm')"
        >
          {{ loading ? 'Deleting...' : 'Delete' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

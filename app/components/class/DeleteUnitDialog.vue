<script setup lang="ts">
import type { Unit, Student } from '~/types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  unit: Unit | null;
  students: Student[];
  groupName: string;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'confirm'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const deleteConfirmText = ref('');

const unitStudents = computed(() => {
  if (!props.unit) return [];
  return props.students.filter((s) => s.unitId === props.unit?.id);
});

const isDeleteConfirmValid = computed(() => {
  if (!props.unit) return false;
  return (
    deleteConfirmText.value.toLowerCase() === props.unit.name.toLowerCase()
  );
});

// Reset confirmation text when dialog closes
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      deleteConfirmText.value = '';
    }
  }
);
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>Delete Unit {{ unit?.name }}?</DialogTitle>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div
          class="flex items-start gap-3 p-3 bg-red-50 text-red-700 rounded-lg"
        >
          <AlertTriangle class="h-5 w-5 mt-0.5 shrink-0" />
          <span class="font-medium">This action cannot be undone</span>
        </div>

        <div class="space-y-2">
          <p class="text-sm font-medium">This will:</p>
          <ul
            class="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2"
          >
            <li>Remove unit {{ unit?.name }} permanently</li>
            <li>Unassign all {{ unitStudents.length }} students from unit</li>
            <li>Students will remain in Group {{ groupName }}</li>
            <li v-if="unit?.consultantId">Remove consultant assignment</li>
          </ul>
        </div>

        <div class="space-y-2">
          <Label for="deleteConfirm">
            Type "{{ unit?.name }}" to confirm deletion:
          </Label>
          <Input
            id="deleteConfirm"
            v-model="deleteConfirmText"
            placeholder="Type unit name..."
            :class="
              cn(
                deleteConfirmText &&
                  !isDeleteConfirmValid &&
                  'border-red-300 focus-visible:ring-red-500'
              )
            "
          />
          <p
            v-if="deleteConfirmText && !isDeleteConfirmValid"
            class="text-xs text-red-500"
          >
            Please type the unit name to confirm
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Cancel
        </Button>
        <Button
          variant="destructive"
          :disabled="!isDeleteConfirmValid"
          @click="emit('confirm')"
        >
          Delete Unit
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

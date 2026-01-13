<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Lock } from 'lucide-vue-next';

interface Props {
  open: boolean;
  studentName: string;
  loading?: boolean;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'confirm'): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Lock class="h-5 w-5" />
          Submit Assessment
        </DialogTitle>
        <DialogDescription>
          Review the assessment for {{ studentName }}
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div
          class="flex items-start gap-3 p-3 bg-amber-50 text-amber-700 rounded-lg"
        >
          <AlertTriangle class="h-5 w-5 mt-0.5 shrink-0" />
          <div class="text-sm">
            <p class="font-medium">This action cannot be undone</p>
            <p class="mt-1">
              Once submitted, this assessment will be locked and cannot be
              edited.
            </p>
          </div>
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
        <Button :disabled="loading" @click="emit('confirm')">
          {{ loading ? 'Submitting...' : 'Confirm & Submit' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

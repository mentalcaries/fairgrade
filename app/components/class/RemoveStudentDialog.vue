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

interface Props {
  open: boolean;
  groupName: string;
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Remove Student from Unit</DialogTitle>
        <DialogDescription>
          This will remove the student from this unit. They will remain in Group
          {{ groupName }} and can be assigned to another unit.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Cancel
        </Button>
        <Button variant="destructive" @click="emit('confirm')">
          Remove from Unit
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

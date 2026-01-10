<script setup lang="ts">
import { FetchError } from 'ofetch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'vue-sonner';
import type { RotationGroup } from '~/types';

interface Props {
  open: boolean;
  group: RotationGroup;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'updated'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isSubmitting = ref(false);
const formData = ref({
  startDate: props.group.startDate || '',
  endDate: props.group.endDate || '',
});

// Watch for group changes to reset form
watch(
  () => props.group,
  (newGroup) => {
    formData.value = {
      startDate: newGroup.startDate || '',
      endDate: newGroup.endDate || '',
    };
  }
);

const isValid = computed(() => {
  if (!formData.value.startDate || !formData.value.endDate) return false;

  const start = new Date(formData.value.startDate);
  const end = new Date(formData.value.endDate);

  return end > start;
});

const handleSubmit = async () => {
  if (!isValid.value) {
    toast.error('End date must be after start date');
    return;
  }

  isSubmitting.value = true;

  try {
    await $fetch(`/api/rotation-groups/${props.group.id}`, {
      method: 'PATCH',
      body: {
        startDate: formData.value.startDate,
        endDate: formData.value.endDate,
      },
    });

    toast.success(`Group ${props.group.name} dates updated successfully`);
    emit('updated');
    emit('update:open', false);
  } catch (error) {
    const message =
      error instanceof FetchError ? error.statusMessage : 'Unknown error';
    toast.error(`Failed to update dates: ${message}`);
    console.error('Error updating rotation group dates:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Rotation Dates</DialogTitle>
        <DialogDescription>
          Update the start and end dates for Group {{ group.name }}
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="startDate">Start Date</Label>
          <Input
            id="startDate"
            v-model="formData.startDate"
            type="date"
            :disabled="isSubmitting"
          />
        </div>

        <div class="space-y-2">
          <Label for="endDate">End Date</Label>
          <Input
            id="endDate"
            v-model="formData.endDate"
            type="date"
            :disabled="isSubmitting"
          />
        </div>

        <p
          v-if="formData.startDate && formData.endDate && !isValid"
          class="text-sm text-destructive"
        >
          End date must be after start date
        </p>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          :disabled="isSubmitting"
          @click="emit('update:open', false)"
        >
          Cancel
        </Button>
        <Button :disabled="!isValid || isSubmitting" @click="handleSubmit">
          {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

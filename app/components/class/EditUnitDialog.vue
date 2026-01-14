<script setup lang="ts">
import type { Hospital, Consultant, Unit } from '~/types';
import { HOSPITALS } from '~/types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

interface Props {
  open: boolean;
  unit: Unit;
  consultants: Consultant[];
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (
    e: 'submit',
    form: { name: string; hospital: Hospital; consultantId: string }
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const form = ref({
  name: props.unit.name,
  hospital: props.unit.hospital,
  consultantId: props.unit.consultantId || '',
});

// Update form when unit changes
watch(
  () => props.unit,
  (unit) => {
    form.value = {
      name: unit.name,
      hospital: unit.hospital,
      consultantId: unit.consultantId || '',
    };
  },
  { immediate: true }
);

const hasConsultantChanged = computed(() => {
  return (
    form.value.consultantId !== props.unit.consultantId &&
    props.unit.consultantId
  );
});

const isSubmitDisabled = computed(() => {
  return (
    !form.value.name.trim() || !form.value.hospital || !form.value.consultantId
  );
});

const handleSubmit = (e: Event) => {
  e.preventDefault();

  // Validate form
  if (!form.value.name.trim()) {
    toast.error('Please enter a unit name');
    return;
  }

  if (!form.value.hospital) {
    toast.error('Please select a hospital');
    return;
  }

  if (!form.value.consultantId) {
    toast.error('Please select a consultant');
    return;
  }

  emit('submit', {
    name: form.value.name.trim(),
    hospital: form.value.hospital,
    consultantId: form.value.consultantId,
  });
};

// Reset form when dialog closes
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      form.value = {
        name: props.unit.name,
        hospital: props.unit.hospital,
        consultantId: props.unit.consultantId || '',
      };
    }
  }
);
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Unit {{ unit.name }}</DialogTitle>
      </DialogHeader>

      <form @submit="handleSubmit" class="space-y-4 py-4">
        <!-- Unit Name Field -->
        <div class="space-y-2">
          <Label for="unit-name">Unit Name *</Label>
          <Input
            id="unit-name"
            v-model="form.name"
            placeholder="e.g., Dr. Khan, EWMSC Unit A, Cardiology"
            required
            autocomplete="off"
          />
        </div>

        <!-- Hospital Field -->
        <div class="space-y-2">
          <Label for="hospital">Hospital *</Label>
          <Select v-model="form.hospital" required>
            <SelectTrigger id="hospital">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="hospital in HOSPITALS"
                :key="hospital"
                :value="hospital"
              >
                {{ hospital }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Consultant Field -->
        <div class="space-y-2">
          <Label for="consultant">Consultant *</Label>
          <Select v-model="form.consultantId" required>
            <SelectTrigger id="consultant">
              <SelectValue placeholder="Select consultant..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="consultant in consultants"
                :key="consultant.id"
                :value="consultant.id"
              >
                {{ consultant.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Consultant Change Warning -->
        <div
          v-if="hasConsultantChanged"
          class="flex items-start gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg text-sm"
        >
          <AlertTriangle class="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            Changing consultant will notify both the current and new consultant
          </span>
        </div>

        <!-- Form Actions -->
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            @click="emit('update:open', false)"
          >
            Cancel
          </Button>
          <Button type="submit" :disabled="isSubmitDisabled">
            Save Changes
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import type { Hospital, Student, Consultant } from '~/types';
import { HOSPITALS } from '~/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

interface Props {
  open: boolean;
  groupName: string;
  preselectedHospital?: Hospital;
  unassignedStudents: Student[];
  consultants: Consultant[];
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (
    e: 'submit',
    form: {
      name: string;
      hospital: Hospital;
      consultantId: string;
      studentIds: string[];
    }
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const form = ref<{
  name: string;
  hospital: Hospital | '';
  consultantId: string;
  studentIds: string[];
}>({
  name: '',
  hospital: '',
  consultantId: '',
  studentIds: [],
});

// Set preselected hospital when it changes
watch(
  () => props.preselectedHospital,
  (hospital) => {
    if (hospital) {
      form.value.hospital = hospital;
    }
  },
  { immediate: true }
);

const isSubmitDisabled = computed(() => {
  return (
    !form.value.name.trim() || !form.value.hospital || !form.value.consultantId
  );
});

const toggleStudent = (studentId: string) => {
  if (form.value.studentIds.includes(studentId)) {
    form.value.studentIds = form.value.studentIds.filter(
      (id) => id !== studentId
    );
  } else {
    form.value.studentIds = [...form.value.studentIds, studentId];
  }
};

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
    studentIds: form.value.studentIds,
  });

  // Reset form
  form.value = {
    name: '',
    hospital: '',
    consultantId: '',
    studentIds: [],
  };
};

// Reset form when dialog closes
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      form.value = {
        name: '',
        hospital: props.preselectedHospital || '',
        consultantId: '',
        studentIds: [],
      };
    }
  }
);
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle>Add Unit to Group {{ groupName }}</DialogTitle>
        <DialogDescription>Enter unit details</DialogDescription>
      </DialogHeader>

      <form @submit="handleSubmit" class="space-y-4 py-4">
        <!-- Unit Name Field -->
        <div class="space-y-2">
          <Label for="unit-name">Unit Name *</Label>
          <Input
            id="unit-name"
            v-model="form.name"
            placeholder="Dr. Khan Unit B"
            required
            autocomplete="off"
          />
          <p class="text-xs text-muted-foreground">
            Name this unit (often named after the lead consultant)
          </p>
        </div>

        <!-- Hospital Field -->
        <div class="space-y-2">
          <Label for="hospital">Hospital *</Label>
          <Select v-model="form.hospital" required>
            <SelectTrigger id="hospital">
              <SelectValue placeholder="Select hospital..." />
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
          <p class="text-xs text-muted-foreground">
            The consultant who will grade students in this unit
          </p>
        </div>

        <!-- Students Field -->
        <div class="space-y-2">
          <Label>Students ({{ form.studentIds.length }} selected)</Label>
          <div
            class="max-h-48 overflow-y-auto border border-border rounded-lg p-3 space-y-2"
          >
            <template v-if="unassignedStudents.length > 0">
              <div
                v-for="student in unassignedStudents"
                :key="student.id"
                class="flex items-center space-x-3"
              >
                <Checkbox
                  :id="`student-${student.id}`"
                  :checked="form.studentIds.includes(student.id)"
                  @update:checked="toggleStudent(student.id)"
                />
                <Label
                  :for="`student-${student.id}`"
                  class="text-sm font-normal cursor-pointer flex-1"
                >
                  {{ student.firstName }} {{ student.lastName }}
                  <span class="text-muted-foreground"
                    >({{ student.studentId }})</span
                  >
                </Label>
              </div>
            </template>

            <p v-else class="text-sm text-muted-foreground text-center py-2">
              No unassigned students in this group
            </p>
          </div>

          <p
            v-if="form.studentIds.length > 6"
            class="text-xs text-amber-600 flex items-center gap-1"
          >
            <AlertTriangle class="h-3 w-3" />
            Warning: Recommended max is 5-6 students per unit
          </p>

          <p class="text-xs text-muted-foreground">
            You can add more students later
          </p>
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
            Create Unit
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle } from 'lucide-vue-next';

interface Props {
  open: boolean;
  groupName: string;
  nextUnitName: string;
  preselectedHospital?: Hospital;
  unassignedStudents: Student[];
  consultants: Consultant[];
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (
    e: 'submit',
    form: {
      hospital: Hospital;
      consultantId: string;
      studentIds: string[];
    }
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const form = ref<{
  hospital: Hospital | '';
  consultantId: string;
  studentIds: string[];
}>({
  hospital: '',
  consultantId: '',
  studentIds: [],
});

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
  return !form.value.hospital || !form.value.consultantId;
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

const handleSubmit = () => {
  if (form.value.hospital && form.value.consultantId) {
    emit('submit', {
      hospital: form.value.hospital,
      consultantId: form.value.consultantId,
      studentIds: form.value.studentIds,
    });

    // Reset form
    form.value = {
      hospital: '',
      consultantId: '',
      studentIds: [],
    };
  }
};

// Reset form when dialog closes
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      form.value = {
        hospital: '',
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
        <DialogDescription>Unit {{ nextUnitName }}</DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="hospital">Hospital *</Label>
          <Select v-model="form.hospital">
            <SelectTrigger>
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

        <div class="space-y-2">
          <Label for="consultant">Consultant *</Label>
          <Select v-model="form.consultantId">
            <SelectTrigger>
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

        <div class="space-y-2">
          <Label>Students ({{ form.studentIds.length }} selected)</Label>
          <div
            class="max-h-48 overflow-y-auto border border-border rounded-lg p-3 space-y-2"
          >
            <template v-if="unassignedStudents.length > 0">
              <div
                v-for="student in unassignedStudents"
                :key="student.id"
                class="flex items-center space-x-3 cursor-pointer"
                @click="toggleStudent(student.id)"
              >
                <Checkbox
                  :id="`student-${student.id}`"
                  :checked="form.studentIds.includes(student.id)"
                />
                <label
                  :for="`student-${student.id}`"
                  class="text-sm"
                >
                  {{ student.firstName }} {{ student.lastName }} ({{
                    student.studentId
                  }})
                </label>
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
        </div>

        <p class="text-xs text-muted-foreground">
          You can add more students later
        </p>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Cancel
        </Button>
        <Button :disabled="isSubmitDisabled" @click="handleSubmit">
          Create Unit
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
<script setup lang="ts">
import type { StudentWithUnit } from '~/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  editingStudent: StudentWithUnit | null;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (
    e: 'submit',
    form: {
      firstName: string;
      lastName: string;
      studentId: string;
    }
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const studentForm = ref({
  firstName: '',
  lastName: '',
  studentId: '',
});

// Reset form when dialog opens with editing student
watch(
  () => props.editingStudent,
  (student) => {
    if (student) {
      studentForm.value = {
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId,
      };
    } else {
      studentForm.value = {
        firstName: '',
        lastName: '',
        studentId: '',
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit('submit', studentForm.value);
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ editingStudent ? 'Edit Student' : 'Add New Student' }}
        </DialogTitle>
        <DialogDescription>
          {{
            editingStudent
              ? 'Update student information'
              : 'Enter student details'
          }}
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="name">First Name</Label>
          <Input
            id="name"
            v-model="studentForm.firstName"
            placeholder="John Doe"
          />
        </div>
        <div class="space-y-2">
          <Label for="name">Last Name</Label>
          <Input
            id="name"
            v-model="studentForm.lastName"
            placeholder="John Doe"
          />
        </div>

        <div class="space-y-2">
          <Label for="studentId">Student ID</Label>
          <Input
            id="studentId"
            v-model="studentForm.studentId"
            placeholder="STU001"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Cancel
        </Button>
        <Button @click="handleSubmit">
          {{ editingStudent ? 'Save Changes' : 'Add Student' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

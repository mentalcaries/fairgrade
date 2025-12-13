<script setup lang="ts">
import type { Unit } from '~/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  open: boolean;
  groupName: string;
  units: Unit[];
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (
    e: 'submit',
    form: {
      studentId: string;
      firstName: string;
      lastName: string;
      unitId: string;
    }
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const form = ref({
  studentId: '',
  firstName: '',
  lastName: '',
  unitId: '',
});

const isSubmitDisabled = computed(() => {
  return !form.value.studentId || !form.value.firstName || !form.value.lastName;
});

const handleSubmit = () => {
  emit('submit', form.value);
  form.value = {
    studentId: '',
    firstName: '',
    lastName: '',
    unitId: '',
  };
};

// Reset form when dialog closes
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      form.value = {
        studentId: '',
        firstName: '',
        lastName: '',
        unitId: '',
      };
    }
  }
);
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Student to Group {{ groupName }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="studentId">Student ID *</Label>
          <Input id="studentId" v-model="form.studentId" placeholder="STU001" />
        </div>

        <div class="space-y-2">
          <Label for="firstName">First Name *</Label>
          <Input id="firstName" v-model="form.firstName" placeholder="John" />
        </div>

        <div class="space-y-2">
          <Label for="lastName">Last Name *</Label>
          <Input id="lastName" v-model="form.lastName" placeholder="Doe" />
        </div>

        <div class="space-y-2">
          <Label for="unit">Unit (optional)</Label>
          <Select v-model="form.unitId">
            <SelectTrigger>
              <SelectValue placeholder="Select unit..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="unit in units" :key="unit.id" :value="unit.id">
                {{ unit.name }} - {{ unit.hospital }}
              </SelectItem>
            </SelectContent>
          </Select>
          <p class="text-xs text-muted-foreground">
            Leave empty to assign later
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Cancel
        </Button>
        <Button :disabled="isSubmitDisabled" @click="handleSubmit">
          Add Student
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

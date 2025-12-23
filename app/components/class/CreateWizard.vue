<script setup lang="ts">
import type { WizardData } from '~/types/wizard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'submit', data: WizardData): void;
}

const { open } = defineProps<Props>();
const emit = defineEmits<Emits>();

const step = ref(1);
const data = ref<WizardData>({
  yearName: '',
  startDate: '',
  endDate: '',
});

const handleNext = () => {
  step.value = Math.min(step.value + 1, 2);
};

const handleBack = () => {
  step.value = Math.max(step.value - 1, 1);
};

const handleSubmit = () => {
  emit('submit', data.value);
  emit('update:open', false);

  // Reset form
  step.value = 1;
  data.value = {
    yearName: '',
    startDate: '',
    endDate: '',
  };
};



const isStep1Valid = computed(() => {
  return data.value.yearName && data.value.startDate && data.value.endDate;
});
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogDescription class="text-sm"
          >Step {{ step }} of 2</DialogDescription
        >
        <div class="flex gap-2 mt-2">
          <div
            v-for="s in [1, 2]"
            :key="s"
            :class="
              cn(
                'h-2 flex-1 rounded-full transition-colors',
                s <= step ? 'bg-primary' : 'bg-secondary'
              )
            "
          />
        </div>
      </DialogHeader>

      <!-- Step 1: Basic Info -->
      <div v-if="step === 1" class="space-y-6 py-4">
        <DialogTitle class="text-xl">Create Academic Year</DialogTitle>
        <div class="space-y-4">
          <div class="space-y-2">
            <Label for="yearName">Year Name</Label>
            <Input
              id="yearName"
              v-model="data.yearName"
              placeholder="e.g., 2024-2025"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="startDate">Start Date</Label>
              <Input id="startDate" v-model="data.startDate" type="date" />
            </div>
            <div class="space-y-2">
              <Label for="endDate">End Date</Label>
              <Input id="endDate" v-model="data.endDate" type="date" />
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <Button :disabled="!isStep1Valid" @click="handleNext">
            Next: Add Groups
          </Button>
        </div>
      </div>


      <div v-if="step === 2" class="space-y-6 py-4">
        <div>
          <DialogTitle class="text-xl">Review & Create</DialogTitle>
          <p class="text-sm text-muted-foreground mt-1">
            Units will be created per group as needed
          </p>
        </div>
        <div class="space-y-4">
          <div class="p-4 bg-secondary/50 rounded-lg space-y-2">
            <h4 class="font-medium text-sm">This will create:</h4>
            <ul class="text-sm text-muted-foreground space-y-1">
              <li class="flex items-start gap-2">
                <span class="text-primary">•</span>
                <span>Academic Year: {{ data.yearName }}</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary">•</span>
                <span>6 rotation groups (A through F)</span>
              </li>
            </ul>
          </div>

          <div
            class="flex items-start gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm"
          >
            <Info class="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              You can add units after creating the academic year. Each group can
              have a different number of units based on student distribution and
              hospital capacity.
            </span>
          </div>
        </div>
        <div class="flex justify-between pt-2">
          <Button variant="outline" @click="handleBack"> Back </Button>
          <Button @click="handleSubmit"> Create Academic Year </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

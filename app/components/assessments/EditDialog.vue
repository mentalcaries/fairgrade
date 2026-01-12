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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Assessment } from '~/types';

interface Props {
  open: boolean;
  assessment: Assessment | null;
  studentName: string;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (
    e: 'save',
    data: {
      attendance: number;
      factualKnowledge: number;
      clinicalApproach: number;
      reliabilityDeportment: number;
      initiative: number;
      notes: string | null;
    }
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const form = ref({
  attendance: 50,
  factualKnowledge: 50,
  clinicalApproach: 50,
  reliabilityDeportment: 50,
  initiative: 50,
  notes: '',
});

watch(
  () => props.assessment,
  (assessment) => {
    if (assessment) {
      form.value = {
        attendance: assessment.attendance,
        factualKnowledge: assessment.factualKnowledge,
        clinicalApproach: assessment.clinicalApproach,
        reliabilityDeportment: assessment.reliabilityDeportment,
        initiative: assessment.initiative,
        notes: assessment.notes || '',
      };
    }
  },
  { immediate: true }
);

const average = computed(() =>
  (
    (form.value.attendance +
      form.value.factualKnowledge +
      form.value.clinicalApproach +
      form.value.reliabilityDeportment +
      form.value.initiative) /
    5
  ).toFixed(1)
);

const finalScore = computed(() => (parseFloat(average.value) * 0.2).toFixed(2));

const handleSave = () => {
  emit('save', {
    ...form.value,
    notes: form.value.notes || null,
  });
};
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Assessment - {{ studentName }}</DialogTitle>
        <DialogDescription>
          Update assessment scores (1-100 for each criterion)
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="attendance">Attendance *</Label>
          <Input
            id="attendance"
            v-model.number="form.attendance"
            type="number"
            min="1"
            max="100"
          />
        </div>

        <div class="space-y-2">
          <Label for="factualKnowledge">Factual Knowledge *</Label>
          <Input
            id="factualKnowledge"
            v-model.number="form.factualKnowledge"
            type="number"
            min="1"
            max="100"
          />
        </div>

        <div class="space-y-2">
          <Label for="clinicalApproach">Approach to Clinical Problems *</Label>
          <Input
            id="clinicalApproach"
            v-model.number="form.clinicalApproach"
            type="number"
            min="1"
            max="100"
          />
        </div>

        <div class="space-y-2">
          <Label for="reliabilityDeportment"
            >Reliability and Deportment *</Label
          >
          <Input
            id="reliabilityDeportment"
            v-model.number="form.reliabilityDeportment"
            type="number"
            min="1"
            max="100"
          />
        </div>

        <div class="space-y-2">
          <Label for="initiative">Initiative *</Label>
          <Input
            id="initiative"
            v-model.number="form.initiative"
            type="number"
            min="1"
            max="100"
          />
        </div>

        <div class="space-y-2">
          <Label for="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            v-model="form.notes"
            placeholder="Add any additional comments..."
            class="min-h-[100px]"
          />
        </div>

        <div class="space-y-3 pt-4">
          <div
            class="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
          >
            <span class="font-medium">Average Score</span>
            <span class="text-2xl font-bold">{{ average }}</span>
          </div>

          <div
            class="flex items-center justify-between p-3 bg-primary/10 rounded-lg"
          >
            <span class="font-medium">Final Score (out of 20)</span>
            <span class="text-2xl font-bold text-primary">{{
              finalScore
            }}</span>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Cancel
        </Button>
        <Button @click="handleSave"> Save Changes </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

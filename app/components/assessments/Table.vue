<script setup lang="ts">
import type { StudentWithGrades } from '~/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getScoreColour } from '~/utils/scoreColour';
import { Pencil } from 'lucide-vue-next';

interface Props {
  students: StudentWithGrades[];
}

interface Emits {
  (e: 'edit', student: StudentWithGrades): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div class="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow class="border-border">
          <TableHead class="min-w-[130px]">Student Name</TableHead>
          <TableHead class="min-w-[110px]">Student ID</TableHead>
          <TableHead class="min-w-[120px]">Supervisor</TableHead>
          <TableHead class="text-center w-24">Attendance</TableHead>
          <TableHead class="text-center w-24">
            <span class="whitespace-normal">Factual Knowledge</span>
          </TableHead>
          <TableHead class="text-center w-24">
            <span class="whitespace-normal">Clinical Approach</span>
          </TableHead>
          <TableHead class="text-center w-24">
            <span class="whitespace-normal">Reliability and Deportment</span>
          </TableHead>
          <TableHead class="text-center w-24">Initiative</TableHead>
          <TableHead class="text-center w-20">Average</TableHead>
          <TableHead class="text-center w-24">
            <span class="whitespace-normal">Final (out of 20)</span>
          </TableHead>
          <TableHead class="text-right w-20">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="student in students"
          :key="student.id"
          class="border-border"
        >
          <TableCell class="font-semibold">
            {{ student.firstName }} {{ student.lastName }}
          </TableCell>
          <TableCell class="font-mono text-sm text-muted-foreground">
            {{ student.studentId }}
          </TableCell>
          <TableCell class="font-medium">
            {{ student.consultantName || '-' }}
          </TableCell>
          <TableCell
            :class="['text-center', getScoreColour(student.attendance)]"
          >
            {{ student.attendance ?? '-' }}
          </TableCell>
          <TableCell
            :class="['text-center', getScoreColour(student.factualKnowledge)]"
          >
            {{ student.factualKnowledge ?? '-' }}
          </TableCell>
          <TableCell
            :class="['text-center', getScoreColour(student.clinicalApproach)]"
          >
            {{ student.clinicalApproach ?? '-' }}
          </TableCell>
          <TableCell
            :class="[
              'text-center',
              getScoreColour(student.reliabilityDeportment),
            ]"
          >
            {{ student.reliabilityDeportment ?? '-' }}
          </TableCell>
          <TableCell
            :class="['text-center', getScoreColour(student.initiative)]"
          >
            {{ student.initiative ?? '-' }}
          </TableCell>
          <TableCell class="text-center">
            <span
              v-if="student.average"
              :class="[
                'font-semibold',
                getScoreColour(parseFloat(student.average)),
              ]"
            >
              {{ student.average }}
            </span>
            <span v-else class="text-muted-foreground">-</span>
          </TableCell>
          <TableCell class="text-center">
            <span v-if="student.finalScore" class="font-semibold text-primary">
              {{ student.finalScore }}
            </span>
            <span v-else class="text-muted-foreground">-</span>
          </TableCell>
          <TableCell class="text-right">
            <Button
              v-if="student.attendance !== null"
              variant="ghost"
              size="sm"
              @click="emit('edit', student)"
            >
              <Pencil class="h-4 w-4" />
            </Button>
            <!-- <span v-else class="text-muted-foreground text-sm">No assessment</span> -->
          </TableCell>
        </TableRow>
        <TableRow v-if="students.length === 0">
          <TableCell
            colspan="10"
            class="text-center py-8 text-muted-foreground"
          >
            No students found
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

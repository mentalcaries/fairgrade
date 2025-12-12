<script setup lang="ts">
import type { StudentWithGrades } from '~/composables/useAssessmentData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getScoreColour } from '~/utils/scoreColour';

interface Props {
  students: StudentWithGrades[];
}

defineProps<Props>();
</script>

<template>
  <div class="overflow-x-auto">
    <Table>
      <TableHeader>
        <TableRow class="border-border">
          <TableHead>Student Name</TableHead>
          <TableHead>Student ID</TableHead>
          <TableHead class="text-center">Technical Skills</TableHead>
          <TableHead class="text-center">Communication</TableHead>
          <TableHead class="text-center">Teamwork</TableHead>
          <TableHead class="text-center">Problem Solving</TableHead>
          <TableHead class="text-center">Creativity</TableHead>
          <TableHead class="text-center">Average</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="student in students"
          :key="student.id"
          class="border-border"
        >
          <TableCell class="font-medium">{{ student.name }}</TableCell>
          <TableCell class="font-mono text-sm text-muted-foreground">
            {{ student.studentId }}
          </TableCell>
          <TableCell
            :class="['text-center', getScoreColour(student.criterion1)]"
          >
            {{ student.criterion1 ?? '-' }}
          </TableCell>
          <TableCell
            :class="['text-center', getScoreColour(student.criterion2)]"
          >
            {{ student.criterion2 ?? '-' }}
          </TableCell>
          <TableCell
            :class="['text-center', getScoreColour(student.criterion3)]"
          >
            {{ student.criterion3 ?? '-' }}
          </TableCell>
          <TableCell
            :class="['text-center', getScoreColour(student.criterion4)]"
          >
            {{ student.criterion4 ?? '-' }}
          </TableCell>
          <TableCell
            :class="['text-center', getScoreColour(student.criterion5)]"
          >
            {{ student.criterion5 ?? '-' }}
          </TableCell>
          <TableCell class="text-center">
            <span
              v-if="student.average"
              :class="[
                'font-semibold',
                getScoreColour(Number.parseFloat(student.average)),
              ]"
            >
              {{ student.average }}
            </span>
            <span v-else class="text-muted-foreground">-</span>
          </TableCell>
        </TableRow>
        <TableRow v-if="students.length === 0">
          <TableCell colspan="8" class="text-center py-8 text-muted-foreground">
            No students found
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

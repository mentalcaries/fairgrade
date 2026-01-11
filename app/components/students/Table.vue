<script setup lang="ts">
import type { StudentWithUnit } from '~/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-vue-next';

interface Props {
  students: StudentWithUnit[];
}

interface Emits {
  (e: 'edit', student: StudentWithUnit): void;
  (e: 'delete', studentId: string): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow class="border-border">
        <TableHead>First Name</TableHead>
        <TableHead>Last Name</TableHead>
        <TableHead>Student ID</TableHead>
        <TableHead class="min-w-[140px]">Unit</TableHead>
        <TableHead class="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="student in students"
        :key="student.id"
        class="border-border"
      >
        <TableCell class="font-medium">{{ student.firstName }}</TableCell>
        <TableCell class="font-medium">{{ student.lastName }}</TableCell>
        <TableCell class="font-mono text-sm text-muted-foreground">
          {{ student.studentId }}
        </TableCell>
        <TableCell>
          <span
            v-if="student.unit"
            class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
          >
            {{ student.unit.name }}
          </span>
          <span
            v-else
            class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
          >
            Unassigned
          </span>
        </TableCell>
        <TableCell class="text-right">
          <Button variant="ghost" size="icon" @click="emit('edit', student)">
            <Pencil class="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            class="text-destructive hover:text-destructive"
            @click="emit('delete', student.id)"
          >
            <Trash2 class="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

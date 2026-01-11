<script setup lang="ts">
import type { StudentWithUnit } from '~/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useStudentFilters } from '~/composables/useStudentFilters';

definePageMeta({
  layout: 'dashboard',
});

const students = inject<Ref<StudentWithUnit[]>>('students')!;

const { searchTerm, groupFilter, unitFilter, filteredStudents } =
  useStudentFilters(students);

const studentDialogOpen = ref(false);
const editingStudent = ref<StudentWithUnit | null>(null);

const deleteStudentId = ref<string | null>(null);
const deleteDialogOpen = ref(false);
const studentToDelete = computed(() =>
  students.value?.find((s) => s.id === deleteStudentId.value)
);

const openStudentDialog = (student?: StudentWithUnit) => {
  editingStudent.value = student || null;
  studentDialogOpen.value = true;
};

// Submit Handlers
const handleStudentSubmit = (form: {
  firstName: string;
  lastName: string;
  studentId: string;
}) => {
  if (editingStudent.value) {
    console.log('Update student:', editingStudent.value.id, form);
  } else {
    console.log('Add student:', form);
  }
  studentDialogOpen.value = false;
};

const handleDeleteStudent = () => {
  if (deleteStudentId.value) {
    console.log('Delete student:', deleteStudentId.value);
    deleteDialogOpen.value = false;
    deleteStudentId.value = null;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Students</h1>
      <p class="text-muted-foreground mt-1">
        Manage students and student groups
      </p>
    </div>

    <Card class="bg-card border-border">
      <CardHeader>
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <CardTitle>Student Directory</CardTitle>
            <CardDescription
              >View and manage student information</CardDescription
            >
          </div>

          <StudentsStudentFilters
            v-model:search-term="searchTerm"
            v-model:group-filter="groupFilter"
            v-model:unit-filter="unitFilter"
          />
        </div>
      </CardHeader>

      <CardContent>
        <StudentsTable
          :students="filteredStudents"
          @edit="openStudentDialog"
          @delete="
            (id) => {
              deleteStudentId = id;
              deleteDialogOpen = true;
            }
          "
        />
      </CardContent>
    </Card>

    <!-- Dialogs -->
    <StudentsDialog
      v-model:open="studentDialogOpen"
      :editing-student="editingStudent"
      @submit="handleStudentSubmit"
    />

    <StudentsDeleteDialog
      v-model:open="deleteDialogOpen"
      :student="studentToDelete"
      @confirm="handleDeleteStudent"
      @update:open="if (!$event) deleteStudentId = null;"
    />
  </div>
</template>

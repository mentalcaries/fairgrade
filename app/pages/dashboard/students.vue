<script setup lang="ts">
import type { Student, StudentGroup } from '~/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMockData } from '~/composables/useMockData';
import { useStudentFilters } from '~/composables/useStudentFilters';
import { useStudentHelpers } from '~/composables/useStudentHelpers';

definePageMeta({
  layout: 'dashboard',
});

const { academicYears, units } = useMockData();

const { data: students } = await useFetch<Student[]>('/api/students', {
  default: () => [],
});

const { searchTerm, groupFilter, unitFilter, filteredStudents } =
  useStudentFilters(students);

// Helpers
const { getUnitLabel } = useStudentHelpers(academicYears, units);

const studentDialogOpen = ref(false);
const editingStudent = ref<Student | null>(null);

const groupDialogOpen = ref(false);
const editingGroup = ref<StudentGroup | null>(null);

const deleteStudentId = ref<string | null>(null);
const deleteDialogOpen = ref(false);
const studentToDelete = computed(() =>
  students.value?.find((s) => s.id === deleteStudentId.value)
);

const openStudentDialog = (student?: Student) => {
  editingStudent.value = student || null;
  studentDialogOpen.value = true;
};

// Submit Handlers (these would call API in real app)
const handleStudentSubmit = (form: {
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
}) => {
  if (editingStudent.value) {
    // updateStudent(editingStudent.value.id, form)
    console.log('Update student:', editingStudent.value.id, form);
  } else {
    // addStudent(form)
    console.log('Add student:', form);
  }
  studentDialogOpen.value = false;
};

const handleGroupSubmit = (form: { name: string; studentIds: string[] }) => {
  if (editingGroup.value) {
    // updateGroup(editingGroup.value.id, form)
    console.log('Update group:', editingGroup.value.id, form);
  } else {
    // addGroup(form)
    console.log('Add group:', form);
  }
  groupDialogOpen.value = false;
};

const handleDeleteStudent = () => {
  if (deleteStudentId.value) {
    // deleteStudent(deleteStudentId.value)
    console.log('Delete student:', deleteStudentId.value);
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

    <!-- Students Tab -->
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
          :get-unit-label="getUnitLabel"
          @edit="openStudentDialog"
          @delete="deleteStudentId = $event"
        />
      </CardContent>
    </Card>

    <!-- Groups Tab -->

    <!-- Dialogs -->
    <StudentsDialog
      v-model:open="studentDialogOpen"
      :editing-student="editingStudent"
      @submit="handleStudentSubmit"
    />

    <StudentsGroupDialog
      v-model:open="groupDialogOpen"
      :editing-group="editingGroup"
      :students="students"
      @submit="handleGroupSubmit"
    />

    <StudentsDeleteDialog
      v-model:open="deleteDialogOpen"
      :student="studentToDelete"
      @confirm="handleDeleteStudent"
      @update:open="if (!$event) deleteStudentId = null;"
    />
  </div>
</template>

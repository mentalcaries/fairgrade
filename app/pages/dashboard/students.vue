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
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'dashboard',
});

const students = inject<Ref<StudentWithUnit[]>>('students')!;
const refreshStudents = inject<() => Promise<void>>('refreshStudents')!;

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

const handleStudentSubmit = async (form: {
  firstName: string;
  lastName: string;
  studentId: string;
}) => {
  try {
    if (editingStudent.value) {
      await $fetch(`/api/students/${editingStudent.value.id}`, {
        method: 'PATCH',
        body: form,
      });
      toast.success('Student updated successfully');
    } else {
      await $fetch('/api/students', {
        method: 'POST',
        body: form,
      });
      toast.success('Student added successfully');
    }

    studentDialogOpen.value = false;
    await refreshStudents();
  } catch (error) {
    const err = error as { statusCode?: number; data?: { message?: string } };

    if (err.statusCode === 409) {
      toast.error('A student with this ID already exists');
    } else {
      toast.error(err.data?.message || 'Failed to save student');
    }
  }
};

const handleDeleteStudent = async () => {
  if (!deleteStudentId.value) return;

  try {
    await $fetch(`/api/students/${deleteStudentId.value}`, {
      method: 'DELETE',
    });

    toast.success('Student deleted successfully');
    deleteDialogOpen.value = false;
    deleteStudentId.value = null;
    await refreshStudents();
  } catch (error) {
    const err = error as { data?: { message?: string } };
    toast.error(err.data?.message || 'Failed to delete student');
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

<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-vue-next';
import { useAssessmentData } from '~/composables/useAssessmentData';
import type {
  Assessment,
  Consultant,
  StudentWithUnit,
  StudentWithGrades,
} from '~/types';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'dashboard',
});

const students = inject<Ref<StudentWithUnit[]>>('students')!;
const assessments = inject<Ref<Assessment[]>>('assessments')!;
const refreshAssessments = inject<() => Promise<void>>('refreshAssessments')!;
const consultants = inject<Ref<Consultant[]>>('consultants')!;

const { searchTerm, filteredStudents } = useAssessmentData(
  students,
  assessments,
  consultants
);

const editDialogOpen = ref(false);
const editingStudent = ref<StudentWithGrades | null>(null);
const isSaving = ref(false);

const handleEdit = (student: StudentWithGrades) => {
  editingStudent.value = student;
  editDialogOpen.value = true;
};

const handleSave = async (data: {
  attendance: number;
  factualKnowledge: number;
  clinicalApproach: number;
  reliabilityDeportment: number;
  initiative: number;
  notes: string | null;
}) => {
  if (!editingStudent.value) return;

  const assessment = assessments.value.find(
    (a) => a.studentId === editingStudent.value!.id
  );
  if (!assessment) return;

  isSaving.value = true;

  try {
    await $fetch(`/api/assessments/${assessment.id}`, {
      method: 'PATCH',
      body: data,
    });

    toast.success('Assessment updated successfully');
    editDialogOpen.value = false;
    await refreshAssessments();
  } catch (error) {
    const err = error as { data?: { message?: string } };
    toast.error(err.data?.message || 'Failed to update assessment');
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Assessments</h1>
      <p class="text-muted-foreground mt-1">
        View all student grades and scoring criteria
      </p>
    </div>

    <Card class="bg-card border-border">
      <CardHeader>
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <CardTitle>Student Grades</CardTitle>
            <CardDescription>
              All students with their assessment scores
            </CardDescription>
          </div>

          <div class="relative w-full sm:w-72">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              v-model="searchTerm"
              placeholder="Search by name or ID..."
              class="pl-10"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <AssessmentsTable :students="filteredStudents" @edit="handleEdit" />
      </CardContent>
    </Card>

    <AssessmentsEditDialog
      v-model:open="editDialogOpen"
      :assessment="
        editingStudent
          ? assessments.find((a) => a.studentId === editingStudent?.id) || null
          : null
      "
      :student-name="
        editingStudent
          ? `${editingStudent.firstName} ${editingStudent.lastName}`
          : ''
      "
      @save="handleSave"
    />
  </div>
</template>

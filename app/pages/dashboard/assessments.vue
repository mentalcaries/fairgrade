<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Download } from 'lucide-vue-next';
import { useAssessmentData } from '~/composables/useAssessmentData';
import type {
  Assessment,
  Consultant,
  StudentWithUnit,
  StudentWithGrades,
} from '~/types';
import { toast } from 'vue-sonner';
import { exportAssessmentsToExcel } from '~/lib/export-excel';

definePageMeta({
  layout: 'dashboard',
});

const students = inject<Ref<StudentWithUnit[]>>('students')!;
const assessments = inject<Ref<Assessment[]>>('assessments')!;
const refreshAssessments = inject<() => Promise<void>>('refreshAssessments')!;
const consultants = inject<Ref<Consultant[]>>('consultants')!;

const searchTerm = ref('');
const selectedConsultantId = ref<string>('all');

// Get students with grades from useAssessmentData
const { filteredStudents: baseFilteredStudents } = useAssessmentData(
  students,
  assessments,
  consultants
);

// Additional filtering for search and consultant
const filteredStudents = computed(() => {
  let filtered = baseFilteredStudents.value;

  // Filter by search term
  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(
      (student) =>
        student.firstName.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term) ||
        student.studentId.toLowerCase().includes(term)
    );
  }

  // Filter by consultant
  if (selectedConsultantId.value !== 'all') {
    filtered = filtered.filter((student) => {
      const assessment = assessments.value.find(
        (a) => a.studentId === student.id
      );
      return assessment?.consultantId === selectedConsultantId.value;
    });
  }

  return filtered;
});

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

const exportToExcel = () => {
  exportAssessmentsToExcel(filteredStudents.value);
  toast.success('Assessment data exported successfully');
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

          <div class="flex items-center gap-3">
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

            <Select v-model="selectedConsultantId">
              <SelectTrigger class="w-[200px]">
                <SelectValue placeholder="All Consultants" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Consultants</SelectItem>
                <SelectItem
                  v-for="consultant in consultants"
                  :key="consultant.id"
                  :value="consultant.id"
                >
                  {{ consultant.name }}
                </SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" @click="exportToExcel">
              <Download class="h-4 w-4 mr-2" />
              Export
            </Button>
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

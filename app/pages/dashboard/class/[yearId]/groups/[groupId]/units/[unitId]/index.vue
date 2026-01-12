<script setup lang="ts">
import type {
  Hospital,
  Unit,
  StudentWithUnit,
  RotationGroup,
  Consultant,
  Assessment,
} from '~/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Search,
  CheckCircle2,
  Building2,
  User,
  Users,
  BarChart3,
  UserX,
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'dashboard',
});

// Get route params
const route = useRoute();
const router = useRouter();
const yearId = route.params.yearId as string;
const groupId = route.params.groupId as string;
const unitId = route.params.unitId as string;

const rotationGroups = inject<Ref<RotationGroup[]>>('rotationGroups')!;
const units = inject<Ref<Unit[]>>('units')!;
const students = inject<Ref<StudentWithUnit[]>>('students')!;
const consultants = inject<Ref<Consultant[]>>('consultants')!;
const assessments = inject<Ref<Assessment[]>>('assessments')!;
const refreshStudents = inject<() => Promise<void>>('refreshStudents')!;
const refreshUnits = inject<() => Promise<void>>('refreshUnits')!;

const rotationGroup = computed(() =>
  rotationGroups.value?.find((g) => g.id === groupId)
);

const unit = computed(() => units.value.find((u) => u.id === unitId));

const consultant = computed(() =>
  consultants.value.find((c) => c.id === unit.value?.consultantId)
);

const unitStudents = computed(() =>
  students.value.filter((s) => s.unitId === unitId)
);

const unassignedStudents = computed(() =>
  students.value.filter((s) => s.rotationGroupId === groupId && !s.unitId)
);

const gradedStudents = computed(() =>
  unitStudents.value.filter((s) =>
    assessments.value.some((a) => a.studentId === s.id)
  )
);

const averageScore = computed(() => {
  const studentAssessments = unitStudents.value
    .map((s) => assessments.value.find((a) => a.studentId === s.id))
    .filter(Boolean);

  if (studentAssessments.length === 0) return null;

  const totalScores = studentAssessments.map((a) => {
    if (!a) return 0;
    return (
      (a.attendance +
        a.factualKnowledge +
        a.clinicalApproach +
        a.reliabilityDeportment +
        a.initiative) /
      5
    );
  });

  return (
    totalScores.reduce((sum, score) => sum + score, 0) / totalScores.length
  ).toFixed(1);
});

const searchTerm = ref('');
const filteredStudents = computed(() =>
  unitStudents.value.filter(
    (s) =>
      s.firstName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);

const editUnitOpen = ref(false);
const addStudentsOpen = ref(false);
const removeStudentDialogOpen = ref(false);
const removeStudentId = ref<string | null>(null);
const deleteUnitDialogOpen = ref(false);

const handleEditUnit = async (form: {
  hospital: Hospital;
  consultantId: string;
}) => {
  if (!unit.value) return;

  try {
    await $fetch(`/api/units/${unit.value.id}`, {
      method: 'PATCH',
      body: form,
    });

    toast.success('Unit updated successfully');
    editUnitOpen.value = false;
    await refreshUnits();
  } catch (error) {
    const err = error as { data?: { message?: string } };
    toast.error(err.data?.message || 'Failed to update unit');
  }
};

const handleAddStudents = async (studentIds: string[]) => {
  if (!unit.value || studentIds.length === 0) return;

  try {
    await Promise.all(
      studentIds.map((studentId) =>
        $fetch(`/api/students/${studentId}`, {
          method: 'PATCH',
          body: { unitId: unit.value!.id },
        })
      )
    );

    toast.success(`${studentIds.length} student(s) added to unit`);
    addStudentsOpen.value = false;
    await refreshStudents();
  } catch (error) {
    const err = error as { data?: { message?: string } };
    toast.error(err.data?.message || 'Failed to add students');
  }
};

const handleRemoveStudent = async () => {
  if (!removeStudentId.value) return;

  try {
    await $fetch(`/api/students/${removeStudentId.value}`, {
      method: 'PATCH',
      body: { unitId: null },
    });

    toast.success('Student removed from unit');
    removeStudentDialogOpen.value = false;
    removeStudentId.value = null;
    await refreshStudents();
  } catch (error) {
    const err = error as { data?: { message?: string } };
    toast.error(err.data?.message || 'Failed to remove student');
  }
};

const openRemoveStudentDialog = (studentId: string) => {
  removeStudentId.value = studentId;
  removeStudentDialogOpen.value = true;
};

const handleDeleteUnit = async () => {
  if (!unit.value) return;

  const unitName = unit.value.name;

  try {
    await $fetch(`/api/units/${unit.value.id}`, {
      method: 'DELETE',
    });

    toast.success(`Unit ${unitName} deleted successfully`);
    await refreshUnits();
    await refreshStudents();

    // Navigate back to group detail page
    navigateTo(`/dashboard/class/${yearId}/groups/${groupId}`);
  } catch (error) {
    const err = error as { data?: { message?: string } };
    toast.error(err.data?.message || 'Failed to delete unit');
  }
};

// 404 handling
if (!rotationGroup.value || !unit.value) {
  throw createError({ statusCode: 404, message: 'Unit not found' });
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-4">
      <Button
        variant="ghost"
        class="text-muted-foreground hover:text-foreground -ml-2"
        @click="router.push(`/dashboard/class/${yearId}/groups/${groupId}`)"
      >
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back to Group {{ rotationGroup?.name }}
      </Button>

      <div
        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-foreground">
            Unit {{ unit?.name }}
          </h1>
          <p class="text-muted-foreground mt-1">
            Group {{ rotationGroup?.name }} • {{ unit?.hospital }} •
            {{ consultant?.name || 'No consultant assigned' }}
          </p>
        </div>

        <div class="flex gap-3">
          <Button
            variant="outline"
            class="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 bg-transparent"
            @click="deleteUnitDialogOpen = true"
          >
            <Trash2 class="h-4 w-4 mr-2" />
            Delete Unit
          </Button>
          <Button variant="outline" @click="editUnitOpen = true">
            <Pencil class="h-4 w-4 mr-2" />
            Edit Unit Details
          </Button>
          <Button @click="addStudentsOpen = true">
            <Plus class="h-4 w-4 mr-2" />
            Assign Students
          </Button>
        </div>
      </div>
    </div>

    <!-- Unit Information Card -->
    <Card class="bg-card border-border">
      <CardHeader>
        <CardTitle class="text-lg">Unit Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div class="flex items-center gap-3">
            <Building2 class="h-5 w-5 text-muted-foreground" />
            <div>
              <p class="text-xs text-muted-foreground">Hospital</p>
              <p class="font-medium">{{ unit?.hospital }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <User class="h-5 w-5 text-muted-foreground" />
            <div>
              <p class="text-xs text-muted-foreground">Consultant</p>
              <p class="font-medium">{{ consultant?.name || 'Unassigned' }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Users class="h-5 w-5 text-muted-foreground" />
            <div>
              <p class="text-xs text-muted-foreground">Student Count</p>
              <p class="font-medium">{{ unitStudents.length }} students</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <CheckCircle2 class="h-5 w-5 text-muted-foreground" />
            <div>
              <p class="text-xs text-muted-foreground">Grading Status</p>
              <p class="font-medium flex items-center gap-1">
                {{ gradedStudents.length }}/{{ unitStudents.length }} graded
                <CheckCircle2
                  v-if="
                    gradedStudents.length === unitStudents.length &&
                    unitStudents.length > 0
                  "
                  class="h-4 w-4 text-emerald-500"
                />
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <BarChart3 class="h-5 w-5 text-muted-foreground" />
            <div>
              <p class="text-xs text-muted-foreground">Average Score</p>
              <p class="font-medium">
                {{ averageScore ? `${averageScore}/100` : '-' }}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Students Table -->
    <Card class="bg-card border-border">
      <CardHeader>
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <CardTitle class="text-lg">Students</CardTitle>
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              v-model="searchTerm"
              placeholder="Search students..."
              class="pl-10 w-64"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div
          v-if="unitStudents.length === 0"
          class="flex flex-col items-center justify-center py-12 text-center"
        >
          <Users class="h-12 w-12 text-muted-foreground mb-4" />
          <h3 class="text-lg font-medium mb-2">No students assigned yet</h3>
          <p class="text-muted-foreground mb-4">
            Add students to this unit to get started
          </p>
          <Button @click="addStudentsOpen = true">
            <Plus class="h-4 w-4 mr-2" />
            Add Students
          </Button>
        </div>

        <Table v-else>
          <TableHeader>
            <TableRow class="border-border">
              <TableHead>Name</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="student in filteredStudents"
              :key="student.id"
              class="border-border"
            >
              <TableCell class="font-medium">
                {{ student.firstName }} {{ student.lastName }}
              </TableCell>
              <TableCell class="font-mono text-sm text-muted-foreground">
                {{ student.studentId }}
              </TableCell>
              <TableCell>
                <span
                  v-if="assessments.some((a) => a.studentId === student.id)"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"
                >
                  <CheckCircle2 class="h-3 w-3" />
                  Graded
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
                >
                  Pending
                </span>
              </TableCell>

              <TableCell class="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  class="text-destructive hover:text-destructive"
                  @click="openRemoveStudentDialog(student.id)"
                >
                  <UserX class="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Dialogs -->
    <ClassEditUnitDialog
      v-if="unit"
      v-model:open="editUnitOpen"
      :unit="unit"
      :consultants="consultants"
      @submit="handleEditUnit"
    />

    <ClassAddStudentsToUnitDialog
      v-if="unit"
      v-model:open="addStudentsOpen"
      :unit="unit"
      :unassigned-students="unassignedStudents"
      :current-student-count="unitStudents.length"
      :group-name="rotationGroup?.name || ''"
      @submit="handleAddStudents"
    />

    <ClassRemoveStudentDialog
      v-model:open="removeStudentDialogOpen"
      :group-name="rotationGroup?.name || ''"
      @confirm="handleRemoveStudent"
    />

    <ClassDeleteUnitDialog
      v-if="unit"
      v-model:open="deleteUnitDialogOpen"
      :unit="unit"
      :students="students"
      :group-name="rotationGroup?.name || ''"
      @confirm="handleDeleteUnit"
    />
  </div>
</template>

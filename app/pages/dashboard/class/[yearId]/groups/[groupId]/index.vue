<script setup lang="ts">
import type { Hospital, Unit } from '~/types';
import { HOSPITALS } from '~/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Upload, Users, Building2 } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'dashboard',
});

const route = useRoute();
const router = useRouter();
const yearId = route.params.yearId as string;
const groupId = route.params.groupId as string;

const rotationGroups = inject<Ref<RotationGroup[]>>('rotationGroups')!;

const rotationGroup = computed(() =>
  rotationGroups.value?.find((g) => g.id === groupId)
);

if (!rotationGroup.value) {
  throw createError({ statusCode: 404, message: 'Rotation group not found' });
}

// Filter data for this group
const groupUnits = computed(() =>
  units.filter((c) => c.rotationGroupId === groupId && c.classId === yearId)
);

const groupStudents = computed(() =>
  students.filter((s) => s.rotationGroupId === groupId && s.classId === yearId)
);

const unassignedStudents = computed(() =>
  groupStudents.value.filter((s) => !s.unitId)
);

// Stats
const totalStudents = computed(() => groupStudents.value.length);
const totalUnits = computed(() => groupUnits.value.length);
const gradedCount = computed(() => rotationGroup.value?.gradedCount || 0);

// Group units by hospital
const unitsByHospital = computed(() => {
  const grouped: Record<Hospital, Unit[]> = {
    'San Fernando General Hospital': [],
    'Port of Spain General Hospital': [],
    "Mount Hope Women's Hospital": [],
    'Sangre Grande Hospital': [],
  };

  groupUnits.value.forEach((unit) => {
    grouped[unit.hospital].push(unit);
  });

  return grouped;
});

// Calculate next unit name
const nextUnitName = computed(() => {
  const existingNumbers = groupUnits.value
    .map((c) => Number.parseInt(c.name.slice(1)))
    .filter((n) => !isNaN(n));
  const maxNumber =
    existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  return `${rotationGroup.value?.name}${maxNumber + 1}`;
});

// Dialog states
const bulkImportOpen = ref(false);
const addStudentOpen = ref(false);
const addUnitOpen = ref(false);
const deleteUnitDialogOpen = ref(false);
const deleteUnitOpen = ref<Unit | null>(null);
const preselectedHospital = ref<Hospital | undefined>(undefined);

// Handlers
const handleAddStudent = (form: {
  studentId: string;
  firstName: string;
  lastName: string;
  unitId: string;
}) => {
  // addStudent({...})
  console.log('Add student:', form);
  addStudentOpen.value = false;
};

const handleAddUnit = (form: {
  hospital: Hospital;
  instructorId: string;
  studentIds: string[];
}) => {
  // addUnit({...})
  console.log('Add unit:', form);
  addUnitOpen.value = false;
};

const handleBulkImport = (
  data: Array<{ studentId: string; firstName: string; lastName: string }>
) => {
  // Bulk import students
  console.log('Bulk import:', data);
  bulkImportOpen.value = false;
};

const handleDeleteUnit = () => {
  if (!deleteUnitOpen.value) return;

  const unitName = deleteUnitOpen.value.name;
  // deleteUnit(deleteUnitOpen.value.id)
  console.log('Delete unit:', deleteUnitOpen.value.id);

  toast.success(`Unit ${unitName} deleted successfully`);
  deleteUnitDialogOpen.value = false;
  deleteUnitOpen.value = null;
};

const handleViewUnit = (unitId: string) => {
  navigateTo(`/dashboard/class/${yearId}/groups/${groupId}/units/${unitId}`);
};

const openAddUnitDialog = (hospital?: Hospital) => {
  preselectedHospital.value = hospital;
  addUnitOpen.value = true;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-4">
      <Button
        variant="ghost"
        class="text-muted-foreground hover:text-foreground -ml-2"
        @click="router.push('/dashboard/class')"
      >
        <ArrowLeft class="h-4 w-4 mr-2" />
        Back to Class Management
      </Button>

      <div
        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-foreground">
            Group {{ rotationGroup?.name }}
          </h1>
          <p class="text-muted-foreground mt-1">
            {{ formatDate(rotationGroup!.startDate) }} -
            {{ formatDate(rotationGroup!.endDate) }}
          </p>
          <p class="text-sm text-muted-foreground mt-1">
            {{ totalStudents }} students • {{ totalUnits }} units •
            {{ gradedCount }}/{{ totalStudents }} graded
          </p>
        </div>

        <div class="flex gap-3">
          <Button variant="outline" @click="bulkImportOpen = true">
            <Upload class="h-4 w-4 mr-2" />
            Bulk Import Students
          </Button>
          <Button @click="addStudentOpen = true">
            <Plus class="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <Card
      v-if="groupUnits.length === 0 && groupStudents.length === 0"
      class="bg-card border-border"
    >
      <CardContent
        class="flex flex-col items-center justify-center py-12 text-center"
      >
        <Users class="h-12 w-12 text-muted-foreground mb-4" />
        <h3 class="text-lg font-medium mb-2">Import students to get started</h3>
        <p class="text-muted-foreground mb-4">
          Add students to this group, then organize them into units
        </p>
        <Button @click="bulkImportOpen = true">
          <Upload class="h-4 w-4 mr-2" />
          Bulk Import Students
        </Button>
      </CardContent>
    </Card>

    <!-- Units by hospital -->
    <div v-for="hospital in HOSPITALS" :key="hospital" class="space-y-4">
      <template
        v-if="unitsByHospital[hospital].length > 0 || groupUnits.length > 0"
      >
        <div class="flex items-center gap-2">
          <Building2 class="h-5 w-5 text-muted-foreground" />
          <h2 class="text-lg font-semibold">{{ hospital }}</h2>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ClassUnitCard
            v-for="unit in unitsByHospital[hospital]"
            :key="unit.id"
            :unit="unit"
            :students="students"
            :instructor="instructors.find((i) => i.id === unit.instructorId)"
            :year-id="yearId"
            :group-id="groupId"
            @view="handleViewUnit(unit.id)"
            @delete="
              deleteUnitOpen = unit;
              deleteUnitDialogOpen = true;
            "
          />

          <ClassAddUnitCard @click="openAddUnitDialog(hospital)" />
        </div>
      </template>
    </div>

    <!-- Add first unit prompt -->
    <Card
      v-if="groupUnits.length === 0 && groupStudents.length > 0"
      class="bg-card border-border"
    >
      <CardContent class="flex flex-col items-center justify-center py-8">
        <h3 class="text-lg font-medium mb-2">Add your first unit</h3>
        <p class="text-muted-foreground mb-4 text-center">
          Organize your {{ groupStudents.length }} students into units by
          hospital
        </p>
        <Button @click="addUnitOpen = true">
          <Plus class="h-4 w-4 mr-2" />
          Add Unit
        </Button>
      </CardContent>
    </Card>

    <!-- Dialogs -->
    <ClassBulkImportDialog
      v-model:open="bulkImportOpen"
      :group-name="rotationGroup?.name || ''"
      @import="handleBulkImport"
    />

    <ClassAddStudentDialog
      v-model:open="addStudentOpen"
      :group-name="rotationGroup?.name || ''"
      :units="groupUnits"
      @submit="handleAddStudent"
    />

    <ClassAddUnitDialog
      v-model:open="addUnitOpen"
      :group-name="rotationGroup?.name || ''"
      :next-unit-name="nextUnitName"
      :preselected-hospital="preselectedHospital"
      :unassigned-students="unassignedStudents"
      :instructors="instructors"
      @submit="handleAddUnit"
    />

    <ClassDeleteUnitDialog
      v-model:open="deleteUnitDialogOpen"
      :unit="deleteUnitOpen"
      :students="students"
      :group-name="rotationGroup?.name || ''"
      @confirm="handleDeleteUnit"
    />
  </div>
</template>

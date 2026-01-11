<script setup lang="ts">
import type {
  Consultant,
  Hospital,
  RotationGroup,
  Student,
  StudentWithUnit,
  Unit,
} from '~/types';
import { HOSPITALS } from '~/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Plus,
  Upload,
  Users,
  Building2,
  Calendar,
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { formatDate } from '~/lib/format-date';

definePageMeta({
  layout: 'dashboard',
});

const route = useRoute();
const router = useRouter();
const classId = route.params.yearId as string;
const groupId = route.params.groupId as string;

const rotationGroups = inject<Ref<RotationGroup[]>>('rotationGroups')!;
const consultants = inject<Ref<Consultant[]>>('consultants')!;

const { openSetDates } = useRotationGroupDates();

const rotationGroup = computed(() =>
  rotationGroups.value?.find((g) => g.id === groupId)
);

if (!rotationGroup.value) {
  throw createError({ statusCode: 404, message: 'Rotation group not found' });
}
const units = inject<Ref<Unit[]>>('units')!;
const students = inject<Ref<StudentWithUnit[]>>('students')!;
const refreshUnits = inject<() => Promise<void>>('refreshUnits')!;
const refreshStudents = inject<() => Promise<void>>('refreshStudents')!;

const hasDates = computed(
  () => rotationGroup.value?.startDate && rotationGroup.value?.endDate
);

const groupUnits = computed(() =>
  units.value.filter((u) => u.rotationGroupId === groupId)
);

const groupStudents = computed(() =>
  students.value.filter((s) => s.rotationGroupId === groupId)
);

const unassignedStudents = computed(() =>
  groupStudents.value.filter((s: Student) => !s.unitId)
);

const totalStudents = computed(() => groupStudents.value.length);
const totalUnits = computed(() => groupUnits.value.length);

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

const nextUnitName = computed(() => {
  const existingNumbers = groupUnits.value
    .map((c) => Number.parseInt(c.name.slice(1)))
    .filter((n) => !isNaN(n));
  const maxNumber =
    existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  return `${rotationGroup.value?.name}${maxNumber + 1}`;
});

const bulkImportOpen = ref(false);
const addStudentOpen = ref(false);
const addUnitOpen = ref(false);
const editUnitOpen = ref(false);
const editUnitData = ref<Unit | null>(null);
const deleteUnitDialogOpen = ref(false);
const deleteUnitOpen = ref<Unit | null>(null);
const preselectedHospital = ref<Hospital | undefined>(undefined);

// Handlers
const handleAddStudent = async (form: {
  studentId: string;
  firstName: string;
  lastName: string;
  unitId: string;
}) => {
  try {
    await $fetch('/api/students', {
      method: 'POST',
      body: {
        studentId: form.studentId,
        firstName: form.firstName,
        lastName: form.lastName,
        classId,
        rotationGroupId: groupId,
        unitId: form.unitId || null,
      },
    });

    toast.success('Student added successfully');
    addStudentOpen.value = false;

    await refreshStudents();
  } catch (error) {
    const err = error as { statusCode?: number; data?: { message?: string } };

    if (err.statusCode === 409) {
      toast.error('A student with this ID already exists');
    } else {
      toast.error(err.data?.message || 'Failed to add student');
    }
  }
};

const handleAddUnit = async (form: {
  hospital: Hospital;
  consultantId: string;
  studentIds: string[];
}) => {
  try {
    // Create the unit
    const newUnit = await $fetch<Unit>('/api/units', {
      method: 'POST',
      body: {
        name: nextUnitName.value,
        hospital: form.hospital,
        consultantId: form.consultantId || null,
        rotationGroupId: groupId,
        classId,
      },
    });

    if (newUnit && form.studentIds.length > 0) {
      await Promise.all(
        form.studentIds.map((studentId) =>
          $fetch(`/api/students/${studentId}`, {
            method: 'PATCH',
            body: {
              unitId: newUnit.id,
            },
          })
        )
      );
    }

    toast.success(`Unit ${nextUnitName.value} created successfully`);
    addUnitOpen.value = false;

    // Refresh the units list and students
    await refreshUnits();
    await refreshStudents();
  } catch (error) {
    const err = error as { data?: { message?: string } };
    toast.error(err.data?.message || 'Failed to create unit');
  }
};

const handleEditUnit = async (form: {
  hospital: Hospital;
  consultantId: string;
}) => {
  if (!editUnitData.value) return;

  try {
    await $fetch(`/api/units/${editUnitData.value.id}`, {
      method: 'PATCH',
      body: {
        hospital: form.hospital,
        consultantId: form.consultantId || null,
      },
    });

    toast.success(`Unit ${editUnitData.value.name} updated successfully`);
    editUnitOpen.value = false;
    editUnitData.value = null;

    await refreshUnits();
  } catch (error) {
    const err = error as { data?: { message?: string } };
    toast.error(err.data?.message || 'Failed to update unit');
  }
};

const handleBulkImport = async () => {
  bulkImportOpen.value = false;
  await refreshStudents();
};

const handleDeleteUnit = async () => {
  if (!deleteUnitOpen.value) return;

  const unitName = deleteUnitOpen.value.name;
  const unitId = deleteUnitOpen.value.id;

  try {
    await $fetch(`/api/units/${unitId}`, {
      method: 'DELETE',
    });

    toast.success(`Unit ${unitName} deleted successfully`);
    deleteUnitDialogOpen.value = false;
    deleteUnitOpen.value = null;

    await refreshUnits();
    await refreshStudents();
  } catch (error) {
    const err = error as { data?: { message?: string } };
    toast.error(err.data?.message || 'Failed to delete unit');
  }
};

const handleViewUnit = (unitId: string) => {
  navigateTo(`/dashboard/class/${classId}/groups/${groupId}/units/${unitId}`);
};

const openAddUnitDialog = (hospital?: Hospital) => {
  preselectedHospital.value = hospital;
  addUnitOpen.value = true;
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

          <!-- Show dates if set, otherwise show button -->
          <div v-if="hasDates" class="text-muted-foreground mt-1">
            <p>
              {{ formatDate(rotationGroup!.startDate) }} -
              {{ formatDate(rotationGroup!.endDate) }}
            </p>
          </div>
          <div v-else class="mt-2">
            <Button
              variant="outline"
              size="sm"
              @click="openSetDates(rotationGroup!)"
            >
              <Calendar class="h-4 w-4 mr-2" />
              Set Rotation Dates
            </Button>
          </div>

          <p class="text-sm text-muted-foreground mt-1">
            {{ totalStudents }} students • {{ totalUnits }} units •
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
            :consultant="consultants.find((c) => c.id === unit.consultantId)"
            :year-id="classId"
            :group-id="groupId"
            @view="handleViewUnit(unit.id)"
            @edit="
              editUnitData = unit;
              editUnitOpen = true;
            "
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
      :class-id="classId"
      :rotation-group-id="groupId"
      @success="handleBulkImport"
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
      :consultants="consultants"
      @submit="handleAddUnit"
    />

    <ClassDeleteUnitDialog
      v-model:open="deleteUnitDialogOpen"
      :unit="deleteUnitOpen"
      :students="students"
      :group-name="rotationGroup?.name || ''"
      @confirm="handleDeleteUnit"
    />
    <ClassEditUnitDialog
      v-if="editUnitData"
      v-model:open="editUnitOpen"
      :unit="editUnitData"
      :consultants="consultants"
      @submit="handleEditUnit"
    />
  </div>
</template>

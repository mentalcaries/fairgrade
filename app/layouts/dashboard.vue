<script setup lang="ts">
import type {
  Assessment,
  Class,
  RotationGroup,
  StudentWithUnit,
  Unit,
} from '~/types';

const { data: classes, refresh: refreshClasses } = await useFetch<Class[]>(
  '/api/classes',
  {
    default: () => [],
  }
);

const activeClass = computed(() => classes.value.find((c) => c.isActive));

const { data: rotationGroups, refresh: refreshRotationGroups } = await useFetch<
  RotationGroup[]
>('/api/rotation-groups', {
  query: computed(() => ({ classId: activeClass.value?.id || '' })),
  watch: [activeClass],
});
const { data: consultants, refresh: refreshConsultants } = await useFetch(
  '/api/consultants',
  {
    default: () => [],
  }
);

const { data: students, refresh: refreshStudents } = await useFetch<
  StudentWithUnit[]
>('/api/students', {
  default: () => [],
});

const { data: units, refresh: refreshUnits } = await useFetch<Unit[]>(
  '/api/units',
  {
    default: () => [],
  }
);

const { data: assessments, refresh: refresAssessments } = await useFetch<
  Assessment[]
>('/api/assessments', {
  query: computed(() => ({ classId: activeClass.value?.id || '' })),
  watch: [activeClass],
  default: () => [],
});

provide('classes', classes);
provide('rotationGroups', rotationGroups);
provide('refreshClasses', refreshClasses);
provide('refreshRotationGroups', refreshRotationGroups);
provide('consultants', consultants);
provide('refreshConsultants', refreshConsultants);
provide('students', students);
provide('units', units);
provide('refreshStudents', refreshStudents);
provide('refreshUnits', refreshUnits);
provide('assessments', assessments);
provide('refreshAssessments', refresAssessments);

const { setDatesOpen, selectedGroup, handleSetDates } = useRotationGroupDates();
</script>

<template>
  <div class="min-h-screen bg-background">
    <DashboardNav />
    <main class="lg:pl-64">
      <div class="p-6 lg:p-8">
        <slot />
      </div>
    </main>
    <ClassEditRotationGroupDatesDialog
      v-if="selectedGroup"
      v-model:open="setDatesOpen"
      :group="selectedGroup"
      @submit="handleSetDates"
    />
  </div>
</template>

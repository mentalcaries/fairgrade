<script setup lang="ts">
import type { Class, RotationGroup } from '~/types';

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

provide('classes', classes);
provide('rotationGroups', rotationGroups);
provide('refreshClasses', refreshClasses);
provide('refreshRotationGroups', refreshRotationGroups);
</script>

<template>
  <div class="min-h-screen bg-background">
    <DashboardNav />
    <main class="lg:pl-64">
      <div class="p-6 lg:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

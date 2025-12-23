<script setup lang="ts">
import type { Class } from '~/types';
import type { WizardData } from '~/types/wizard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Plus,
  Calendar,
  ChevronDown,
  ChevronRight,
  Archive,
} from 'lucide-vue-next';
import { useMockData } from '~/composables/useMockData';

definePageMeta({
  layout: 'dashboard',
});

// Get mock data (replace with API calls later)
const { academicYears } = useMockData();

// Dialog states
const wizardOpen = ref(false);
const archivedOpen = ref(false);

// Filter years
const activeYear = computed(() => academicYears.find((y) => y.isActive));
const archivedYears = computed(() => academicYears.filter((y) => !y.isActive));

// Handlers
const handleCreateYear = (data: WizardData) => {

};

const handleManageGroup = (yearId: string, groupId: string) => {
  navigateTo(`/dashboard/class/${yearId}/groups/${groupId}`);
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
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1 class="text-3xl font-bold text-foreground">Class Management</h1>
        <p class="text-muted-foreground mt-1">
          Manage rotation groups and units
        </p>
      </div>
      <Button @click="wizardOpen = true">
        <Plus class="h-4 w-4 mr-2" />
        New Academic Year
      </Button>
    </div>

    <!-- Active Year -->
    <div v-if="activeYear" class="space-y-4">
      <div class="flex items-center gap-3">
        <h2 class="text-xl font-semibold">{{ activeYear.name }}</h2>
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"
        >
          Active
        </span>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ClassRotationGroupCard
          v-for="group in activeYear.rotationGroups"
          :key="group.id"
          :group="group"
          :year-id="activeYear.id"
          @manage="handleManageGroup(activeYear.id, group.id)"
        />
      </div>
    </div>

    <!-- No Active Year -->
    <Card v-if="!activeYear" class="bg-card border-border">
      <CardContent
        class="flex flex-col items-center justify-center py-12 text-center"
      >
        <Calendar class="h-12 w-12 text-muted-foreground mb-4" />
        <h3 class="text-lg font-medium mb-2">No Active Academic Year</h3>
        <p class="text-muted-foreground mb-4">
          Create a new academic year to get started
        </p>
        <Button @click="wizardOpen = true">
          <Plus class="h-4 w-4 mr-2" />
          New Academic Year
        </Button>
      </CardContent>
    </Card>

    <!-- Archived Years -->
    <Collapsible v-if="archivedYears.length > 0" v-model:open="archivedOpen">
      <CollapsibleTrigger as-child>
        <Button
          variant="ghost"
          class="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronDown v-if="archivedOpen" class="h-4 w-4" />
          <ChevronRight v-else class="h-4 w-4" />
          <Archive class="h-4 w-4" />
          Archived Years ({{ archivedYears.length }})
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent class="mt-4">
        <div class="space-y-2">
          <Card
            v-for="year in archivedYears"
            :key="year.id"
            class="bg-card border-border"
          >
            <CardContent class="flex items-center justify-between py-4">
              <div>
                <h3 class="font-medium">{{ year.name }}</h3>
                <p class="text-sm text-muted-foreground">
                  {{ formatDate(year.startDate) }} -
                  {{ formatDate(year.endDate) }}
                </p>
              </div>
              <Button variant="outline" size="sm"> View Archive </Button>
            </CardContent>
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>

    <!-- Wizard Dialog -->
    <ClassCreateWizard
      v-model:open="wizardOpen"
      @submit="handleCreateYear"
    />
  </div>
</template>

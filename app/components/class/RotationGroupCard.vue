<script setup lang="ts">
import type { RotationGroup } from '~/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, PencilIcon } from 'lucide-vue-next';

interface Props {
  group: RotationGroup;
  yearId: string;
}

interface Emits {
  (e: 'manage' | 'editDates'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// const progress = computed(() => {
//   return props.group.studentCount > 0
//     ? (props.group.gradedCount / props.group.studentCount) * 100
//     : 0;
// });

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
</script>

<template>
  <Card class="bg-card border-border hover:shadow-md transition-shadow">
    <CardHeader class="pb-3">
      <div class="flex items-center justify-between">
        <CardTitle class="text-lg font-semibold"
          >Group {{ group.name }}</CardTitle
        >
        <!-- <ClassStatusBadge :status="group.status" /> -->
      </div>
    </CardHeader>

    <CardContent class="space-y-4">
      <div class="flex items-center gap-2">
        <!-- Show dates with edit button if dates exist -->
        <template v-if="group.startDate && group.endDate">
          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar class="h-4 w-4" />
            <span>
              {{ formatDate(group.startDate) }} -
              {{ formatDate(group.endDate) }}
            </span>
          </div>
          <Button variant="ghost" size="sm" @click.stop="emit('editDates')">
            <PencilIcon />
          </Button>
        </template>

        <!-- Show "Set Dates" button if dates don't exist -->
        <Button
          v-else
          variant="outline"
          size="sm"
          @click.stop="emit('editDates')"
        >
          <Calendar class="h-4 w-4 mr-2" />
          Set Dates
        </Button>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-muted-foreground" />
          <!-- <span>{{ group.studentCount }} students</span> -->
        </div>
        <!-- <div class="text-muted-foreground">{{ group.unitCount }} units</div> -->
      </div>

      <div class="space-y-1">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">Grading progress</span>
          <span class="font-medium">
            <!-- {{ group.gradedCount }}/{{ group.studentCount }} -->
          </span>
        </div>
        <div class="h-2 bg-secondary rounded-full overflow-hidden">
          <!-- <div
            class="h-full bg-primary rounded-full transition-all"
            :style="{ width: `${progress}%` }"
          /> -->
        </div>
      </div>

      <Button
        variant="outline"
        class="w-full bg-transparent"
        @click="emit('manage')"
      >
        Manage
      </Button>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-vue-next';
import type { RotationGroup } from '~/types';

interface Props {
  searchTerm: string;
  groupFilter: string;
  unitFilter: string;
  rotationGroups: RotationGroup[];
}

interface Emits {
  (
    e: 'update:searchTerm' | 'update:groupFilter' | 'update:unitFilter',
    value: string
  ): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <div class="relative">
      <Search
        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
      />
      <Input
        placeholder="Search students..."
        class="pl-10 w-64"
        type="text"
        :model-value="searchTerm"
        @update:model-value="emit('update:searchTerm', String($event))"
      />
    </div>

    <Select
      :model-value="groupFilter"
      @update:model-value="emit('update:groupFilter', String($event))"
    >
      <SelectTrigger class="w-40">
        <SelectValue placeholder="All Groups" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Groups</SelectItem>
        <SelectItem
          v-for="group in rotationGroups"
          :key="group.id"
          :value="group.id"
        >
          Group {{ group.name }}
        </SelectItem>
      </SelectContent>
    </Select>

    <Select
      :model-value="unitFilter"
      @update:model-value="emit('update:unitFilter', String($event))"
    >
      <SelectTrigger class="w-[150px]">
        <SelectValue placeholder="All Units" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Units</SelectItem>
        <SelectItem value="assigned">Assigned</SelectItem>
        <SelectItem value="unassigned">Unassigned</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

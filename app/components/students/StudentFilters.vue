<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-vue-next'

interface Props {
  searchTerm: string
  groupFilter: string
  cohortFilter: string
}

interface Emits {
  (e: 'update:searchTerm', value: string): void
  (e: 'update:groupFilter', value: string): void
  (e: 'update:cohortFilter', value: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <div class="flex flex-wrap gap-3">
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search students..."
        class="pl-10 w-64"
        :model-value="searchTerm"
        @update:model-value="emit('update:searchTerm', $event)"
      />
    </div>
    
    <Select :model-value="groupFilter" @update:model-value="emit('update:groupFilter', $event)">
      <SelectTrigger class="w-[130px]">
        <SelectValue placeholder="All Groups" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Groups</SelectItem>
        <SelectItem value="A">Group A</SelectItem>
        <SelectItem value="B">Group B</SelectItem>
        <SelectItem value="C">Group C</SelectItem>
        <SelectItem value="D">Group D</SelectItem>
        <SelectItem value="E">Group E</SelectItem>
        <SelectItem value="F">Group F</SelectItem>
      </SelectContent>
    </Select>
    
    <Select :model-value="cohortFilter" @update:model-value="emit('update:cohortFilter', $event)">
      <SelectTrigger class="w-[130px]">
        <SelectValue placeholder="All Cohorts" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Cohorts</SelectItem>
        <SelectItem value="assigned">Assigned</SelectItem>
        <SelectItem value="unassigned">Unassigned</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

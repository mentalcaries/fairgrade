<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-vue-next';
import { useMockData } from '~/composables/useMockData';
import { useAssessmentData } from '~/composables/useAssessmentData';

definePageMeta({
  layout: 'dashboard',
});
// Get mock data (replace with API calls later)
const { students, assessments } = useMockData();

// Process assessment data
const { searchTerm, filteredStudents } = useAssessmentData(
  students,
  assessments
);
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
        </div>
      </CardHeader>

      <CardContent>
        <AssessmentsTable :students="filteredStudents" />
      </CardContent>
    </Card>
  </div>
</template>

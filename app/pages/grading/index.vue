<script setup lang="ts">
import { CheckCircle2, GraduationCap, LogOut } from 'lucide-vue-next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import type { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Slider from '~/components/ui/slider/Slider.vue';

import {
  initialStudents as students,
  initialAssessments as assessments,
} from '#imports';
import { signOut, useSession } from '~/lib/auth-client';

const session = useSession()

const scores = ref<Record<ScoreKey, number>>({
  criterion1: 50,
  criterion2: 50,
  criterion3: 50,
  criterion4: 50,
  criterion5: 50,
});

const submitted = ref(false);
const selectedStudent = ref('');

type ScoreKey =
  | 'criterion1'
  | 'criterion2'
  | 'criterion3'
  | 'criterion4'
  | 'criterion5';

interface Criterion {
  key: ScoreKey; // Instead of just 'string'
  label: string;
  description: string;
}


const criteria: Criterion[] = [
  {
    key: 'criterion1',
    label: 'Technical Skills',
    description: 'Proficiency in technical concepts and tools',
  },
  {
    key: 'criterion2',
    label: 'Communication',
    description: 'Clarity and effectiveness in communication',
  },
  {
    key: 'criterion3',
    label: 'Teamwork',
    description: 'Collaboration and contribution to team efforts',
  },
  {
    key: 'criterion4',
    label: 'Problem Solving',
    description: 'Ability to analyze and solve complex problems',
  },
  {
    key: 'criterion5',
    label: 'Creativity',
    description: 'Innovation and creative thinking',
  },
];

const handleScoreChange = (key: string, value: number[]) => {
  if (value[0]) scores.value[key as keyof typeof scores.value] = value[0];
  // any additional logic...
};

const handleSubmit = () => {
  if (!selectedStudent.value) return;

  // addAssessment({
  //   studentId: selectedStudent,
  //   ...scores,
  //   submittedBy: user?.id || 'unknown',
  //   submittedAt: new Date().toISOString().split('T')[0],
  // });

  submitted.value = true;
  setTimeout(() => {
    submitted.value = false;
    selectedStudent.value = '';
    scores.value = {
      criterion1: 75,
      criterion2: 75,
      criterion3: 75,
      criterion4: 75,
      criterion5: 75,
    };
  }, 2000);
};

const handleLogout = async () => {
  await signOut();
  navigateTo('/login');
};

const average = (
  (scores.value.criterion1 +
    scores.value.criterion2 +
    scores.value.criterion3 +
    scores.value.criterion4 +
    scores.value.criterion5) /
  5
).toFixed(1);

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-accent';
  if (score >= 50) return 'text-chart-3';
  return 'text-destructive';
};

// Filter out students who already have assessments
const availableStudents = students.filter(
  (s) => !assessments.some((a) => a.studentId === s.id)
);
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b border-border bg-card">
      <div class="container mx-auto px-4 py-4">
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <GraduationCap class="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 class="font-semibold text-foreground">FairGrade</h1>
              <p class="text-xs text-muted-foreground">Grading Form</p>
            </div>
          </div>
          <div class="flex items-center justify-between gap-4 sm:justify-end">
            <span class="text-sm text-muted-foreground truncate">
              Signed in as <span class="text-foreground">{{ session.data?.user.name }}</span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              class="shrink-0"
              @click="handleLogout"
            >
              <LogOut class="h-4 w-4 sm:mr-2" />
              <span class="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6 sm:py-8 max-w-3xl">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-foreground">
          Submit Student Assessment
        </h2>
        <p class="text-muted-foreground mt-1">
          Evaluate student performance across five key criteria
        </p>
      </div>

      <Card v-if="submitted" class="bg-card border-border">
        <CardContent class="flex flex-col items-center justify-center py-16">
          <div
            class="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4"
          >
            <CheckCircle2 class="h-8 w-8 text-accent" />
          </div>
          <h3 class="text-xl font-semibold mb-2">Assessment Submitted!</h3>
          <p class="text-muted-foreground">
            The grades have been recorded successfully.
          </p>
        </CardContent>
      </Card>
      <Card v-else class="bg-card border-border">
        <CardHeader>
          <CardTitle>Select Student</CardTitle>
          <CardDescription>Choose a student to assess</CardDescription>
        </CardHeader>
        <CardContent class="space-y-8">
          <div class="space-y-2">
            <Label>Student</Label>
            <Select v-model="selectedStudent" value="{selectedStudent}">
              <SelectTrigger>
                <SelectValue placeholder="Select a student..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="student in availableStudents"
                  :key="student.id"
                  :value="student.id"
                >
                  {{ student.name }} ({{ student.studentId }})
                </SelectItem>
                <SelectItem
                  v-if="availableStudents.length === 0"
                  value="none"
                  disabled
                >
                  All students have been assessed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <template v-if="selectedStudent">
            <div class="space-y-6">
              <div
                v-for="criterion in criteria"
                :key="criterion.key"
                class="space-y-3"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <Label class="text-base">{{ criterion.label }}</Label>
                    <p class="text-sm text-muted-foreground">
                      {{ criterion.description }}
                    </p>
                  </div>
                  <span
                    :class="`text-2xl font-bold ${getScoreColor(scores[criterion.key as keyof typeof scores])}`"
                  >
                    {{ scores[criterion.key as keyof typeof scores] }}
                  </span>
                </div>
                <Slider
                  :default-value="[scores[criterion.key as keyof typeof scores]]"
                  :value="[scores[criterion.key as keyof typeof scores]]"
                  :min="0"
                  :max="100"
                  :step="1"
                  class="w-full"
                  @update:model-value="
                    (value) => handleScoreChange(criterion.key, value!)
                  "
                />
                <div class="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            <div
              class="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
            >
              <span class="font-medium">Average Score</span>
              <span
                :class="`text-3xl font-bold ${getScoreColor(
                  Number.parseFloat(average)
                )}`"
                >{{ average }}</span
              >
            </div>

            <Button class="w-full" size="lg" @click="handleSubmit">
              Submit Assessment
            </Button>
          </template>
        </CardContent>
      </Card>
    </main>
  </div>
</template>

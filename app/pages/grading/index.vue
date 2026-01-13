<script setup lang="ts">
import { CheckCircle2, GraduationCap, LogOut } from 'lucide-vue-next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Slider from '~/components/ui/slider/Slider.vue';
import { signOut } from '~/lib/auth-client';
import { toast } from 'vue-sonner';

const { data: consultant } = await useFetch('/api/consultants/me');

const { data: activeClass } = await useFetch('/api/classes', {
  transform: (classes) => classes.find((c) => c.isActive),
});

const { data: students } = await useFetch('/api/students', {
  query: computed(() => ({
    consultantId: consultant.value?.id,
    classId: activeClass.value?.id || '',
  })),
  default: () => [],
});

const { data: assessments, refresh: refreshAssessments } = await useFetch(
  '/api/assessments',
  {
    query: computed(() => ({
      consultantId: consultant.value?.id,
      classId: activeClass.value?.id || '',
    })),
    default: () => [],
  }
);

type ScoreKey =
  | 'attendance'
  | 'factualKnowledge'
  | 'clinicalApproach'
  | 'reliabilityDeportment'
  | 'initiative';

interface Criterion {
  key: ScoreKey;
  label: string;
  description: string;
}

const criteria: Criterion[] = [
  {
    key: 'attendance',
    label: 'Attendance',
    description: 'Punctuality and presence in clinical activities',
  },
  {
    key: 'factualKnowledge',
    label: 'Factual Knowledge',
    description: 'Understanding of medical facts and concepts',
  },
  {
    key: 'clinicalApproach',
    label: 'Approach to Clinical Problems',
    description: 'Problem-solving and clinical reasoning',
  },
  {
    key: 'reliabilityDeportment',
    label: 'Reliability and Deportment',
    description: 'Professional behavior and dependability',
  },
  {
    key: 'initiative',
    label: 'Initiative',
    description: 'Self-motivation and proactive learning',
  },
];

const scores = ref<Record<ScoreKey, number>>({
  attendance: 50,
  factualKnowledge: 50,
  clinicalApproach: 50,
  reliabilityDeportment: 50,
  initiative: 50,
});

const notes = ref('');
const submitted = ref(false);
const selectedStudent = ref('');
const isSubmitting = ref(false);
const submitConfirmOpen = ref(false);
const selectedStudentName = computed(() => {
  const student = students.value.find((s) => s.id === selectedStudent.value);
  return student ? `${student.firstName} ${student.lastName}` : '';
});

const openSubmitDialog = () => {
  if (!selectedStudent.value) return;
  submitConfirmOpen.value = true;
};

const handleScoreChange = (key: string, value: number[]) => {
  if (value[0]) scores.value[key as ScoreKey] = value[0];
};

const handleSubmit = async () => {
  if (!selectedStudent.value || !consultant.value) return;

  isSubmitting.value = true;

  try {
    await $fetch('/api/assessments', {
      method: 'POST',
      body: {
        studentId: selectedStudent.value,
        consultantId: consultant.value.id,
        ...scores.value,
        notes: notes.value || null,
      },
    });

    toast.success('Assessment submitted successfully');
    submitted.value = true;
    submitConfirmOpen.value = false;

    await refreshAssessments();

    setTimeout(() => {
      submitted.value = false;
      selectedStudent.value = '';
      notes.value = '';
      scores.value = {
        attendance: 50,
        factualKnowledge: 50,
        clinicalApproach: 50,
        reliabilityDeportment: 50,
        initiative: 50,
      };
    }, 2000);
  } catch (error) {
    const err = error as { data?: { message?: string } };
    toast.error(err.data?.message || 'Failed to submit assessment');
  } finally {
    isSubmitting.value = false;
  }
};

const handleLogout = async () => {
  await signOut();
  navigateTo('/login');
};

const availableStudents = computed(() =>
  students.value.filter(
    (s) => !assessments.value.some((a) => a.studentId === s.id)
  )
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
              Signed in as
              <span class="text-foreground">{{ consultant?.name }}</span>
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

      <!-- Assessment Progress Badge -->
      <div class="mb-4">
        <span
          :class="[
            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
            assessments.length === students.length
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-blue-100 text-blue-700',
          ]"
        >
          {{
            assessments.length === students.length
              ? 'All assessments completed'
              : `${assessments.length}/${students.length} assessed`
          }}
        </span>
      </div>

      <Card v-if="submitted" class="bg-card border-border">
        <CardContent class="flex flex-col items-center justify-center py-16">
          <div
            class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
          >
            <CheckCircle2 class="h-8 w-8 text-emerald-600" />
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
            <Select
              v-model="selectedStudent"
              :disabled="availableStudents.length === 0"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a student..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="student in availableStudents"
                  :key="student.id"
                  :value="student.id"
                >
                  {{ student.firstName }} {{ student.lastName }} ({{
                    student.studentId
                  }})
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
                  <span class="text-2xl font-bold">
                    {{ scores[criterion.key] }}
                  </span>
                </div>
                <Slider
                  :default-value="[scores[criterion.key]]"
                  :value="[scores[criterion.key]]"
                  :min="1"
                  :max="100"
                  :step="1"
                  class="w-full"
                  @update:model-value="
                    (value) => handleScoreChange(criterion.key, value!)
                  "
                />
                <div class="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>


            <Button class="w-full my-5" size="lg" @click="openSubmitDialog">
              Submit Assessment
            </Button>
          </template>
        </CardContent>
      </Card>
    </main>
    <GradingSubmitConfirmDialog
      v-model:open="submitConfirmOpen"
      :student-name="selectedStudentName"
      :loading="isSubmitting"
      @confirm="handleSubmit"
    />
  </div>
</template>

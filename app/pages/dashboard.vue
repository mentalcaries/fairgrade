<script setup>
import { ref, computed } from 'vue';

// import DashboardHeader from '~/components/DashboardHeader.vue';
// import StatsGrid from './components/StatsGrid.vue';
// import RecentAssessments from './components/RecentAssessments.vue';
// import PerformanceCategories from './components/PerformanceCategories.vue';
// import UpcomingAssessments from './components/UpcomingAssessments.vue';
// import AlertsPanel from './components/AlertsPanel.vue';

const activeNav = ref('assessments');

const sectionData = {
  assessments: {
    title: 'Assessments',
    description: 'Manage and review student evaluations',
    action: 'New Assessment',
  },
  students: {
    title: 'Students',
    description: 'View and manage enrolled medical students',
    action: 'Add Student',
  },
  instructors: {
    title: 'Instructors',
    description: 'Manage faculty and clinical instructors',
    action: 'Add Instructor',
  },
};

const currentSection = computed(() => sectionData[activeNav.value]);

const recentAssessments = [
  {
    id: 1,
    student: 'Emily Thompson',
    initials: 'ET',
    type: 'Clinical Skills',
    date: 'Dec 1, 2025',
    score: 92,
    instructor: 'Dr. Martinez',
    status: 'Completed',
  },
  {
    id: 2,
    student: 'James Wilson',
    initials: 'JW',
    type: 'Patient Interview',
    date: 'Nov 30, 2025',
    score: 78,
    instructor: 'Dr. Chen',
    status: 'Completed',
  },
  {
    id: 3,
    student: 'Sarah Ahmed',
    initials: 'SA',
    type: 'Diagnostic Reasoning',
    date: 'Nov 29, 2025',
    score: 85,
    instructor: 'Dr. Patel',
    status: 'Completed',
  },
  {
    id: 4,
    student: 'Michael Park',
    initials: 'MP',
    type: 'Physical Examination',
    date: 'Nov 28, 2025',
    score: 67,
    instructor: 'Dr. Johnson',
    status: 'Pending Review',
  },
];

const performanceCategories = [
  { name: 'Clinical Knowledge', score: 82 },
  { name: 'Patient Communication', score: 76 },
  { name: 'Professional Conduct', score: 91 },
  { name: 'Technical Skills', score: 74 },
  { name: 'Critical Thinking', score: 79 },
];

const upcomingAssessments = [
  {
    id: 1,
    month: 'DEC',
    day: '05',
    title: 'OSCE Examination',
    students: 24,
    time: '9:00 AM',
  },
  {
    id: 2,
    month: 'DEC',
    day: '08',
    title: 'Clinical Rotation Review',
    students: 12,
    time: '2:00 PM',
  },
  {
    id: 3,
    month: 'DEC',
    day: '12',
    title: 'Practical Skills Assessment',
    students: 36,
    time: '10:00 AM',
  },
];

const alerts = [
  {
    id: 1,
    type: 'warning',
    title: '5 students below passing threshold',
    description: 'Review performance reports and schedule remediation',
  },
  {
    id: 2,
    type: 'critical',
    title: '3 assessments overdue for review',
    description: 'Pending instructor sign-off required',
  },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans">
    <div class="flex">
      <AppSidebar v-model:activeNav="activeNav" />

      <main class="flex-1 overflow-auto">
        <DashboardHeader :section="currentSection" />
        <NuxtPage />
        <div class="p-8">
          <!-- <StatsGrid :stats="stats" /> -->

          <div class="grid grid-cols-3 gap-6">
            <!-- <RecentAssessments :assessments="recentAssessments" /> -->
            <!-- <PerformanceCategories :categories="performanceCategories" /> -->
          </div>

          <div class="grid grid-cols-2 gap-6 mt-6">
            <!-- <UpcomingAssessments :assessments="upcomingAssessments" /> -->
            <!-- <AlertsPanel :alerts="alerts" /> -->
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

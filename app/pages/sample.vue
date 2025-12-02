<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans">
    <div class="flex">
      <!-- Sidebar -->
      <aside
        class="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col"
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <h1 class="font-semibold text-gray-900">MedAssess</h1>
              <p class="text-xs text-gray-500">Student Evaluation</p>
            </div>
          </div>
        </div>

        <!-- New navigation: Assessments, Students, Instructors -->
        <nav class="flex-1 p-4">
          <ul class="space-y-1">
            <li v-for="item in navItems" :key="item.id">
              <button
                @click="activeNav = item.id"
                :class="[
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  activeNav === item.id
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
                <component :is="item.icon" class="w-5 h-5" />
                {{ item.label }}
                <span
                  v-if="item.count"
                  :class="[
                    'ml-auto text-xs px-2 py-0.5 rounded-full',
                    activeNav === item.id
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600',
                  ]"
                >
                  {{ item.count }}
                </span>
              </button>
            </li>
          </ul>
        </nav>

        <div class="p-4 border-t border-gray-200">
          <div class="flex items-center gap-3">
            <div
              class="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600"
            >
              DR
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                Dr. Rebecca Chen
              </p>
              <p class="text-xs text-gray-500">Program Director</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 overflow-auto">
        <!-- Dynamic header based on selected section -->
        <header class="bg-white border-b border-gray-200 px-8 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold text-gray-900">
                {{ currentSection.title }}
              </h2>
              <p class="text-sm text-gray-500">
                {{ currentSection.description }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <button
                class="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Export
              </button>
              <button
                class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-700 transition-colors"
              >
                {{ currentSection.action }}
              </button>
            </div>
          </div>
        </header>

        <!-- Dashboard Content -->
        <div class="p-8">
          <!-- Medical assessment stats -->
          <div class="grid grid-cols-4 gap-6 mb-8">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div class="flex items-center justify-between mb-4">
                <span class="text-sm font-medium text-gray-500">{{
                  stat.label
                }}</span>
                <span
                  :class="[
                    'text-xs font-medium px-2 py-1 rounded-full',
                    stat.trend === 'up'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-amber-50 text-amber-700',
                  ]"
                >
                  {{ stat.change }}
                </span>
              </div>
              <p class="text-3xl font-semibold text-gray-900">
                {{ stat.value }}
              </p>
              <p class="text-sm text-gray-500 mt-1">{{ stat.subtext }}</p>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="grid grid-cols-3 gap-6">
            <!-- Recent assessments table -->
            <div class="col-span-2 bg-white rounded-xl border border-gray-200">
              <div
                class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
              >
                <h3 class="font-semibold text-gray-900">Recent Assessments</h3>
                <button
                  class="text-sm text-green-500 hover:text-green-700 font-medium"
                >
                  View All
                </button>
              </div>
              <div class="divide-y divide-gray-100">
                <div
                  v-for="assessment in recentAssessments"
                  :key="assessment.id"
                  class="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div
                    class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600"
                  >
                    {{ assessment.initials }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">
                      {{ assessment.student }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ assessment.type }} · {{ assessment.date }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p
                      :class="[
                        'text-sm font-semibold',
                        getScoreColor(assessment.score),
                      ]"
                    >
                      {{ assessment.score }}/100
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ assessment.instructor }}
                    </p>
                  </div>
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      assessment.status === 'Completed'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-amber-50 text-amber-700',
                    ]"
                  >
                    {{ assessment.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Performance by category with progress bars -->
            <div class="bg-white rounded-xl border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="font-semibold text-gray-900">
                  Performance by Category
                </h3>
              </div>
              <div class="p-6 space-y-4">
                <div
                  v-for="category in performanceCategories"
                  :key="category.name"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">{{
                      category.name
                    }}</span>
                    <span class="text-sm font-medium text-gray-900"
                      >{{ category.score }}%</span
                    >
                  </div>
                  <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-green-500 rounded-full transition-all duration-500"
                      :style="{ width: category.score + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming assessments and alerts -->
          <div class="grid grid-cols-2 gap-6 mt-6">
            <div class="bg-white rounded-xl border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="font-semibold text-gray-900">
                  Upcoming Assessments
                </h3>
              </div>
              <div class="p-6 space-y-3">
                <div
                  v-for="item in upcomingAssessments"
                  :key="item.id"
                  class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    class="w-12 h-12 bg-green-50 rounded-lg flex flex-col items-center justify-center"
                  >
                    <span class="text-xs font-medium text-green-500">{{
                      item.month
                    }}</span>
                    <span class="text-lg font-semibold text-green-700">{{
                      item.day
                    }}</span>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">
                      {{ item.title }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ item.students }} students · {{ item.time }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="font-semibold text-gray-900">Attention Required</h3>
              </div>
              <div class="p-6 space-y-3">
                <div
                  v-for="alert in alerts"
                  :key="alert.id"
                  :class="[
                    'p-4 rounded-lg border-l-4',
                    alert.type === 'warning'
                      ? 'bg-amber-50 border-amber-400'
                      : 'bg-red-50 border-red-400',
                  ]"
                >
                  <p
                    :class="[
                      'text-sm font-medium',
                      alert.type === 'warning'
                        ? 'text-amber-800'
                        : 'text-red-800',
                    ]"
                  >
                    {{ alert.title }}
                  </p>
                  <p
                    :class="[
                      'text-xs mt-1',
                      alert.type === 'warning'
                        ? 'text-amber-600'
                        : 'text-red-600',
                    ]"
                  >
                    {{ alert.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue';

const activeNav = ref('assessments');

const ClipboardIcon = {
  render: () =>
    h(
      'svg',
      {
        class: 'w-5 h-5',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
        }),
      ]
    ),
};

const UsersIcon = {
  render: () =>
    h(
      'svg',
      {
        class: 'w-5 h-5',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
        }),
      ]
    ),
};

const AcademicIcon = {
  render: () =>
    h(
      'svg',
      {
        class: 'w-5 h-5',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
      },
      [
        h('path', {
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'stroke-width': '2',
          d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
        }),
      ]
    ),
};

const navItems = [
  { id: 'assessments', label: 'Assessments', icon: ClipboardIcon, count: 24 },
  { id: 'students', label: 'Students', icon: UsersIcon, count: 156 },
  { id: 'instructors', label: 'Instructors', icon: AcademicIcon, count: 18 },
];

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

const stats = [
  {
    label: 'Total Assessments',
    value: '1,284',
    change: '+12%',
    trend: 'up',
    subtext: 'This semester',
  },
  {
    label: 'Active Students',
    value: '156',
    change: '+8%',
    trend: 'up',
    subtext: 'Currently enrolled',
  },
  {
    label: 'Avg. Score',
    value: '78.4',
    change: '+3.2',
    trend: 'up',
    subtext: 'Out of 100',
  },
  {
    label: 'Pending Reviews',
    value: '23',
    change: '-5',
    trend: 'down',
    subtext: 'Needs attention',
  },
];

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

function getScoreColor(score) {
  if (score >= 85) return 'text-green-500';
  if (score >= 70) return 'text-amber-600';
  return 'text-red-600';
}
</script>

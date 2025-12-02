<template>
  <aside
    class="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col"
  >
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center"
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
          <h1 class="font-semibold text-gray-900">FairGrade</h1>
          <p class="text-xs text-gray-500">Student Evaluation</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 p-4">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.id">
          <button
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
              activeNav === item.id
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100',
            ]"
            @click="$emit('update:activeNav', item.id)"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.label }}
            <span
              v-if="item.count"
              :class="[
                'ml-auto text-xs px-2 py-0.5 rounded-full',
                activeNav === item.id
                  ? 'bg-emerald-100 text-emerald-700'
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
            Dr. Shane Khan
          </p>
          <p class="text-xs text-gray-500">Program Director</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ClipboardPen, School, Users } from 'lucide-vue-next';
import { h } from 'vue';

defineProps({
  activeNav: {
    type: String,
    required: true,
  },
});

defineEmits(['update:activeNav']);


const navItems = [
  { id: 'assessments', label: 'Assessments', icon: ClipboardPen, count: 24 },
  { id: 'students', label: 'Students', icon: Users, count: 156 },
  { id: 'instructors', label: 'Instructors', icon: School, count: 18 },
];
</script>

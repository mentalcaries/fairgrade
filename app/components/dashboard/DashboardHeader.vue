<template>
  <header class="bg-white border-b border-gray-200 px-8 py-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-900">{{ section.title }}</h2>
        <p class="text-sm text-gray-500">{{ section.description }}</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          class="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Export
        </button>
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          {{ section.action }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  section: {
    type: Object,
    required: true,
  },
});
</script>

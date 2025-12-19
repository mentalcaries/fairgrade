<script setup lang="ts">
import { Toaster } from './components/ui/sonner';

const title = 'FairGrade - Student Assessment Platform';
const description =
  'A comprehensive grading and assessment management system for instructors';

useHead({
  bodyAttrs: {
    class: 'font-sans antialiased',
  },
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' }],
  title,
});

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster />
</template>

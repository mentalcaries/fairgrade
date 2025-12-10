<script setup lang="ts">
const title = 'FairGrade - Student Assessment Platform';
const description =
  'A comprehensive grading and assessment management system for instructors';

useHead({
  bodyAttrs: {
    class: 'font-sans antialiased',
  },
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  title,
});

useSeoMeta({
  title,
  description,
  // Either NuxtSeo SEO Experiments OR set it manually
  ogTitle: title,
  ogDescription: description,
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

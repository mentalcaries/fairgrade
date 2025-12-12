<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-background">
    <DashboardNav />
    <main class="lg:pl-64">
      <div class="p-6 lg:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

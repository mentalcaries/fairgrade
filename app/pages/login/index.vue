<script setup lang="ts">
import { GraduationCap } from 'lucide-vue-next';

</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-md">
      <div class="flex flex-col items-center mb-8">
        <div class="flex items-center gap-3 mb-2">
          <div class="p-3 bg-primary/10 rounded-xl">
            <GraduationCap class="h-8 w-8 text-primary" />
          </div>
          <h1 class="text-3xl font-bold text-foreground">FairGrade</h1>
        </div>
        <p class="text-muted-foreground text-center">
          Student Assessment Platform
        </p>
      </div>

      <LoginForm />
    </div>
  </div>
</template>

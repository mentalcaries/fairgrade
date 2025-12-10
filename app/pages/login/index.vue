<script setup lang="ts">
import { Mail, Lock, GraduationCap } from 'lucide-vue-next';
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

      <p class="text-center text-sm text-muted-foreground mt-6">
        Are you an instructor?
        <NuxtLink href="/grading/login" class="text-primary hover:underline">
          Sign in here
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

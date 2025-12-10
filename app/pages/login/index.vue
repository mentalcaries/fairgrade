<script setup lang="ts">
import { Mail, Lock, GraduationCap } from 'lucide-vue-next';

const error = null;
const isLoading = false;
const email = ref('');
const password = ref('');
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

      <Card class="border-border bg-card">
        <CardHeader>
          <CardTitle>Head Instructor Login</CardTitle>
          <CardDescription>
            Access the full dashboard to manage students, instructors, and
            assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-4">
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <div class="relative">
                <Mail
                  class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                />
                <Input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="admin@university.edu"
                  class="pl-10"
                />
              </div>
            </div>
            <div class="space-y-2">
              <Label for="password">Password</Label>
              <div class="relative">
                <Lock
                  class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                />
                <Input
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="••••••••"
                  class="pl-10"
                />
              </div>
            </div>
            <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
            <Button type="submit" class="w-full" disabled="{isLoading}">
              {{ isLoading ? 'Signing in...' : 'Sign in to Dashboard' }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p class="text-center text-sm text-muted-foreground mt-6">
        Are you an instructor?
        <Link href="/grading/login" class="text-primary hover:underline">
          Sign in here
        </Link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MailIcon } from 'lucide-vue-next';

const route = useRoute();
const email = route.query.email as string;

if (!email) {
  navigateTo('/login');
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <MailIcon class="w-16 h-16 mb-4" />
    <h1 class="text-2xl font-bold mb-2">Check your email</h1>
    <p class="text-muted-foreground text-center max-w-md">
      We sent a magic link to <strong>{{ email }}</strong>
    </p>
    <p class="text-sm text-muted-foreground mt-4">
      Click the link in the email to sign in. You can close this page.
    </p>
  </div>
</template>

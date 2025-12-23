<script setup lang="ts">
import { ShieldX } from 'lucide-vue-next';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '~/components/ui/card';
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <div
          class="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4"
        >
          <ShieldX class="w-6 h-6 text-red-600" />
        </div>
        <CardTitle class="text-2xl">Access Denied</CardTitle>
        <CardDescription>
          You don't have permission to access this application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-gray-600 text-center">
          Your account is not authorized to use FairGrade. If you believe this
          is an error, please contact your administrator.
        </p>
      </CardContent>
      <CardFooter>
        <p class="text-sm text-gray-600 text-center w-full">
          Click <NuxtLink href="/" class="underline text-primary">here</NuxtLink> to go home
        </p></CardFooter
      >
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  label: string
  value: string | number
  icon: Component
  color: string
}

defineProps<Props>()
</script>

<template>
  <Card class="bg-card border-border">
    <CardHeader class="flex flex-row items-center justify-between pb-2">
      <CardTitle class="text-sm font-medium text-muted-foreground">
        {{ label }}
      </CardTitle>
      <component :is="icon" :class="['h-5 w-5', color]" />
    </CardHeader>
    <CardContent>
      <div class="text-3xl font-bold">{{ value }}</div>
    </CardContent>
  </Card>
</template>

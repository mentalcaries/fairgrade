<script setup lang="ts">
import type { PendingAction } from '~/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, CheckCircle2 } from 'lucide-vue-next'

interface Props {
  actions: PendingAction[]
}

defineProps<Props>()
</script>

<template>
  <Card class="bg-card border-border">
    <CardHeader>
      <CardTitle>Pending Actions</CardTitle>
      <CardDescription>Items requiring your attention</CardDescription>
    </CardHeader>
    
    <CardContent>
      <div v-if="actions.length > 0" class="space-y-3">
        <NuxtLink
          v-for="action in actions"
          :key="action.id"
          :to="action.href"
          class="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
        >
          <AlertTriangle class="h-5 w-5 text-amber-500 flex-shrink-0" />
          <span class="text-sm font-medium">{{ action.message }}</span>
        </NuxtLink>
      </div>
      
      <div v-else class="text-center py-8">
        <CheckCircle2 class="h-12 w-12 text-emerald-500 mx-auto mb-3" />
        <p class="font-medium text-foreground">All caught up!</p>
        <p class="text-sm text-muted-foreground mt-1">No pending actions at this time</p>
      </div>
    </CardContent>
  </Card>
</template>

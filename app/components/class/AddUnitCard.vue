<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-vue-next'

interface Emits {
  (e: 'click'): void
}

const emit = defineEmits<Emits>()
</script>

<template>
  <Card
    class="bg-card border-border border-dashed cursor-pointer hover:border-primary/50 transition-colors"
    @click="emit('click')"
  >
    <CardContent class="flex flex-col items-center justify-center py-8 text-muted-foreground">
      <Plus class="h-8 w-8 mb-2" />
      <span class="text-sm">Add Unit</span>
    </CardContent>
  </Card>
</template>

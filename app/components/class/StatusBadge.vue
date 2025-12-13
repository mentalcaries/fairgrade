<script setup lang="ts">
import type { RotationGroup } from '~/types'
import { CheckCircle2, RefreshCw, Clock } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  status: RotationGroup['status']
}

const props = defineProps<Props>()

const config = computed(() => {
  const configs = {
    complete: { 
      icon: CheckCircle2, 
      label: 'Complete', 
      className: 'bg-emerald-100 text-emerald-700' 
    },
    active: { 
      icon: RefreshCw, 
      label: 'Active', 
      className: 'bg-blue-100 text-blue-700' 
    },
    pending: { 
      icon: Clock, 
      label: 'Pending', 
      className: 'bg-gray-100 text-gray-600' 
    },
  }
  return configs[props.status]
})
</script>

<template>
  <span :class="cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', config.className)">
    <component :is="config.icon" class="h-3 w-3" />
    {{ config.label }}
  </span>
</template>

<script setup lang="ts">
import type { Instructor } from '~/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Props {
  open: boolean
  consultant: Instructor | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'confirm'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Consultant?</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete {{ consultant?.name }}? This will remove them from all assigned cohorts.
        </DialogDescription>
      </DialogHeader>
      
      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Cancel
        </Button>
        <Button variant="destructive" @click="emit('confirm')">
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

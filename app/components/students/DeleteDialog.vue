<script setup lang="ts">
import type { Student } from '~/types'
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
  student: Student | undefined
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
        <DialogTitle>Delete Student?</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete {{ student?.name }} ({{ student?.studentId }})? 
          This action cannot be undone.
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

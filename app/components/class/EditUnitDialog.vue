<script setup lang="ts">
import type { Hospital, Instructor, Unit } from '~/types'
import { HOSPITALS } from '~/types'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle } from 'lucide-vue-next'

interface Props {
  open: boolean
  unit: Unit
  instructors: Instructor[]
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', form: { hospital: Hospital; instructorId: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref({
  hospital: props.unit.hospital,
  instructorId: props.unit.instructorId || '',
})

// Update form when unit changes
watch(() => props.unit, (unit) => {
  form.value = {
    hospital: unit.hospital,
    instructorId: unit.instructorId || '',
  }
}, { immediate: true })

const hasConsultantChanged = computed(() => {
  return form.value.instructorId !== props.unit.instructorId && props.unit.instructorId
})

const handleSubmit = () => {
  emit('submit', form.value)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Unit {{ unit.name }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="hospital">Hospital</Label>
          <Select v-model="form.hospital">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="hospital in HOSPITALS"
                :key="hospital"
                :value="hospital"
              >
                {{ hospital }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <Label for="consultant">Consultant</Label>
          <Select v-model="form.instructorId">
            <SelectTrigger>
              <SelectValue placeholder="Select consultant..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="instructor in instructors"
                :key="instructor.id"
                :value="instructor.id"
              >
                {{ instructor.name }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div
          v-if="hasConsultantChanged"
          class="flex items-start gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg text-sm"
        >
          <AlertTriangle class="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            Changing consultant will notify both the current and new consultant
          </span>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Cancel
        </Button>
        <Button @click="handleSubmit">
          Save Changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

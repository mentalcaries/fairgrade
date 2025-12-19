<script setup lang="ts">
import type { Consultant } from '~/types'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface Props {
  open: boolean
  consultant: Consultant | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', form: {
    name: string
    email: string
    isActive: boolean
  }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref({
  name: '',
  email: '',
  isActive: false,
})

// Populate form when consultant changes
watch(() => props.consultant, (consultant) => {
  if (consultant) {
    form.value = {
      name: consultant.name,
      email: consultant.email,
      isActive: consultant.isActive,
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', form.value)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Consultant</DialogTitle>
      </DialogHeader>
      
      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="editName">Name</Label>
          <Input
            id="editName"
            v-model="form.name"
            placeholder="Dr. Jane Smith"
          />
        </div>
        
        <div class="space-y-2">
          <Label for="editEmail">Email</Label>
          <Input
            id="editEmail"
            v-model="form.email"
            type="email"
            placeholder="jane.smith@university.edu"
          />
        </div>
        
        <div class="space-y-2">
          <Label>Status</Label>
          <div class="flex items-center gap-3">
            <Switch
              v-model="form.isActive"
            />
            <span class="text-sm">
              <span v-if="form.isActive" class="text-emerald-600 font-medium">
                Active
              </span>
              <span v-else class="text-gray-500">
                Inactive
              </span>
            </span>
          </div>
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

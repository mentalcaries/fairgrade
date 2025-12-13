<script setup lang="ts">
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
import { Checkbox } from '@/components/ui/checkbox'

interface Props {
  open: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', form: {
    name: string
    email: string
    status: 'active' | 'inactive'
    sendInvite: boolean
  }): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref({
  name: '',
  email: '',
  status: 'active' as 'active' | 'inactive',
  sendInvite: true,
})

// Reset form when dialog closes
watch(() => emit, () => {
  form.value = {
    name: '',
    email: '',
    status: 'active',
    sendInvite: true,
  }
})

const isSubmitDisabled = computed(() => {
  return !form.value.name || !form.value.email
})

const handleSubmit = () => {
  emit('submit', form.value)
  // Reset form
  form.value = {
    name: '',
    email: '',
    status: 'active',
    sendInvite: true,
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Consultant</DialogTitle>
      </DialogHeader>
      
      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="name">Name *</Label>
          <Input
            id="name"
            v-model="form.name"
            placeholder="Dr. Jane Smith"
          />
        </div>
        
        <div class="space-y-2">
          <Label for="email">Email *</Label>
          <Input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="jane.smith@university.edu"
          />
          <p class="text-xs text-muted-foreground">
            An invitation link will be sent to this email
          </p>
        </div>
        
        <div class="space-y-2">
          <Label>Status</Label>
          <div class="flex items-center gap-3">
            <Switch
              :checked="form.status === 'active'"
              @update:checked="form.status = $event ? 'active' : 'inactive'"
            />
            <span class="text-sm">
              <span v-if="form.status === 'active'" class="text-emerald-600 font-medium">
                Active
              </span>
              <span v-else class="text-gray-500">
                Inactive
              </span>
            </span>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <Checkbox
            id="sendInvite"
            v-model:checked="form.sendInvite"
          />
          <label
            for="sendInvite"
            class="text-sm font-medium cursor-pointer"
          >
            Send invitation email
          </label>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Cancel
        </Button>
        <Button :disabled="isSubmitDisabled" @click="handleSubmit">
          Add Consultant
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import type { Student, StudentGroup } from '~/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface Props {
  open: boolean
  editingGroup: StudentGroup | null
  students: Student[]
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'submit', form: { name: string; studentIds: string[] }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const groupForm = ref({
  name: '',
  studentIds: [] as string[],
})

// Reset form when dialog opens with editing group
watch(() => props.editingGroup, (group) => {
  if (group) {
    groupForm.value = {
      name: group.name,
      studentIds: [...group.studentIds],
    }
  } else {
    groupForm.value = {
      name: '',
      studentIds: [],
    }
  }
}, { immediate: true })

const toggleStudentInGroup = (studentId: string) => {
  if (groupForm.value.studentIds.includes(studentId)) {
    groupForm.value.studentIds = groupForm.value.studentIds.filter((id) => id !== studentId)
  } else {
    groupForm.value.studentIds = [...groupForm.value.studentIds, studentId]
  }
}

const isStudentDisabled = (studentId: string) => {
  return !groupForm.value.studentIds.includes(studentId) && groupForm.value.studentIds.length >= 6
}

const isSubmitDisabled = computed(() => {
  return groupForm.value.studentIds.length < 4 || groupForm.value.studentIds.length > 6
})

const handleSubmit = () => {
  if (groupForm.value.studentIds.length < 4 || groupForm.value.studentIds.length > 6) {
    alert('Groups must have between 4 and 6 students')
    return
  }
  emit('submit', groupForm.value)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {{ editingGroup ? 'Edit Group' : 'Create New Group' }}
        </DialogTitle>
        <DialogDescription>
          Select 4-6 students to form a group
        </DialogDescription>
      </DialogHeader>
      
      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <Label for="groupName">Group Name</Label>
          <Input
            id="groupName"
            v-model="groupForm.name"
            placeholder="Group Alpha"
          />
        </div>
        
        <div class="space-y-2">
          <Label>
            Select Students ({{ groupForm.studentIds.length }}/6 selected, min 4)
          </Label>
          <div class="max-h-60 overflow-y-auto border border-border rounded-lg p-3 space-y-2">
            <div
              v-for="student in students"
              :key="student.id"
              class="flex items-center space-x-3"
            >
              <Checkbox
                :id="student.id"
                :checked="groupForm.studentIds.includes(student.id)"
                :disabled="isStudentDisabled(student.id)"
                @update:checked="toggleStudentInGroup(student.id)"
              />
              <label
                :for="student.id"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {{ student.name }} ({{ student.studentId }})
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Cancel
        </Button>
        <Button :disabled="isSubmitDisabled" @click="handleSubmit">
          {{ editingGroup ? 'Save Changes' : 'Create Group' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

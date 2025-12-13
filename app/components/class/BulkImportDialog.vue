<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Download, CheckCircle2, Info } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

interface Props {
  open: boolean;
  groupName: string;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (
    e: 'import',
    data: Array<{ studentId: string; firstName: string; lastName: string }>
  ): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const fileInputId = useId();
const importFile = ref<File | null>(null);
const importPreview = ref<
  Array<{ studentId: string; firstName: string; lastName: string }>
>([]);

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    importFile.value = file;
    // Mock preview data - replace with actual CSV/Excel parsing
    importPreview.value = [
      { studentId: 'STU101', firstName: 'John', lastName: 'Doe' },
      { studentId: 'STU102', firstName: 'Jane', lastName: 'Smith' },
      { studentId: 'STU103', firstName: 'Bob', lastName: 'Johnson' },
      { studentId: 'STU104', firstName: 'Alice', lastName: 'Williams' },
      { studentId: 'STU105', firstName: 'Charlie', lastName: 'Brown' },
    ];
  }
};

const handleImport = () => {
  emit('import', importPreview.value);

  // Reset
  importFile.value = null;
  importPreview.value = [];
};

// Reset when dialog closes
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      importFile.value = null;
      importPreview.value = [];
    }
  }
);
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Bulk Import Students - Group {{ groupName }}</DialogTitle>
        <DialogDescription>
          Upload Excel/CSV file for Group {{ groupName }} students
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div
          :class="
            cn(
              'border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors',
              importFile
                ? 'border-primary bg-primary/5'
                : 'hover:border-muted-foreground'
            )
          "
        >
          <Input
            :id="fileInputId"
            type="file"
            accept=".csv,.xlsx,.xls"
            class="hidden"
            @change="handleFileChange"
          />
          <label :for="fileInputId" class="cursor-pointer">
            <Upload class="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p v-if="importFile" class="text-sm font-medium">
              {{ importFile.name }}
            </p>
            <template v-else>
              <p class="text-sm font-medium">
                Drop your file here or click to browse
              </p>
              <p class="text-xs text-muted-foreground mt-1">
                Supports CSV, XLSX files
              </p>
            </template>
          </label>
        </div>

        <Button variant="link" class="text-sm p-0 h-auto">
          <Download class="h-4 w-4 mr-1" />
          Download Template
        </Button>

        <div v-if="importPreview.length > 0" class="space-y-3">
          <div class="border border-border rounded-lg overflow-hidden">
            <table class="w-full text-sm">
              <thead class="bg-muted">
                <tr>
                  <th class="px-3 py-2 text-left font-medium">Student ID</th>
                  <th class="px-3 py-2 text-left font-medium">First Name</th>
                  <th class="px-3 py-2 text-left font-medium">Last Name</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, i) in importPreview"
                  :key="i"
                  class="border-t border-border"
                >
                  <td class="px-3 py-2">{{ row.studentId }}</td>
                  <td class="px-3 py-2">{{ row.firstName }}</td>
                  <td class="px-3 py-2">{{ row.lastName }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="text-sm text-emerald-600 flex items-center gap-1">
            <CheckCircle2 class="h-4 w-4" />
            {{ importPreview.length }} valid rows found
          </p>
        </div>

        <div
          class="flex items-start gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm"
        >
          <Info class="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            Students will be imported without unit assignment. Assign them to
            units after import.
          </span>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)">
          Cancel
        </Button>
        <Button :disabled="importPreview.length === 0" @click="handleImport">
          Import Students
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

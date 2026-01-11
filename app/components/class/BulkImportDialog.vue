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
import {
  Upload,
  CheckCircle2,
  Info,
  AlertCircle,
  XCircle,
} from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import * as XLSX from 'xlsx';
import { toast } from 'vue-sonner';

interface Props {
  open: boolean;
  groupName: string;
  classId: string;
  rotationGroupId: string;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'success', count: number): void;
}

interface StudentRow {
  firstName: string;
  lastName: string;
  studentId: string;
  status: 'valid' | 'duplicate' | 'invalid';
  error?: string;
}

interface ImportResult {
  success: Array<{ studentId: string; firstName: string; lastName: string }>;
  failed: Array<{
    studentId: string;
    firstName: string;
    lastName: string;
    reason: string;
  }>;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const fileInputId = useId();
const importFile = ref<File | null>(null);
const importPreview = ref<StudentRow[]>([]);
const isImporting = ref(false);
const importResults = ref<ImportResult | null>(null);

const parseExcelFile = async (file: File) => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('No sheets found in file');
  }

  const firstSheet = workbook.Sheets[firstSheetName];
  if (!firstSheet) {
    throw new Error('Could not read sheet');
  }

  const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
    header: 1,
  }) as string[][];

  if (jsonData.length === 0) {
    throw new Error('File is empty');
  }

  const headerRow = jsonData[0];

  if (!headerRow) {
    throw new Error('Could not find header row');
  }

  const firstNameCol = headerRow.findIndex((header) => {
    const lower = header?.toLowerCase() || '';
    return lower.includes('first') && lower.includes('name');
  });

  const lastNameCol = headerRow.findIndex((header) => {
    const lower = header?.toLowerCase() || '';
    return lower.includes('last') && lower.includes('name');
  });

  const studentIdCol = headerRow.findIndex((header) => {
    const lower = header?.toLowerCase() || '';
    return (
      (lower.includes('student') && lower.includes('id')) ||
      lower === 'id' ||
      lower.includes('student number') ||
      lower.includes('studentid')
    );
  });

  if (firstNameCol === -1 || lastNameCol === -1 || studentIdCol === -1) {
    throw new Error(
      'Could not find required columns: First Name, Last Name, Student ID'
    );
  }

  const students: StudentRow[] = [];
  const seenIds = new Set<string>();

  for (let i = 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row) continue;

    const firstName = row[firstNameCol]?.toString().trim();
    const lastName = row[lastNameCol]?.toString().trim();
    const studentId = row[studentIdCol]?.toString().trim();

    if (!firstName || !lastName || !studentId) {
      continue;
    }

    const isDuplicate = seenIds.has(studentId);
    seenIds.add(studentId);

    students.push({
      firstName,
      lastName,
      studentId,
      status: isDuplicate ? 'duplicate' : 'valid',
      error: isDuplicate ? 'Duplicate in file' : undefined,
    });
  }

  return students;
};

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  try {
    importFile.value = file;
    importPreview.value = await parseExcelFile(file);
  } catch (error) {
    const err = error as Error;
    toast.error(err.message || 'Failed to parse file');
    importFile.value = null;
    importPreview.value = [];
  }
};

const validStudents = computed(() =>
  importPreview.value.filter((s) => s.status === 'valid')
);

const handleImport = async () => {
  if (validStudents.value.length === 0) return;

  isImporting.value = true;

  try {
    const result = await $fetch<ImportResult>('/api/students/bulk', {
      method: 'POST',
      body: {
        students: validStudents.value.map((s) => ({
          firstName: s.firstName,
          lastName: s.lastName,
          studentId: s.studentId,
        })),
        classId: props.classId,
        rotationGroupId: props.rotationGroupId,
      },
    });

    importResults.value = result;

    if (result.success.length > 0) {
      emit('success', result.success.length);
    }
  } catch (error) {
    const err = error as { data?: { message?: string } };
    toast.error(err.data?.message || 'Failed to import students');
  } finally {
    isImporting.value = false;
  }
};

const handleClose = () => {
  emit('update:open', false);
  setTimeout(() => {
    importFile.value = null;
    importPreview.value = [];
    importResults.value = null;
  }, 200);
};

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      importFile.value = null;
      importPreview.value = [];
      importResults.value = null;
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

      <div v-if="!importResults" class="space-y-4 py-4">
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

        <div v-if="importPreview.length > 0" class="space-y-3">
          <div
            class="border border-border rounded-lg overflow-hidden max-h-64 overflow-y-auto"
          >
            <table class="w-full text-sm">
              <thead class="bg-muted sticky top-0">
                <tr>
                  <th class="px-3 py-2 text-left font-medium">Status</th>
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
                  <td class="px-3 py-2">
                    <CheckCircle2
                      v-if="row.status === 'valid'"
                      class="h-4 w-4 text-emerald-600"
                    />
                    <AlertCircle v-else class="h-4 w-4 text-amber-600" />
                  </td>
                  <td class="px-3 py-2">{{ row.studentId }}</td>
                  <td class="px-3 py-2">{{ row.firstName }}</td>
                  <td class="px-3 py-2">{{ row.lastName }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex items-center justify-between text-sm">
            <p class="text-emerald-600 flex items-center gap-1">
              <CheckCircle2 class="h-4 w-4" />
              {{ validStudents.length }} valid rows
            </p>
            <p
              v-if="importPreview.length !== validStudents.length"
              class="text-amber-600 flex items-center gap-1"
            >
              <AlertCircle class="h-4 w-4" />
              {{ importPreview.length - validStudents.length }} duplicates in
              file
            </p>
          </div>
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

      <div v-else class="py-4 space-y-4">
        <div v-if="importResults.success.length > 0" class="space-y-2">
          <p
            class="text-sm font-medium flex items-center gap-2 text-emerald-600"
          >
            <CheckCircle2 class="h-5 w-5" />
            {{ importResults.success.length }} students imported successfully
          </p>
        </div>

        <div v-if="importResults.failed.length > 0" class="space-y-2">
          <p class="text-sm font-medium flex items-center gap-2 text-red-600">
            <XCircle class="h-5 w-5" />
            {{ importResults.failed.length }} students failed to import
          </p>
          <div
            class="border border-border rounded-lg overflow-hidden max-h-48 overflow-y-auto"
          >
            <table class="w-full text-sm">
              <thead class="bg-muted sticky top-0">
                <tr>
                  <th class="px-3 py-2 text-left font-medium">Student ID</th>
                  <th class="px-3 py-2 text-left font-medium">Name</th>
                  <th class="px-3 py-2 text-left font-medium">Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(student, i) in importResults.failed"
                  :key="i"
                  class="border-t border-border"
                >
                  <td class="px-3 py-2">{{ student.studentId }}</td>
                  <td class="px-3 py-2">
                    {{ student.firstName }} {{ student.lastName }}
                  </td>
                  <td class="px-3 py-2 text-red-600">{{ student.reason }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button v-if="importResults" @click="handleClose"> Close </Button>
        <template v-else>
          <Button variant="outline" @click="handleClose"> Cancel </Button>
          <Button
            :disabled="validStudents.length === 0 || isImporting"
            @click="handleImport"
          >
            {{
              isImporting
                ? 'Importing...'
                : `Import ${validStudents.length} Students`
            }}
          </Button>
        </template>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

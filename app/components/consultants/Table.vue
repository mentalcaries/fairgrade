<script setup lang="ts">
import type { Instructor } from '~/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  UserCog,
  Pencil,
  Send,
  Trash2,
  Loader2,
  ArrowUpDown,
} from 'lucide-vue-next';

interface Props {
  consultants: Instructor[];
  sendingInviteId: string | null;
}

interface Emits {
  (e: 'edit' | 'delete' | 'sendInvite', consultant: Instructor): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow class="border-border">
        <TableHead>
          <div class="flex items-center gap-1">
            Name
            <ArrowUpDown class="h-3 w-3 text-muted-foreground" />
          </div>
        </TableHead>
        <TableHead>
          <div class="flex items-center gap-1">
            Email
            <ArrowUpDown class="h-3 w-3 text-muted-foreground" />
          </div>
        </TableHead>
        <TableHead>Status</TableHead>
        <TableHead class="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="consultant in consultants"
        :key="consultant.id"
        class="border-border"
      >
        <TableCell>
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <UserCog class="h-4 w-4 text-primary" />
            </div>
            <span class="font-medium">{{ consultant.name }}</span>
          </div>
        </TableCell>
        <TableCell class="text-muted-foreground">
          {{ consultant.email }}
        </TableCell>
        <TableCell>
          <span
            v-if="consultant.status === 'active'"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"
          >
            Active
          </span>
          <span
            v-else
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
          >
            Inactive
          </span>
        </TableCell>
        <TableCell class="text-right">
          <div class="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon"
              @click="emit('edit', consultant)"
            >
              <Pencil class="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 bg-transparent"
              :disabled="sendingInviteId === consultant.id"
              @click="emit('sendInvite', consultant)"
            >
              <Loader2
                v-if="sendingInviteId === consultant.id"
                class="h-4 w-4 animate-spin"
              />
              <template v-else>
                <Send class="h-3 w-3 mr-1" />
                Send Invite
              </template>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              class="text-destructive hover:text-destructive"
              @click="emit('delete', consultant)"
            >
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      <TableRow v-if="consultants.length === 0">
        <TableCell colspan="4" class="text-center py-8 text-muted-foreground">
          No consultants found
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

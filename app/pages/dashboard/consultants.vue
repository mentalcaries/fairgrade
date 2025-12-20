<script setup lang="ts">
import type { Consultant } from '~/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-vue-next';
import { useConsultantSorting } from '~/composables/useConsultantSorting';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'dashboard',
});

const { data: consultants, refresh } = await useFetch('/api/consultants', {
  default: () => [],
});

const { searchTerm, filteredConsultants } = useConsultantSorting(consultants);

const addDialogOpen = ref(false);
const editDialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const editingConsultant = ref<Consultant | null>(null);
const deletingConsultant = ref<Consultant | null>(null);
const sendingInviteId = ref<string | null>(null);

const openEditDialog = (consultant: Consultant) => {
  editingConsultant.value = consultant;
  editDialogOpen.value = true;
};

const openDeleteDialog = (consultant: Consultant) => {
  deletingConsultant.value = consultant;
  deleteDialogOpen.value = true;
};

const handleAddSubmit = async (form: {
  name: string;
  email: string;
  isActive: boolean;
  sendInvite: boolean;
}) => {
  await $fetch('/api/consultants', {
    method: 'POST',
    body: form,
  });

  addDialogOpen.value = false;

  toast.success(
    form.sendInvite
      ? `Invitation sent to ${form.email}`
      : "Consultant added. Don't forget to invite them."
  );
  await refresh();
};

const handleEditSubmit = async (form: {
  name: string;
  email: string;
  isActive: boolean;
}) => {
  if (editingConsultant.value) {
    await $fetch<Consultant>(`/api/consultants/${editingConsultant.value.id}`, {
      method: 'PATCH',
      body: form,
    });
    console.log('Update consultant:', editingConsultant.value.id, form);

    editDialogOpen.value = false;
    await refresh();
    toast.success('Consultant updated successfully');
  }
};

const handleDelete = async () => {
  if (!deletingConsultant.value) return;

  try {
    await $fetch<Consultant>(
      `/api/consultants/${deletingConsultant.value.id}`,
      {
        method: 'DELETE',
      }
    );

    deleteDialogOpen.value = false;
    deletingConsultant.value = null;
    await refresh();
    toast.success('Consultant deleted');
  } catch (error) {
    console.error('Failed to delete consultant:', error);
    toast.error('Failed to delete consultant');
  }
};

const handleSendInvite = async (consultant: Consultant) => {
  sendingInviteId.value = consultant.id;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  sendingInviteId.value = null;
  toast(`Invitation sent to ${consultant.email}`);
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-foreground">Consultants</h1>
      <p class="text-muted-foreground mt-1">
        Manage consultants and their assignments
      </p>
    </div>

    <Card class="bg-card border-border">
      <CardHeader>
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <CardTitle>Consultant Directory</CardTitle>
            <CardDescription>
              Add, edit, and manage consultants
            </CardDescription>
          </div>

          <div class="flex gap-3">
            <div class="relative">
              <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input
                v-model="searchTerm"
                placeholder="Search consultants..."
                class="pl-10 w-64"
              />
            </div>
            <Button type="button" @click="addDialogOpen = true">
              <Plus class="h-4 w-4 mr-2" />
              Add Consultant
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ConsultantsTable
          :consultants="filteredConsultants"
          :sending-invite-id="sendingInviteId"
          @edit="openEditDialog"
          @delete="openDeleteDialog"
          @send-invite="handleSendInvite"
        />
      </CardContent>
    </Card>

    <!-- Dialogs -->
    <ConsultantsAddDialog
      v-model:open="addDialogOpen"
      @submit="handleAddSubmit"
    />

    <ConsultantsEditDialog
      v-model:open="editDialogOpen"
      :consultant="editingConsultant"
      @submit="handleEditSubmit"
    />

    <ConsultantsDeleteDialog
      v-model:open="deleteDialogOpen"
      :consultant="deletingConsultant"
      @confirm="handleDelete"
    />
  </div>
</template>

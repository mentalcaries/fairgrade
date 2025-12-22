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
import type { ConsultantForm } from '~/types/forms';

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
const sendingInviteEmail = ref<string | null>(null);

const openEditDialog = (consultant: Consultant) => {
  editingConsultant.value = consultant;
  editDialogOpen.value = true;
};

const openDeleteDialog = (consultant: Consultant) => {
  deletingConsultant.value = consultant;
  deleteDialogOpen.value = true;
};

const handleAddSubmit = async (form: ConsultantForm) => {
  try {
    const newConsultant = await $fetch('/api/consultants', {
      method: 'POST',
      body: form,
    });

    if (newConsultant && form.sendInvite) {
      await handleSendInvite(newConsultant);
    } else {
      toast.success("Consultant added. Don't forget to invite them.");
    }
    addDialogOpen.value = false;
    await refresh();
  } catch (error) {
    toast.error('Unable to add consultant');
    console.error('Error adding consultant:', error);
  }
};

const handleEditSubmit = async (form: Partial<ConsultantForm>) => {
  if (!editingConsultant.value) return;

  try {
    await $fetch<Consultant>(`/api/consultants/${editingConsultant.value.id}`, {
      method: 'PATCH',
      body: form,
    });
    editDialogOpen.value = false;
    await refresh();
    toast.success('Consultant updated successfully');
  } catch (error) {
    console.error('Failed to delete consultant:', error);
    toast.error('Unable to update consultant');
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
  sendingInviteEmail.value = consultant.email;

  try {
    await sendEmailInvite(consultant.email, consultant.name);
    sendingInviteEmail.value = null;
    toast(`Invitation sent to ${consultant.email}`);
  } catch (error) {
    console.error('Failed to invite consultant:', error);
    toast.error('Failed to invite consultant');
  }
};

const sendEmailInvite = async (email: string, name: string) => {
  await $fetch('/api/consultants/invite', {
    method: 'POST',
    body: { email, name },
  });
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
          :sending-invite-email="sendingInviteEmail"
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

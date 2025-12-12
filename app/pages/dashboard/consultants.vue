<script setup lang="ts">
import type { Instructor } from '~/types';
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
import { useMockData } from '~/composables/useMockData';
import { useConsultantSorting } from '~/composables/useConsultantSorting';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'dashboard',
});
// Get mock data (replace with API calls later)
const { instructors: consultants } = useMockData();

// Sorting and filtering
const { searchTerm, filteredConsultants } = useConsultantSorting(consultants);

// Dialog states
const addDialogOpen = ref(false);
const editDialogOpen = ref(false);
const deleteDialogOpen = ref(false);
const editingConsultant = ref<Instructor | null>(null);
const deletingConsultant = ref<Instructor | null>(null);
const sendingInviteId = ref<string | null>(null);

// Dialog handlers
const openEditDialog = (consultant: Instructor) => {
  editingConsultant.value = consultant;
  editDialogOpen.value = true;
};

const openDeleteDialog = (consultant: Instructor) => {
  deletingConsultant.value = consultant;
  deleteDialogOpen.value = true;
};

// Submit handlers (these would call API in real app)
const handleAddSubmit = (form: {
  name: string;
  email: string;
  status: 'active' | 'inactive';
  sendInvite: boolean;
}) => {
  // addConsultant({
  //   name: form.name,
  //   email: form.email,
  //   status: form.status,
  //   assignedStudentIds: [],
  //   assignedGroupIds: [],
  // })
  console.log('Add consultant:', form);

  addDialogOpen.value = false;

  if (form.sendInvite) {
    toast.success(`Invitation sent to ${form.email}`);
  } else {
    toast('Consultant added successfully');
  }
};

const handleEditSubmit = (form: {
  name: string;
  email: string;
  status: 'active' | 'inactive';
}) => {
  if (editingConsultant.value) {
    // updateConsultant(editingConsultant.value.id, form)
    console.log('Update consultant:', editingConsultant.value.id, form);

    editDialogOpen.value = false;
    toast.success('Consultant updated successfully');
  }
};

const handleDelete = () => {
  if (deletingConsultant.value) {
    // deleteConsultant(deletingConsultant.value.id)
    console.log('Delete consultant:', deletingConsultant.value.id);

    deleteDialogOpen.value = false;
    deletingConsultant.value = null;
    toast.success('Consultant deleted');
  }
};

const handleSendInvite = async (consultant: Instructor) => {
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
            <Button @click="addDialogOpen = true">
              <Plus class="h-4 w-4 mr-2" />
              Add Consultant
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ConsultantsConsultantTable
          :consultants="filteredConsultants"
          :sending-invite-id="sendingInviteId"
          @edit="openEditDialog"
          @delete="openDeleteDialog"
          @send-invite="handleSendInvite"
        />
      </CardContent>
    </Card>

    <!-- Dialogs -->
    <ConsultantsAddConsultantDialog
      v-model:open="addDialogOpen"
      @submit="handleAddSubmit"
    />

    <ConsultantsEditConsultantDialog
      v-model:open="editDialogOpen"
      :consultant="editingConsultant"
      @submit="handleEditSubmit"
    />

    <ConsultantsDeleteConsultantDialog
      v-model:open="deleteDialogOpen"
      :consultant="deletingConsultant"
      @confirm="handleDelete"
    />
  </div>
</template>

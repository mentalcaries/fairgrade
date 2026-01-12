import { toast } from 'vue-sonner';
import type { RotationGroup } from '~/types';

export const useRotationGroupDates = () => {
  const setDatesOpen = useState('rotation-group-set-dates-open', () => false);
  const selectedGroup = useState<RotationGroup | null>(
    'rotation-group-selected',
    () => null
  );

  const openSetDates = (group: RotationGroup) => {
    selectedGroup.value = group;
    setDatesOpen.value = true;
  };

  const handleSetDates = async (dates: {
    startDate: string;
    endDate: string;
  }) => {
    if (!selectedGroup.value) return;

    try {
      await $fetch(`/api/rotation-groups/${selectedGroup.value.id}`, {
        method: 'PATCH',
        body: dates,
      });

      toast.success('Rotation dates updated successfully');
      setDatesOpen.value = false;
      selectedGroup.value = null;
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Failed to update dates');
    }
  };
  return {
    setDatesOpen,
    selectedGroup,
    openSetDates,
    handleSetDates,
  };
};

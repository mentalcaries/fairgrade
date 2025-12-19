import type { Consultant } from '~/types';

export function useConsultantSorting(consultants: Ref<Consultant[]>) {
  const searchTerm = ref('');

  // Sort consultants: Active first, then alphabetically
  const sortedConsultants = computed(() => {
    return [...consultants.value].sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return a.name.localeCompare(b.name);
    });
  });

  const filteredConsultants = computed(() => {
    return sortedConsultants.value.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  });

  return {
    searchTerm,
    sortedConsultants,
    filteredConsultants,
  };
}

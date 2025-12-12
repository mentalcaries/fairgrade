import type { Instructor } from '~/types'

export function useConsultantSorting(consultants: Instructor[]) {
  const searchTerm = ref('')

  // Sort consultants: Active first, then alphabetically
  const sortedConsultants = computed(() => {
    return [...consultants].sort((a, b) => {
      if (a.status === 'active' && b.status === 'inactive') return -1
      if (a.status === 'inactive' && b.status === 'active') return 1
      return a.name.localeCompare(b.name)
    })
  })

  const filteredConsultants = computed(() => {
    return sortedConsultants.value.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  })

  return {
    searchTerm,
    sortedConsultants,
    filteredConsultants,
  }
}

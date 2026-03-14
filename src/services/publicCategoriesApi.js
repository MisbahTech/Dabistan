import { useQuery } from '@tanstack/react-query'
import { getPublicJSON } from './publicApiClient'
import { queryKeys } from './queryKeys'

export const publicCategoriesApi = {
  list() {
    return getPublicJSON('/public/categories')
  },
}

export function usePublicCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.publicCategories(),
    queryFn: () => publicCategoriesApi.list(),
  })
}

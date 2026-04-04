import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteJSON, getJSON, postJSON, putJSON } from './apiClient'
import { queryKeys } from './queryKeys'

export const categoriesApi = {
  list() {
    return getJSON('/categories')
  },
  create(payload) {
    return postJSON('/categories', payload)
  },
  update(id, payload) {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid category id for update')
    }
    return putJSON(`/categories/${id}`, payload)
  },
  remove(id) {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid category id for delete')
    }
    return deleteJSON(`/categories/${id}`)
  },
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () => categoriesApi.list(),
  })
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => categoriesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() })
    },
  })
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => categoriesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() })
    },
  })
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => categoriesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories() })
    },
  })
}

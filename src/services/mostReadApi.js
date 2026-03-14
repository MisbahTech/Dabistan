import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteJSON, getJSON, postJSON, putJSON } from './apiClient'
import { queryKeys } from './queryKeys'

export const mostReadApi = {
  list() {
    return getJSON('/most-read')
  },
  create(payload) {
    return postJSON('/most-read', payload)
  },
  update(id, payload) {
    return putJSON(`/most-read/${id}`, payload)
  },
  remove(id) {
    return deleteJSON(`/most-read/${id}`)
  },
}

export function useMostReadQuery() {
  return useQuery({
    queryKey: queryKeys.mostRead(),
    queryFn: () => mostReadApi.list(),
  })
}

export function useCreateMostReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => mostReadApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mostRead() })
    },
  })
}

export function useUpdateMostReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => mostReadApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mostRead() })
    },
  })
}

export function useDeleteMostReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => mostReadApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mostRead() })
    },
  })
}

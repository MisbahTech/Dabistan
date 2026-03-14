import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getJSON, postJSON, putJSON, deleteJSON } from './apiClient'

export const rolesApi = {
  list(params = {}) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
    ).toString()
    return getJSON(`/roles${query ? `?${query}` : ''}`)
  },
  getOne(id) {
    return getJSON(`/roles/${id}`)
  },
  create(payload) {
    return postJSON('/roles', payload)
  },
  update(id, payload) {
    return putJSON(`/roles/${id}`, payload)
  },
  remove(id) {
    return deleteJSON(`/roles/${id}`)
  },
}

export function useRolesQuery(params = {}) {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => rolesApi.list(params),
  })
}

export function useCreateRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => rolesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => rolesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })
}

export function useDeleteRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => rolesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })
}

import { getJSON, postJSON, putJSON, deleteJSON } from './apiClient'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const permissionsApi = {
  list: async (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
    ).toString()
    return getJSON(`/permissions${query ? `?${query}` : ''}`)
  },
  get: async (id) => {
    return getJSON(`/permissions/${id}`)
  },
  create: async (data) => {
    return postJSON('/permissions', data)
  },
  update: async ({ id, ...data }) => {
    return putJSON(`/permissions/${id}`, data)
  },
  delete: async (id) => {
    return deleteJSON(`/permissions/${id}`)
  }
}

export function usePermissionsQuery(params = {}) {
  return useQuery({
    queryKey: ['permissions', params],
    queryFn: () => permissionsApi.list(params)
  })
}

export function useCreatePermissionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: permissionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
    }
  })
}

export function useUpdatePermissionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: permissionsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
    }
  })
}

export function useDeletePermissionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: permissionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
    }
  })
}

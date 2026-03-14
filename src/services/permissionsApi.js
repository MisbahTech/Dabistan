import apiClient from './apiClient'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const permissionsApi = {
  list: async (params = {}) => {
    const response = await apiClient.get('/permissions', { params })
    return response.data
  },
  get: async (id) => {
    const response = await apiClient.get(`/permissions/${id}`)
    return response.data
  },
  create: async (data) => {
    const response = await apiClient.post('/permissions', data)
    return response.data
  },
  update: async ({ id, ...data }) => {
    const response = await apiClient.put(`/permissions/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/permissions/${id}`)
    return response.data
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

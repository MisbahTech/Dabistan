import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteJSON, getJSON, postJSON, putJSON } from './apiClient'
import { queryKeys } from './queryKeys'

export const usersApi = {
  list() {
    return getJSON('/users')
  },
  create(payload) {
    return postJSON('/users', payload)
  },
  update(id, payload) {
    return putJSON(`/users/${id}`, payload)
  },
  updatePassword(id, payload) {
    return putJSON(`/users/${id}/password`, payload)
  },
  remove(id) {
    return deleteJSON(`/users/${id}`)
  },
}

export function useUsersQuery() {
  return useQuery({
    queryKey: queryKeys.users(),
    queryFn: () => usersApi.list(),
  })
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => usersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users() })
    },
  })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => usersApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users() })
    },
  })
}

export function useUpdateUserPasswordMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => usersApi.updatePassword(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users() })
    },
  })
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => usersApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users() })
    },
  })
}

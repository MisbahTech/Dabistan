import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteJSON, getJSON, postJSON, putJSON } from './apiClient'
import { queryKeys } from './queryKeys'

export const postsApi = {
  list(params = {}) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
    ).toString()
    return getJSON(`/posts${query ? `?${query}` : ''}`)
  },
  create(payload) {
    return postJSON('/posts', payload)
  },
  update(id, payload) {
    return putJSON(`/posts/${id}`, payload)
  },
  remove(id) {
    return deleteJSON(`/posts/${id}`)
  },
}

export function usePostsQuery(params = {}) {
  return useQuery({
    queryKey: queryKeys.posts(params),
    queryFn: () => postsApi.list(params),
  })
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => postsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => postsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => postsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

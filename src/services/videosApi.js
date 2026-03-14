import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteJSON, getJSON, postJSON, putJSON } from './apiClient'
import { queryKeys } from './queryKeys'

export const videosApi = {
  list() {
    return getJSON('/videos')
  },
  create(payload) {
    return postJSON('/videos', payload)
  },
  update(id, payload) {
    return putJSON(`/videos/${id}`, payload)
  },
  remove(id) {
    return deleteJSON(`/videos/${id}`)
  },
}

export function useVideosQuery() {
  return useQuery({
    queryKey: queryKeys.videos(),
    queryFn: () => videosApi.list(),
  })
}

export function useCreateVideoMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => videosApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos() })
    },
  })
}

export function useUpdateVideoMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => videosApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos() })
    },
  })
}

export function useDeleteVideoMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => videosApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videos() })
    },
  })
}

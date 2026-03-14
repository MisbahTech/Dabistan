import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteJSON, getJSON, postJSON, putJSON } from './apiClient'
import { queryKeys } from './queryKeys'

export const weatherApi = {
  list() {
    return getJSON('/weather')
  },
  create(payload) {
    return postJSON('/weather', payload)
  },
  update(id, payload) {
    return putJSON(`/weather/${id}`, payload)
  },
  remove(id) {
    return deleteJSON(`/weather/${id}`)
  },
}

export function useWeatherQuery() {
  return useQuery({
    queryKey: queryKeys.weather(),
    queryFn: () => weatherApi.list(),
  })
}

export function useCreateWeatherMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => weatherApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.weather() })
    },
  })
}

export function useUpdateWeatherMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => weatherApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.weather() })
    },
  })
}

export function useDeleteWeatherMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => weatherApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.weather() })
    },
  })
}

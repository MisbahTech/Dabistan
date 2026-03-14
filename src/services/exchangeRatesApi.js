import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteJSON, getJSON, postJSON, putJSON } from './apiClient'
import { queryKeys } from './queryKeys'

export const exchangeRatesApi = {
  list() {
    return getJSON('/exchange-rates')
  },
  create(payload) {
    return postJSON('/exchange-rates', payload)
  },
  update(id, payload) {
    return putJSON(`/exchange-rates/${id}`, payload)
  },
  remove(id) {
    return deleteJSON(`/exchange-rates/${id}`)
  },
}

export function useExchangeRatesQuery() {
  return useQuery({
    queryKey: queryKeys.exchangeRates(),
    queryFn: () => exchangeRatesApi.list(),
  })
}

export function useCreateExchangeRateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => exchangeRatesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRates() })
    },
  })
}

export function useUpdateExchangeRateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => exchangeRatesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRates() })
    },
  })
}

export function useDeleteExchangeRateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => exchangeRatesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exchangeRates() })
    },
  })
}

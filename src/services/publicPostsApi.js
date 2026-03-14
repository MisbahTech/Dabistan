import { useQuery } from '@tanstack/react-query'
import { getPublicJSON } from './publicApiClient'
import { queryKeys } from './queryKeys'

export const publicPostsApi = {
  list(params = {}) {
    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    if (params.category) query.set('category', params.category)

    const suffix = query.toString()
    return getPublicJSON(`/public/posts${suffix ? `?${suffix}` : ''}`)
  },
  getBySlug(slug) {
    return getPublicJSON(`/public/posts/${slug}`)
  },
}

export function usePublicPostsQuery(params = {}) {
  return useQuery({
    queryKey: queryKeys.publicPosts(params),
    queryFn: () => publicPostsApi.list(params),
  })
}

export function usePublicPostQuery(slug) {
  return useQuery({
    queryKey: queryKeys.publicPost(slug),
    queryFn: () => publicPostsApi.getBySlug(slug),
    enabled: Boolean(slug),
  })
}

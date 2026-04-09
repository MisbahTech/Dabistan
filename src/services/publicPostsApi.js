import { useQuery } from '@tanstack/react-query'
import { getPublicJSON } from './publicApiClient'
import { queryKeys } from './queryKeys'

// This module is the public-posts data gateway for the frontend.
// Components should ask for public post data here instead of building URLs by hand.
// That keeps request shape, cache keys, and pagination behavior in one place.
export const publicPostsApi = {
  list(params = {}) {
    const query = new URLSearchParams()
    if (params.q) query.set('q', params.q)
    if (params.category) query.set('category', params.category)
    if (params.page) query.set('page', String(params.page))
    if (params.pageSize) query.set('page_size', String(params.pageSize))

    const suffix = query.toString()
    return getPublicJSON(`/public/posts${suffix ? `?${suffix}` : ''}`)
  },
  getBySlug(slug) {
    return getPublicJSON(`/public/posts/${slug}`)
  },
}

export function usePublicPostsQuery(params = {}) {
  // React Query cache keys must include the effective params.
  // Otherwise page 1, page 2, or different filters would overwrite each other in cache.
  return useQuery({
    queryKey: queryKeys.publicPosts(params),
    queryFn: () => publicPostsApi.list(params),
  })
}

export function usePublicPostQuery(slug) {
  // enabled prevents a request from running before the router has provided a valid slug.
  return useQuery({
    queryKey: queryKeys.publicPost(slug),
    queryFn: () => publicPostsApi.getBySlug(slug),
    enabled: Boolean(slug),
  })
}

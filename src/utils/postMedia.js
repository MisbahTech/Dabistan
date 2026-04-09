import { API_BASE_URL } from '../config/apiConfig'

const apiOrigin = API_BASE_URL.replace(/\/api$/, '')

export function resolveMediaUrl(value) {
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }
  if (value.startsWith('/')) {
    return `${apiOrigin}${value}`
  }
  return value
}

export function getPostGallery(post) {
  const gallery = Array.isArray(post?.gallery) ? post.gallery : []
  return [...new Set([post?.featuredImage, post?.image, ...gallery].filter(Boolean))]
}

export function getPostImage(post) {
  return getPostGallery(post)[0] || ''
}

export function getPostAttachment(post) {
  return post?.attachment?.url ? post.attachment : null
}
